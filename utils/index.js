const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const otpGenerator = require('otp-generator');
const secret_key = process.env.JWT_KEY;

const createToken = (payload) => {
    const expiration = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 6); // 6 hari
    return jwt.sign(payload, secret_key, {expiresIn: expiration});
}

const cryptPassword = (password) => {
    try {
        const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(5));
        return hashedPassword;
    } catch (error) {
        return error
    }
};

const verifyHashed = (unhashed, hashed) => {
  try {
    return bcrypt.compareSync(unhashed, hashed);
  } catch (error) {
    return false;
  }
};

const encryptEmail = async (password) => {
    try {
        const saltRounds = 5;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        const base64EncodedHash = Buffer.from(hashedPassword).toString('base64');
        return base64EncodedHash;
    } catch (error) {
        throw new Error('Password encryption failed');
    }
};

function generateOTP() {
    return otpGenerator.generate(6, { upperCase: false, specialChars: false, lowerCaseAlphabets: false, upperCaseAlphabets: false });
}


module.exports = {
    cryptPassword,
    verifyHashed,
    encryptEmail,
    createToken,
    generateOTP,
    exclude: (model, keys) => {
        return Object.fromEntries(
          Object.entries(model).filter(([key]) => !keys.includes(key))
        );
      },
};
