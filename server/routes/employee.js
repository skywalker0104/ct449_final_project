const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employee");
const form_data = require("express-form-data");

router.get("/salary", employeeController.getSalaries);

router.get("/salary/monthly", employeeController.getSalariesByMonth);

router.get("/category", employeeController.getCategories);

router.get("/home/cards", employeeController.getCardsData);

router.get("/works", employeeController.getWorks);

router.post("/works/add", employeeController.addWork);

router.post("/profile/update", employeeController.updateProfile);

module.exports = router;
