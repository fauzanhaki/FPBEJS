const { validationResult } = require("express-validator");

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      const errorMessages = validationErrors.array().map((error) => error.msg);
      return res.status(400).json({ error: errorMessages.join(", ") });
    }

    return next();
  };
};

module.exports = validate;
