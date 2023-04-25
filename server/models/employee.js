const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  desg: {
    type: String,
  },
  company: {
    type: String,
  },
  phone: {
    type: Number,
  },
  address: {
    type: String,
  },
  salaries: [
    {
      type: Schema.Types.ObjectId,
      ref: "Salary",
    },
  ],
});

module.exports = mongoose.model("Employee", employeeSchema);
