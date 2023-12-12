const { category } = require('../models');

module.exports = {
    create: async (req, res, next) => {
        try {
            const data = await category.create({
                data: {
                    name: req.body.name
                }
            })

            if (!data) return res.status(500).json({ message: "Internal server error" })

            return res.status(201).json({
                data
            })

        } catch (error) {
            next(error)
        }
    },
    get: async (req, res, next) => {
        try {
            const data = await category.findMany()

            if (!data) return res.status(403).json({ message: "Not found" })

            return res.status(200).json({ data })

        } catch (error) {
            next(error)
        }

    },
    getById: async (req, res, next) => {
        try {

            const data = await category.findUnique({
                where: {
                    id: parseInt(req.params.id)
                }
            })

            if (!data) return res.status(403).json({ message: "Not found" })

            return res.status(200).json({ data })

        } catch (error) {
            next(error)
        }
    },
    update: async (req, res, next) => {
        try {
            const existCategory = await category.findUnique({
                where: {
                    id: parseInt(req.params.id)
                }
            })

            if (!existCategory) return res.status(403).json({ message: "Not found" })

            const data = await category.update({
                where: {
                    id: parseInt(req.params.id)
                },
                data: {
                    name: req.body.name,
                }
            })

            return res.status(200).json({
                data
            })

        } catch (error) {
            next(error)
        }
    },

    destroy: async (req, res, next) => {
        try {
            let data = await category.findUnique({
                where: {
                    id: parseInt(req.params.id)
                }
            })

            if (!data) return res.status(403).json({ message: "Not found" })

            data = await category.delete({
                where: {
                    id: parseInt(req.params.id)
                }
            })

            return res.status(200).json({ message: "Delete success", data })

        } catch (error) {
            next(error)
        }
    }
}