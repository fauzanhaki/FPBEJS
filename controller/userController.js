const { User } = require('../models');
const {exclude} = require("../utils")

module.exports = {
    changeUser: async (req, res, next) => {
        const userId = req.params.id;
        try {

            const user = await User.findUnique({
                where: { id: Number(userId) }
            })

            if (!user) return res.status(404).json({ message: "User not found" });

            const userUpdate = await User.update({
                where: { id: Number(userId) },
                data: {
                    email: req.body.email,
                    username: req.body.username,
                    role: req.body.role.toLowerCase().trim()
                }
            })

             data = exclude(userUpdate, [
                "password",
                "resetPasswordToken",
                "verificationToken",
              ]);

            return res.status(200).json({ message: "Update success", data })
        }
        catch (error) {
            next(error)
        }
    },

    getAllUser: async (req, res, next) => {
        try {
            const data = await User.findMany({
                select: {
                    id: true,
                    email: true,
                    username: true,
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

            const data = await User.findUnique({
                where: { id: Number(userId) },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    role: true,
                    profile: {
                        select: {
                            name: true,
                            no_telp: true,
                            profilePicture: true,
                            city: true,
                            province: true,
                            country: true,
                            userId: true,
                            createdAt: true,
                            updatedAt: true
                        }
                    }
                }
            });

            if (!data) return res.status(404).json({ message: "User not found" })
            return res.status(200).json({ data })
        } catch (error) {
            next(error)
        }
    },

    deleteUser: async (req, res, next) => {
        try {
            const userId = req.params.id;
            const user = await User.findUnique({
                where: { id: Number(userId) }
            })

            if (!user) return res.status(404).json("User not found");

            const userDelete = await User.delete({
                where: { id: user.id }
            })

            data = exclude(userDelete, [
                "password",
                "resetPasswordToken",
                "verificationToken",
              ]);

            return res.status(200).json({ message: "Delete success", data })
        } catch (error) {
            next(error)
        }
    }
}