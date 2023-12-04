const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret_key = process.env.JWT_KEY;

module.exports = {
  apiError: (msg) => {
    const response = {};
    response.error = true;
    response.message = msg;

    return response;
  },

  cryptPassword: async (password) => {
    try {
      const saltRounds = 5;
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);
      return hashedPassword;
    } catch (error) {
      throw new Error("Password encryption failed");
    }
  },

  verifyHashed: async (unhashed, hashed) => {
    try {
      const match = await bcrypt.compare(unhashed, hashed);
      return match;
    } catch (error) {
      return false;
    }
  },

  encryptToken: async (password) => {
    try {
      const saltRounds = 5;
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);

      const base64EncodedHash = Buffer.from(hashedPassword).toString("base64");
      return base64EncodedHash;
    } catch (error) {
      throw new Error("Password encryption failed");
    }
  },

  createToken: (payload) => {
    return jwt.sign(payload, secret_key);
  },
};
