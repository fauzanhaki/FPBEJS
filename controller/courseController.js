
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { course, users } = require('../models');
const { empty } = require('@prisma/client/runtime/library');

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
    createCourse: async (req, res, next) => {
        try {
            const userId = req.body.userId;
            const existUser = await users.findFirst({
                where: { id: Number(userId) }
            })

            if (existUser.role != "mentor") {
                return res.status(403).json({ message: "Mentor not found" })
            }

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
                    videoUrl: req.body.videoUrl,
                    userId: Number(userId)
                }
            });

            return res.status(201).json({ message: "New Course has been created", data })

        } catch (error) {
          console.log(error);
            next(error)
        }
    },

    getAllCourse: async (req, res, next) => {
        try {
            const course = await prisma.course.findMany({
                select: {
                  id: true,
                  name: true,
                  courseCode: true,
                  isPremium: true,
                  category: {
                    select: {
                      name: true,
                    },
                  },
                  level: true,
                  price: true,
                  description: true,
                  videoUrl: true,
                  User: {
                    select: {
                      profile: {
                        select: {
                          name: true,
                        },
                      },
                    },
                  },
                  createdAt: true,
                  updatedAt: true
                },
              });
              
              if (!course) return res.status(403).json({ message: 'Course empty' })

              const data = course.map(course => ({
                id: course.id,
                name: course.name,
                courseCode: course.courseCode,
                isPremium: course.isPremium,
                category: course.category.name,
                level: course.level,
                price: course.price,
                description: course.description,
                videoUrl: course.videoUrl,
                mentor: course.User.profile.name,
                createdAt: course.createdAt,
                updatedAt: course.updatedAt
              }));              

            return res.status(200).json({ data })

        } catch (error) {
            next(error)
        }
    },

    getCourseById: async (req, res, next) => {
        try {
            const courseId = req.params.id;
            const course = await prisma.course.findUnique({
                where: {id: Number(courseId)},
                select: {
                  id: true,
                  name: true,
                  courseCode: true,
                  isPremium: true,
                  category: {
                    select: {
                      name: true,
                    },
                  },
                  level: true,
                  price: true,
                  description: true,
                  videoUrl: true,
                  User: {
                    select: {
                      profile: {
                        select: {
                          name: true,
                        },
                      },
                    },
                  },
                  createdAt: true,
                  updatedAt: true
                },
              });
              
              if (!course) return res.status(403).json({ message: 'Not found' })

              const data = {
                id: course.id,
                name: course.name,
                courseCode: course.courseCode,
                isPremium: course.isPremium,
                category: course.category.name,
                level: course.level,
                price: course.price,
                description: course.description,
                videoUrl: course.videoUrl,
                mentor: course.User.profile.name,
                createdAt: course.createdAt,
                updatedAt: course.updatedAt
            };

            return res.status(200).json({ data })
        } catch (error) {
            next(error)
        }
    },

    updateCourseById: async (req, res, next) => {
        try {

            const courseId = req.params.id;
            const userId = req.body.userId;
            const user = await users.findUnique({
                where: { id: Number(userId) }
            })
            if(!user) return res.status(403).json({message: "User not found"})

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
                    videoUrl: req.body.videoUrl,
                    userId: req.body.userId
                }
            })
            return res.status(200).json({ message: 'Update success', data })
        } catch (error) {
            next(error)
        }
    },

    deleteCourseById: async (req, res, next) => {
        try {

            const courseId = req.params.id;

            let data = await course.findUnique({
                where: { id: Number(courseId) }
            })

            if (!data) return res.status(403).json({ message: 'Not Found' })

            data = await course.delete({
                where: { id: Number(courseId) }
            })

            return res.status(200).json({ message: 'Delete success', data })

        } catch (error) {
            next(error)
        }
    }

}