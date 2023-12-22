const { Category } = require('../models');

module.exports = {
    create: async (req, res, next) => {
        try {
            const existCategory = await Category.findMany();
            
            existCategory.map(category => {
                if(category.name.toLowerCase() == req.body.name.toLowerCase()) return res.status(409).json({message: "Category already defined"})
            });

            const data = await Category.create({
                data: {
                    name: req.body.name
                }
            })

            return res.status(201).json({
                createdCategory
            })

        } catch (error) {
            next(error)
        }
    },
    
    get: async (req, res, next) => {
        try {
            const data = await Category.findMany()

            return res.status(200).json({
                getCategory
            })
        }catch (error) {
            next(error)
        }
        
    },
    getById: async (req, res, next) => {
        try {

            const data = await Category.findUnique({
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
            const existCategory = await Category.findUnique({
                where: {
                    id: parseInt(req.params.id)
                }
            })

            if (!existCategory) return res.status(403).json({ message: "Not found" })

            const data = await Category.update({
                where: {
                    id: parseInt(req.params.id)
                },
                data: {
                    name: req.body.name,
                }
            })

            return res.status(200).json({
                getCategoryById
            })
            
        } catch (error) {
            next(error)
        }
    },
    update: async (req, res, next) => {
        try {
            const updatedCategory = await category.update({
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

            return res.status(204).json()
            
        } catch (error) {
            next(error)
        }
    }
}