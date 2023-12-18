const { category } = require('../models');

module.exports = {
    create: async (req, res, next) => {
        try {
            const createdCategory = await category.create({
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
    get : async (req, res, next) => {
        try{
            const getCategory = await category.findMany()

            return res.status(200).json({
                getCategory
            })
        }catch (error) {
            next(error)
        }
        
    },
    getById: async (req, res, next) => {
        try {

            const getCategoryById = await category.findUnique({
                where: {
                    id: parseInt(req.params.id)
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
                },
                data: {
                    name: req.body.name,                 
                }
            })

            return res.status(200).json({
                updatedCategory
            })

        } catch (error) {
            next(error)
        }
    },
    destroy: async (req, res, next) => {
        try {

            const deleteCategory = await category.delete({
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