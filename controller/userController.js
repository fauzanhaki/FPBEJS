const { users } = require('../models');

module.exports = {
    changeUser: async (req, res, next) => {
        const userId = req.params.id;
        try {

            const user = await users.findUnique({
                where: { id: Number(userId) }
            })

            if (!user) return res.status(404).json({ message: "User not found" });

            const data = await users.update({
                where: { id: Number(userId) },
                data: {
                    email: req.body.email,
                    username: req.body.username,
                    role: req.body.role
                }
            })

            return res.status(200).json({ message: "Update success", data })
        }
        catch (error) {
            next(error)
        }
    },

    getAllUser: async (req, res, next) => {
        try {
            const data = await users.findMany({
                select: {
                    id: true,
                    email: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true
                }
            });

            if (!data) return res.status(404).json({ message: "User not found" })

            return res.status(200).json({ data })
        } catch (error) {
            next(error)
        }
    },

    getUserById: async (req, res, next) => {
        try {
            const userId = req.params.id;
            const data = await users.findUnique({
                where: { id: Number(userId) },
                select: {
                    profile: true
                }
            })

            if (!data) return res.status(404).json({ message: "User not found" })

            return res.status(200).json({ data })
        } catch (error) {
            next(error)
        }
    },

    deleteUser: async (req, res, next) => {
        try {
            const userId = req.params.id;
            const user = await users.findUnique({
                where: { id: Number(userId) }
            })

            if (!user) return res.status(404).json("User not found");

            const data = await users.delete({
                where: { id: user.id }
            })

            return res.status(200).json({ message: "Delete success", data })
        } catch (error) {
            next(error)
        }
    }
}