const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret_key = process.env.JWT_KEY;

const cryptPassword = async (password) => {
    try {
        const saltRounds = 5;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        throw new Error('Password encryption failed');
    }
};

const verifyHashed = async (unhashed, hashed) => {
    try {
        const match = await bcrypt.compare(unhashed, hashed);
        return match;
    } catch (error) {
        return false; 
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

const createToken = (payload) => {
    const expiration = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 6); // 6 hari
    return jwt.sign({ ...payload, exp: expiration }, secret_key);
}


module.exports = {
    cryptPassword,
    verifyHashed,
    encryptToken,
    createToken
};
