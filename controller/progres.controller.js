const { Progress, User, Course, Module } = require('../models');

module.exports = {
    sendProgress: async (req, res, next) => {
        try {
            const userId = res.user.id;
            const moduleId = Number(req.body.moduleId);
            const existUser = await User.findUnique({
                where: {id: userId}
            })

            if(!existUser || existUser.length == 0) return res.status(404).json({message: "User not found"});

            const moduleCourse = await Module.findUnique({
                where: {id: moduleId}
            })

            if(!moduleCourse || moduleCourse.length == 0) return res.status(404).json({message: "Module not found"});

            const data = await Progress.create({
                data: {
                    moduleId: moduleId,
                    userId: userId
                }
            })

            return res.status(200).json({message: "Progress send success", data})
        } catch (error) {
            next(error)
        }
    }
}