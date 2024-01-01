const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const checkRating = require('../utils/check.rating')
const { imageKit } = require('../utils/image.kit');
const { Transaction, User, DetailTransaction, Category, PaymentMethod, Course, Review, Progress } = require('../models');
const checkProgress = require('../utils/check.progres');
module.exports = {
  createCourse: async (req, res, next) => {
    try {
      const userId = req.body.userId;
      const existUser = await prisma.user.findFirst({
        where: { id: Number(userId) }
      })

      if (existUser.role != "mentor") {
        return res.status(403).json({ message: "Mentor not found" })
      }

      const existCourse = await prisma.course.findFirst({
        where: {
          name: req.body.name.toLowerCase()
        }
      })

      if (existCourse) return res.status(500).json({ message: "Course already exist" });

      const data = await prisma.course.create({
        data: {
          name: req.body.name,
          courseCode: req.body.courseCode,
          isPremium: Boolean(req.body.isPremium),
          categoryId: Number(req.body.categoryId),
          level: req.body.level.toLowerCase().trim(),
          price: Number(req.body.price),
          description: req.body.description,
          duration: req.body.duration,
          videoUrl: req.body.videoUrl,
          userId: Number(userId)
        }
      });

      return res.status(201).json({ message: "New Course has been created", data })

    } catch (error) {
      next(error)
    }
  },

  getAllCourse: async (req, res, next) => {
    try {
      const courses = await prisma.course.findMany({
        select: {
          id: true,
          name: true,
          courseCode: true,
          isPremium: true,
          categoryId: true,
          level: true,
          price: true,
          picture: true,
          description: true,
          videoUrl: true,
          userId: true,
          createdAt: true,
          updatedAt: true,
          about: true,
          duration: true,
          review: {
            select: {
              rating: true
            }
          }
        },
      });

      if (!courses || courses.length === 0) {
        return res.status(404).json({ message: 'No courses found' });
      }

      const data = await Promise.all(
        courses.map(async (course) => {
          const rating = checkRating(course);
          const user = await prisma.user.findUnique({
            where: { id: course.userId },
            select: {
              profile: {
                select: {
                  name: true,
                },
              },
            },
          });

          const category = await prisma.category.findUnique({
            where: { id: course.categoryId },
            select: {
              name: true,
            },
          });

          return {
            id: course.id,
            name: course.name,
            courseCode: course.courseCode,
            isPremium: course.isPremium,
            category: category ? category.name : null,
            level: course.level,
            price: course.price,
            picture: course.picture,
            description: course.description,
            videoUrl: course.videoUrl,
            mentor: user ? user.profile.name : null,
            rating: rating,
            duration: course.duration,
            about: course.about,
            createdAt: course.createdAt,
            updatedAt: course.updatedAt,
          };
        })
      );

      return res.status(200).json({ data });
    } catch (error) {
      next(error)
    }

  },

  getCourseById: async (req, res, next) => {
    try {
      const courseId = req.params.id;
      const course = await prisma.course.findUnique({
        where: { id: Number(courseId) },
        select: {
          id: true,
          name: true,
          courseCode: true,
          isPremium: true,
          categoryId: true,
          level: true,
          price: true,
          picture: true,
          description: true,
          videoUrl: true,
          userId: true,
          createdAt: true,
          updatedAt: true,
          about: true,
          duration: true,
          review: {
            select: {
              rating: true
            }
          },
          module: {
            select: {
              id: true,
              name: true,
              url: true
            }
          }
        },
      });

      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }

      const rating = checkRating(course);

      const user = await prisma.user.findFirst({
        where: { id: Number(course.userId) },
        select: {
          profile: {
            select: {
              name: true,
            },
          },
        },
      });

      const category = await prisma.category.findFirst({
        where: { id: Number(course.categoryId) },
        select: {
          name: true,
        },
      });

      if (!user || !category) {
        return res.status(404).json({ message: 'User or category not found' });
      }

      const data = {
        id: course.id,
        name: course.name,
        courseCode: course.courseCode,
        isPremium: course.isPremium,
        category: category.name,
        level: course.level,
        price: course.price,
        picture: course.picture,
        description: course.description,
        videoUrl: course.videoUrl,
        mentor: user.profile.name,
        rating: rating,
        about: course.about,
        duration: course.duration,
        module: course.module,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
      };

      return res.status(200).json({ data });
    } catch (error) {
      next(error)
    }
  },

  searchCourse: async (req, res, next) => {
    try {
      const { name } = req.query;

      const data = await prisma.course.findMany({
        where: {
          name: {
            contains: name,
            mode: 'insensitive'
          }
        }
      });

      if (!data || data.length == 0) return res.status(404).json({ message: "Course not found" })

      return res.status(200).json({ data });
    } catch (error) {
      next(error)
    }
  },

  paginationCourse: async (req, res, next) => {
    try {
      const { page = 1, limit = 10 } = req.query;

      const pageNumber = parseInt(page);
      const itemsLimit = parseInt(limit);

      const skip = (pageNumber - 1) * itemsLimit;

      const data = await prisma.course.findMany({
        skip: skip,
        take: itemsLimit,
        orderBy: { id: 'asc' }
      });

      if (!data) return res.status(404).json({ message: "Course not found" });

      return res.status(200).json({ data });
    } catch (error) {
      console.log(error);
      next(error)
    }
  },

  updateCourseById: async (req, res, next) => {
    try {

      const courseId = req.params.id;
      const userId = req.body.userId;

      const existCourse = await prisma.course.findUnique({
        where: { id: Number(courseId) }
      })

      if (!existCourse) return res.status(404).json({ message: 'Course not found' })

      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) }
      })

      if (!user) {
        return res.status(404).json({ message: "User not found" })
      } else if (user.role != 'mentor') {
        return res.status(403).json({ message: "User must be mentor" })
      }

      if (req.file && req.file.buffer) {
        const fileTostring = req.file.buffer.toString('base64');

        const uploadFile = await imageKit.upload({
          fileName: req.file.originalname,
          file: fileTostring
        });

        const data = await prisma.course.update({
          where: { id: Number(courseId) },
          data: {
            name: req.body.name,
            courseCode: req.body.courseCode,
            isPremium: Boolean(req.body.isPremium),
            categoryId: Number(req.body.categoryId),
            level: req.body.level.toLowerCase().trim(),
            price: Number(req.body.price),
            picture: uploadFile.url,
            about: req.body.about,
            description: req.body.description,
            videoUrl: req.body.videoUrl,
            userId: Number(req.body.userId)
          }
        })
        return res.status(200).json({ message: 'Update success', data })
      } else {
        const data = await prisma.course.update({
          where: { id: Number(courseId) },
          data: {
            name: req.body.name,
            courseCode: req.body.courseCode,
            isPremium: Boolean(req.body.isPremium),
            categoryId: Number(req.body.categoryId),
            level: req.body.level.toLowerCase().trim(),
            price: Number(req.body.price),
            about: req.body.about,
            description: req.body.description,
            videoUrl: req.body.videoUrl,
            userId: Number(req.body.userId)
          }
        })
        return res.status(200).json({ message: 'Update success', data })
      }
    } catch (error) {
      console.log(error);
      next(error)
    }
  },


  deleteCourseById: async (req, res, next) => {
    try {

      const courseId = req.params.id;
      console.log(courseId);

      let data = await prisma.course.findFirst({
        where: { id: Number(courseId) }
      })

      if (!data) return res.status(403).json({ message: 'Course not Found' })

      data = await prisma.course.delete({
        where: { id: Number(courseId) }
      })

      return res.status(200).json({ message: 'Delete success', data })

    } catch (error) {
      next(error)
    }
  },

  myCourse: async (req, res) => {
    try {
      const userIdFromToken = res.user.id;

      const transactions = await Transaction.findMany({
        where: {
          userId: userIdFromToken,
        }
      })

      if (!transactions || transactions.length === 0) {
        return res.status(404).json({ message: "No transactions found" });
      }

      const data = await Promise.all(
        transactions.map(async (transaction) => {

          const detailTransaction = await DetailTransaction.findUnique({
            where: { id: parseInt(transaction.id) },
          });

          const course = await Course.findUnique({
            where: { id: detailTransaction.courseId },
            select: {
              id: true,
              name: true,
              courseCode: true,
              isPremium: true,
              categoryId: true,
              level: true,
              price: true,
              picture: true,
              description: true,
              videoUrl: true,
              userId: true,
              createdAt: true,
              updatedAt: true,
              about: true,
              duration: true,
              review: {
                select: {
                  rating: true
                }
              },
              module: {
                select: {
                  id: true,
                  name: true,
                  url: true
                }
              }
            },
          });

          const rating = checkRating(course);

          const category = await Category.findUnique({
            where: { id: course.categoryId },
          });

          const progressUser = await Progress.findMany({
            where: { userId: userIdFromToken }
          })

          const progress = checkProgress(progressUser, course.module)

          return {
            id: course.id,
            name: course.name,
            courseCode: course.courseCode,
            isPremium: course.isPremium,
            category: category.name,
            level: course.level,
            price: course.price,
            picture: course.picture,
            description: course.description,
            videoUrl: course.videoUrl,
            mentor: course,
            rating: rating,
            about: course.about,
            duration: course.duration,
            module: course.module,
            progress: progress,
            createdAt: course.createdAt,
            updatedAt: course.updatedAt,
          };
        })
      );

      return res.status(200).json({
        message: "My Course retrieved successfully",
        data,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

}