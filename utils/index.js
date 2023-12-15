const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const secret_key = process.env.JWT_KEY;

const createToken = (payload) => {
    const expiration = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 6); // 6 hari
    return jwt.sign({ payload, exp: expiration }, secret_key);
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
          bcrypt.compareSync(unhashed, hashed);
        return true;
    } catch (error) {
        return error; 
    }
};

const encryptToken = async (password) => {
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

module.exports = {
    cryptPassword,
    verifyHashed,
    encryptToken,
    createToken
};
