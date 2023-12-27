const { Module, Course } = require('../models');

module.exports = {
    createModuleCourse: async (req, res, next) => {
        try {
            const courseId = Number(req.body.courseId)
            const { name, url } = req.body;
            const existCourse = await Course.findUnique({
                where: { id: courseId }
            })

            if (!existCourse || existCourse == []) return res.status(404).json({ message: "Course not found" })

            const data = await Module.create({
                data: {
                    courseId: courseId,
                    name: name,
                    url: url
                }
            })

            if (data || data.length == 0) return res.status(403).json({ message: "Create failed" })

            return res.status(200).json({ message: "success", data })
        } catch (error) {
            next(error)
        }
    },

    getModuleCourse: async (req, res, next) => {
        try {
            const data = await Module.findMany();

            if (!data || data == []) return res.status(403).json({ message: "Module not found" })

            return res.status(200).json({ data })
        } catch (error) {
            next(error)
        }

    },

    getModuleCourseById: async (req, res, next) => {
        try {
            const moduleId = Number(req.params.id);
            const data = await Module.findUnique({
                where: {id: moduleId}
            });

            if (!data || data == []) return res.status(403).json({ message: "Module not found" })

            return res.status(200).json({ data })
        } catch (error) {
            next(error)
        }

    },

    updateModuleCourse: async (req, res, next) => {
        try {
            const moduleId = Number(req.params.id);
            const courseId = Number(req.body.courseId);
            const { name, url } = req.body;
            const existCourse = await Course.findUnique({
                where: { id: courseId }
            })

            if (!existCourse || existCourse == []) return res.status(404).json({ message: "Course not found" })

            const existModule = await Module.findUnique({
                where: { id: moduleId }
            })

            if (!existModule || existModule == []) return res.status(403).json({ message: "Module not found" })

            const data = await Module.update({
                where: { id: moduleId },
                data: {
                    courseId: courseId,
                    name: name,
                    url: url
                }
            })

            return res.status(200).json({ message: "update success", data })
        } catch (error) {
            console.log(error);
            next(error)
        }
    },

    deleteModuleCourse: async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const existModule = await Module.findUnique({
                where: { id: id }
            })

            if (!existModule || existModule == []) return res.status(403).json({ message: "Module not found" })

            const data = await Module.delete({
                where: { id: id }
            })

            return res.status(200).json({ message: "Delete success", data })
        } catch (error) {
            next(error)
        }
    }
}