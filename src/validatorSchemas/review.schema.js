const { body } = require("express-validator");

module.exports = {
  review: [
    body("nilai").notEmpty(),
    body("feedback").notEmpty(),
    body("userId").notEmpty(),
    body("courseId").notEmpty(),
  ],
};
