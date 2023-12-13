const { body } = require("express-validator");

module.exports = {
  register: [
    body("username").notEmpty().withMessage("Username is required"),
    body("email").notEmpty().isEmail().withMessage("Email not valid"),
    body("password").notEmpty().withMessage("Password is required"),
    body("roleId").notEmpty().withMessage("Role ID is required"),
    body("name").notEmpty().withMessage("Name is required"),
  ],

  registerUser: [
    body("username").notEmpty().withMessage("Username is required"),
    body("email").notEmpty().isEmail().withMessage("Email not valid"),
    body("password").notEmpty().withMessage("Password is required"),
    body("name").notEmpty().withMessage("Name is required"),
  ],

  login: [
    body("email").notEmpty().isEmail().withMessage("Email not valid"),
    body("password").notEmpty().withMessage("Password is required"),
  ],

  createProfile: [
    body("name").notEmpty().withMessage("Name is required"),
    body("phone").notEmpty().withMessage("Phone is required"),
    body("picture").notEmpty().withMessage("Picture is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("province").notEmpty().withMessage("Province is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("userId").notEmpty().withMessage("User Id is required"),
  ],

  updateProfile: [
    body("name").notEmpty().withMessage("Name is required"),
    body("phone").notEmpty().withMessage("Phone is required"),
    body("picture").notEmpty().withMessage("Picture is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("province").notEmpty().withMessage("Province is required"),
    body("country").notEmpty().withMessage("Country is required"),
  ],

  role: [body("name").notEmpty().withMessage("Name is required")],
};
// body("").notEmpty().withMessage(" is required")
