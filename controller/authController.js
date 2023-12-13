const { users } = require('../models');
const { cryptPassword, verifyHashed, encryptToken, createToken } = require('../utils');

module.exports = {
    login: async (req, res) => {
        try {
            const { email, password } = req.body
            const user = await users.findFirst({
                where: {
                    email
                }
            });
            if (!user) return res.status(403).json({ message: "Email incorrect"})

            const verifyPassword = await verifyHashed(password, user.password);
            if (!verifyPassword) return res.status(403).json({ message: "Password is incorrect"})

            const payload = ({ id: user.id, email: user.email });
            const token = createToken(payload);

            return res.status(200).json({ token });

        } catch (error) {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}