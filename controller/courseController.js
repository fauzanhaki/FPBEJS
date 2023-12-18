const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  createCourse: async (req, res, next) => {
    try {
      const userId = req.body.userId;
      const existUser = await prisma.user.findFirst({
        where: { id: Number(userId) },
      });

      if (existUser.role != "mentor") {
        return res.status(403).json({ message: "Mentor not found" });
      }

      const existCourse = await prisma.course.findFirst({
        where: {
          name: req.body.name.toLowerCase(),
        },
      });

      if (existCourse)
        return res.status(500).json({ message: "Course already exist" });

      const data = await prisma.course.create({
        data: {
          name: req.body.name,
          courseCode: req.body.courseCode,
          isPremium: Boolean(req.body.isPremium),
          categoryId: Number(req.body.categoryId),
          level: req.body.level.toLowerCase().trim(),
          price: Number(req.body.price),
          description: req.body.description,
          videoUrl: req.body.videoUrl,
          userId: Number(userId),
        },
      });

      return res
        .status(201)
        .json({ message: "New Course has been created", data });
    } catch (error) {
      next(error);
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
          description: true,
          videoUrl: true,
          userId: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!courses || courses.length === 0) {
        return res.status(404).json({ message: "No courses found" });
      }

      const data = await Promise.all(
        courses.map(async (course) => {
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
            description: course.description,
            videoUrl: course.videoUrl,
            mentor: user ? user.profile.name : null,
            createdAt: course.createdAt,
            updatedAt: course.updatedAt,
          };
        })
      );

      return res.status(200).json({ data });
    } catch (error) {
      next(error);
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
          description: true,
          videoUrl: true,
          userId: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

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
        return res.status(404).json({ message: "User or category not found" });
      }

      const data = {
        id: course.id,
        name: course.name,
        courseCode: course.courseCode,
        isPremium: course.isPremium,
        category: category.name,
        level: course.level,
        price: course.price,
        description: course.description,
        videoUrl: course.videoUrl,
        mentor: user.profile.name,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
      };

      return res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  },

  searchCourse: async (req, res, next) => {
    try {
      const { name } = req.query;

      const data = await prisma.course.findMany({
        where: {
          name: {
            contains: name,
            mode: "insensitive",
          },
        },
      });

      if (!data || data.length == 0)
        return res.status(404).json({ message: "Course not found" });

      return res.status(200).json({ data });
    } catch (error) {
      next(error);
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
        orderBy: { id: "asc" },
      });

      if (!data) return res.status(404).json({ message: "Course not found" });

      return res.status(200).json({ data });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  updateCourseById: async (req, res, next) => {
    try {
      const courseId = req.params.id;
      const userId = req.body.userId;
      const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
      });
      if (!user) return res.status(404).json({ message: "User mot found" });

      let data = await prisma.course.findUnique({
        where: { id: Number(courseId) },
      });

      if (!data) return res.status(404).json({ message: "Course not found" });

      data = await prisma.course.update({
        where: { id: Number(courseId) },
        data: {
          name: req.body.name,
          courseCode: req.body.courseCode,
          isPremium: Boolean(req.body.isPremium),
          categoryId: Number(req.body.categoryId),
          level: req.body.level.toLowerCase().trim(),
          price: Number(req.body.price),
          description: req.body.description,
          videoUrl: req.body.videoUrl,
          userId: Number(req.body.userId),
        },
      });
      return res.status(200).json({ message: "Update success", data });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  deleteCourseById: async (req, res, next) => {
    try {
      const courseId = req.params.id;
      console.log(courseId);

      let data = await prisma.course.findFirst({
        where: { id: Number(courseId) },
      });

      if (!data) return res.status(403).json({ message: "Course not Found" });

      data = await prisma.course.delete({
        where: { id: Number(courseId) },
      });

      return res.status(200).json({ message: "Delete success", data });
    } catch (error) {
      next(error);
    }
  },
};
