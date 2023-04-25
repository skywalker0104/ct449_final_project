const fs = require("fs");
const path = require("path");

const moment = require("moment");
const Employee = require("../models/employee");
const Salary = require("../models/salary");
const Work = require("../models/work");
const Category = require("../models/category");

const CustomError = require("../error");

exports.getSalaries = async (req, res, next) => {
  try {
    let salaries = await Salary.find({ employee: req.id }).select(
      "-_id date month salary type"
    );
    res.json({
      salaries,
    });
  } catch (err) {
    next(err);
  }
};

exports.getSalariesByMonth = async (req, res, next) => {
  try {
    let cy = parseInt(moment().format("YYYY"));
    let lastyearDate = "01/02/" + (cy - 1);
    let nextYearDate = "01/31/" + (cy + 1);
    let salaries = await Salary.aggregate([
      {
        $match: {
          employee: req.id,
          month: { $gte: new Date(lastyearDate), $lte: new Date(nextYearDate) },
        },
      },
      {
        $group: {
          _id: { type: "$type", month: "$month" },
          amount: { $sum: "$salary" },
        },
      },
      { $sort: { "_id.month": 1 } },
    ]);
    res.json(salaries);
  } catch (err) {
    next(err);
  }
};

exports.getCardsData = async (req, res, next) => {
  try {
    let currentMonthSalary = 0;
    let currentMonthAdvance = 0;
    let lastMonthSalary = 0;
    let lastMonthAdvance = 0;
    let salaryGrowth = 0;
    let advanceGrowth = 0;
    let currentMonthWork = 0;
    let lastMonthWork = 0;
    let workGrowth = 0;
    let month = moment().format("M");
    let salaries = await Salary.find({
      $and: [
        { $expr: { $eq: [{ $month: "$month" }, parseInt(month)] } },
        { $expr: { $eq: ["$employee", req.id] } },
      ],
    });
    let lastMonthSalaries = await Salary.find({
      $and: [
        { $expr: { $eq: [{ $month: "$month" }, parseInt(month) - 1] } },
        { $expr: { $eq: ["$employee", req.id] } },
      ],
    });

    for (let salary of salaries) {
      if (salary.type == "Lương cứng") {
        currentMonthSalary += salary.salary;
      } else {
        currentMonthAdvance += salary.salary;
      }
    }

    for (let salary of lastMonthSalaries) {
      if (salary.type == "Lương cứng") {
        lastMonthSalary += salary.salary;
      } else {
        lastMonthAdvance += salary.salary;
      }
    }

    salaryGrowth = currentMonthSalary - lastMonthSalary;
    advanceGrowth = currentMonthAdvance - lastMonthAdvance;

    // Work Sort
    let works = await Work.aggregate([
      { $match: { employee: req.id } },
      {
        $group: {
          _id: { month: { $month: "$date" } },
        },
      },
      { $sort: { month: -1 } },
    ]);
    for (let w of works) {
      if (w._id.month == parseInt(month)) {
        currentMonthWork = lastMonthWork + 1;
      } else if (w._id.month == parseInt(month) - 1) {
        lastMonthWork += 1;
      }
    }
    workGrowth = currentMonthWork - lastMonthWork;

    res.json({
      currentMonthSalary,
      currentMonthAdvance,
      salaryGrowth,
      advanceGrowth,
      currentMonthWork,
      workGrowth,
    });
  } catch (err) {
    next(err);
  }
};

exports.getWorkChart = async (req, res, next) => {
  try {
    let works = await Work.aggregate([
      { $match: { employee: req.id } },
      {
        $group: {
          _id: { category: "$category", date: "$date" },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.json(works);
  } catch (err) {
    next(err);
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    let categories = await Category.find();
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

exports.getWorks = async (req, res, next) => {
  try {
    let works = await Work.find({ employee: req.id })
      .select("-_id category date work")
      .sort("ascending");
    res.json(works);
  } catch (err) {
    next(err);
  }
};

exports.addWork = async (req, res, next) => {
  try {
    await Work.create({
      date: req.body.date,
      work: req.body.work,
      category: req.body.category,
      employee: req.body.employee,
    });
    res.json({
      message: "Work added!",
    });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    await Employee.findByIdAndUpdate(req.id, {
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
    }).orFail(new CustomError("Employee not found", 404));
    res.json({
      message: "Profile Updated Successfully!",
    });
  } catch (err) {
    next(err);
  }
};
