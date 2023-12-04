const { Ranting, Review, User, Course } = require("../../models");
const utils = require("../../utils");

module.exports = {
  createReview: async (req, res) => {
    try {
      let { nilai, feedback, userId, courseId, rantingId } = req.body;

      userId = parseInt(userId);
      courseId = parseInt(courseId);
      nilai = parseInt(nilai);

      const existingUser = await User.findUnique({
        where: {
          id: userId,
        },
      });

      if (!existingUser)
        return res.status(404).json({ error: true, message: "User Not Found" });

      const existingCourse = await Course.findUnique({
        where: {
          id: courseId,
        },
      });

      if (!existingCourse)
        return res
          .status(404)
          .json({ error: true, message: "Course Not Found" });

      if (nilai < 1 || nilai > 5)
        return res
          .status(400)
          .json({ error: true, message: "Ranting should be between 1 and 5" });

      rantingId = rantingId || courseId;

      let ranting = await Ranting.findUnique({
        where: {
          id: rantingId,
        },
      });

      if (!ranting) {
        ranting = await Ranting.create({
          data: {
            totalRanting: nilai,
          },
        });
      }

      const review = await Review.create({
        data: {
          nilai: nilai,
          feedback: feedback,
          user: {
            connect: { id: userId },
          },
          course: {
            connect: { id: courseId },
          },
          ranting: {
            connect: { id: ranting.id },
          },
        },
      });

      // rata-rata ranting
      const existingReviews = await Review.findMany({
        where: {
          rantingId: ranting.id,
        },
      });

      const totRanting = existingReviews.reduce(
        (sum, review) => sum + (review.nilai || 0),
        0
      );
      const averageRanting =
        existingReviews.length > 0 ? totRanting / existingReviews.length : 0;

      // Update totalRanting
      await Ranting.update({
        where: {
          id: ranting.id,
        },
        data: {
          totalRanting: averageRanting,
        },
      });

      return res.status(201).json({
        error: false,
        message: "Review created successfully",
        data: review,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json(utils.apiError("Internal Server Error"));
    }
  },

  getAllReview: async (req, res) => {
    try {
      const allReviews = await Review.findMany({
        select: {
          id: true,
          nilai: true,
          feedback: true,
          user: {
            select: {
              username: true,
            },
          },
          course: {
            select: {
              name: true,
            },
          },
          ranting: {
            select: {
              totalRanting: true,
            },
          },
        },
      });

      return res.status(200).json({
        error: false,
        message: "All reviews retrieved successfully",
        data: allReviews,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json(utils.apiError("Internal Server Error"));
    }
  },

  getById: async (req, res) => {
    try {
      const courseId = req.params.id;
      const data = await Review.findMany({
        where: { courseId: Number(courseId) },
        select: {
          id: true,
          nilai: true,
          feedback: true,
          user: {
            select: {
              username: true,
            },
          },
          course: {
            select: {
              name: true,
            },
          },
          ranting: {
            select: {
              totalRanting: true,
            },
          },
        },
      });
      if (!data || data.length === 0)
        return res.status(404).json({ message: "Not Found" });

      return res.status(200).json({ data });
    } catch (error) {
      console.error(error);
      return res.status(500).json(utils.apiError("Internal Server Error"));
    }
  },
};
