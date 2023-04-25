const Employee = require("../models/employee");
const Salary = require("../models/salary");
const Work = require("../models/work");
const Admin = require("../models/admin");
const bcrypt = require("bcrypt");
const CustomError = require("../error");
const admin = require("../models/admin");

exports.getEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find();
    res.json({
      employees,
    });
  } catch (err) {
    next(err);
  }
};

exports.addEmployee = async (req, res, next) => {
  try {
    let admin = await Admin.findById(req.id);
    let hash = bcrypt.hashSync(req.body.password, 10);
    let existingEmail = await Employee.findOne({ email: req.body.email });
    if (existingEmail) {
      throw new CustomError("Email already exists!", 406);
    }
    const employee = await Employee.create({
      date: req.body.date,
      name: req.body.name,
      desg: req.body.desg,
      email: req.body.email,
      password: hash,
    });
    res.json({
      message: "New Employee Created!",
    });
  } catch (err) {
    next(err);
  }
};

exports.editEmployee = async (req, res, next) => {
  try {
    await Employee.findByIdAndUpdate(req.body.id, {
      date: req.body.date,
      name: req.body.name,
      desg: req.body.desg,
      email: req.body.email,
    }).orFail(new CustomError("Employee not found!", 404));
    res.json({
      message: "Employee edited successfully!",
    });
  } catch (err) {
    next(err);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    let password = req.body.password;
    let confPassword = req.body.password;
    if (password != confPassword) {
      throw new CustomError("Passwords do no match", 401);
    }
    let hash = bcrypt.hashSync(password, 10);
    await Employee.findByIdAndUpdate(req.body.id, {
      password: hash,
    }).orFail(new CustomError("Employee not found!", 404));
    res.json({
      message: "Password Changed Successfully!",
    });
  } catch (err) {
    next(err);
  }
};

exports.delEmployee = async (req, res, next) => {
  try {
    await Employee.findByIdAndDelete(req.body.id).orFail(
      new CustomError("Employee not found!", 404)
    );
    for (let s of employee.salaries) {
      await Salary.findByIdAndDelete(s).orFail(
        new CustomError(
          "Employee deleted but its salaries could not be deleted",
          500
        )
      );
    }

    res.json({
      message: "Employee deleted",
    });
  } catch (err) {
    next(err);
  }
};

exports.getEmployee = async (req, res, next) => {
  try {
    employee = await Employee.findById(req.params.id).populate("salaries");
    res.json({
      employee,
    });
  } catch (err) {
    next(err);
  }
};

exports.getSalaries = async (req, res, next) => {
  try {
    let salaries = await Salary.find();
    res.json({
      salaries,
    });
  } catch (err) {
    next(err);
  }
};

exports.addSalary = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.body.employee).orFail(
      new CustomError("Employee not found!", 404)
    );
    const salary = await Salary.create({
      date: req.body.date,
      salary: req.body.salary,
      month: req.body.month,
      type: req.body.type,
      employee: employee,
      employee_name: employee.name,
    });
    employee.salaries.push(salary);
    await employee.save();

    res.json({
      message: "New Salary Added!",
    });
  } catch (err) {
    next(err);
  }
};

exports.delSalary = async (req, res, next) => {
  try {
    await Salary.findByIdAndDelete(req.body.id).orFail(
      new CustomError("Salary could not be deleted", 500)
    );
    await Employee.findOneAndUpdate(
      { salaries: { $in: [req.body.id] } },
      { $pull: { salaries: { $in: req.body.id } } }
    ).orFail(new CustomError("Employee not found!", 404));
    res.json({
      message: "Salary deleted successfully!",
    });
  } catch (err) {
    next(err);
  }
};

exports.getWorkByDay = async (req, res, next) => {
  try {
    let works = await Work.aggregate([
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

exports.getAllWorks = async (req, res, next) => {
  try {
    let works = await Work.find();
    res.json({
      works,
    });
  } catch (err) {
    next(err);
  }
};

exports.getWorksById = async (req, res, next) => {
  try {
    let works = await Work.find({ employee: req.params.id });
    res.json({
      works,
    });
  } catch (err) {
    next(err);
  }
};

exports.addWork = async (req, res, next) => {
  try {
    let work = await Work.create({
      date: req.body.date,
      work: req.body.work,
      category: req.body.category,
      employee: req.body.employee,
    });
    res.json({
      message: "Work Added Successfully!",
    });
  } catch (err) {
    next(err);
  }
};

exports.delWork = async (req, res, next) => {
  try {
    await Work.findByIdAndDelete(req.body.id).orFail(
      new CustomError("Work could not be deleted", 500)
    );

    res.json({
      message: "Work deleted",
    });
  } catch (err) {
    next(err);
  }
};

exports.addCategory = async (req, res, next) => {
  try {
    await Admin.findByIdAndUpdate(req.id, {
      $push: { categories: req.body.category },
    }).orFail(new CustomError("Admin not found", 404));
    res.json({
      message: "Category Added",
    });
  } catch (err) {
    next(err);
  }
};

exports.delCategory = async (req, res, next) => {
  try {
    await Admin.findByIdAndUpdate(req.id, {
      $pull: { categories: req.body.category },
    }).orFail(new CustomError("Admin not found", 404));
    res.json({
      message: "Category Deleted",
    });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    await Admin.findByIdAndUpdate(req.id, {
      name: req.body.name,
      email: req.body.email,
    }).orFail(new CustomError("Admin not found!", 404));
    res.json({
      message: "Profile Updated!",
    });
  } catch (err) {
    next(err);
  }
};
