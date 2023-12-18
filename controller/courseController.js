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
                return res.status(404).json({ message: 'User not found' });
            }

            const isAdmin = user.role == 'admin';
            if (isAdmin) {
                const existCourse = await course.findFirst({
                    where: {
                        name: req.body.name.toLowerCase()
                    }
                })

                if (existCourse) return res.status(500).json({ message: "Course already exist" });

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
                return res.status(201).json({ message: "New Course has been created", data })
            } else {
                return res.status(404).json({ message: "Sorry you're not admin" });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal Server Error!" })
        }
    },

    getAllCourse: async (req, res, next) => {
        try {
            const data = await course.findMany();

            if (!data) return res.status(403).json({ message: 'Course empty' })

            return res.status(200).json({ data })
        } catch (error) {
            next(error)
        }
    },

    getCourseById: async (req, res, next) => {
        try {
            const courseId = req.params.id;
            const data = await course.findUnique({
                where: { id: Number(courseId) }
            })
            if (!data) return res.status(403).json({ message: 'Not found' })

            return res.status(200).json({ data })
        } catch (error) {
            next(error)
        }
    },

    updateCourseById: async (req, res, next) => {
        try {
            const userId = res.user.id;
            const courseId = req.params.id;
            const user = await users.findUnique({
                where: { id: Number(userId) }
            })

            if (!user) return res.status(403).json({ message: 'Not Found' })

            const isAdmin = user.role == 'admin'

            if (isAdmin) {
                let data = await course.findUnique({
                    where: { id: Number(courseId) }
                })

                if (!data) return res.status(403).json({ message: 'Not Found' })

                data = await course.update({
                    where: { id: Number(courseId) },
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
                })
                return res.status(200).json({ message: 'Update success', data })
            } else {
                return res.status(404).json({ message: "Sorry you're not admin" });
            }
        } catch (error) {
            next(error)
        }

    },

    deleteCourseById: async (req, res, next) => {
        try {
            const userId = res.user.id;
            const courseId = req.params.id;
            const user = await users.findUnique({
                where: { id: Number(userId) }
            })

            if (!user) return res.status(403).json({ message: 'Not Found' })

            const isAdmin = user.role == 'admin'

            if (isAdmin) {
                let data = await course.findUnique({
                    where: { id: Number(courseId) }
                })

                if (!data) return res.status(403).json({ message: 'Not Found' })

                data = await course.delete({
                    where: { id: Number(courseId) }
                })

                return res.status(200).json({ message: 'Delete success', data })
            } else {
                return res.status(404).json({ message: "Sorry you're not admin" });
            }
        } catch (error) {
            next(error)
        }
    }

}