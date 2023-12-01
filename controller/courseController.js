const { course, users } = require('../models');

/*
name
courseCode
isPremium boolean
categoryId
level
price
description
videoUrl
*/

module.exports = {
    createCourse: async (req, res) => {
        try {

            const userId = res.user.id;
            const user = await users.findUnique({
                where: { id: Number(userId) }
            });

            if (!user) {
                return res.status(404).json({message: 'User not found'});
            }

            const isAdmin = user.role == 'admin';
            if (isAdmin) {
                const existCourse = await course.findFirst({
                    where: {
                        name: req.body.name.toLowerCase()
                    }
                })

                if (existCourse) return res.status(500).json({message: "Course already exist"});

                const data = await course.create({
                    data: {
                        name: req.body.name,
                        courseCode: req.body.courseCode,
                        isPremium: Boolean(req.body.isPremium),
                        categoryId: Number(req.body.categoryId),
                        level: req.body.level,
                        price: Number(req.body.price),
                        description: req.body.description,
                        videoUrl: req.body.videoUrl
                    }
                });
                return res.status(201).json({message: "New Course has been created", data})
            } else {
                return res.status(404).json({message: "Sorry you're not admin"});
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({message: "Internal Server Error!"})
        }
    },

}