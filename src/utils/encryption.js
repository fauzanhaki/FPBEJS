const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { SECRET_KEY } = require("../config");

module.exports = {
  encryptPassword: async (password) => {
    try {
      const salt = await bcrypt.genSalt(); //default salt === 10

      return await bcrypt.hash(password, salt);
    } catch (error) {
      console.error(error);
      throw Error(error);
    }
  },

  verifyHashedData: async (unhashed, hashed) => {
    try {
      const match = await bcrypt.compare(unhashed, hashed);
      return match;
    } catch (err) {
      throw err;
    }
  },

  createJwt: (payload) => {
    try {
      return jwt.sign(payload, SECRET_KEY, { expiresIn: "6h" });
    } catch (error) {
      console.log(error);
    }
  },
};
