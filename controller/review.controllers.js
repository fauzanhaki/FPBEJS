const { Ranting, Review, User, Course } = require("../models");

module.exports = {
  createReview: async (req, res) => {
    try {
      let { nilai, feedback, courseId, rantingId } = req.body;

      courseId = parseInt(courseId);
      nilai = parseInt(nilai);

      const userIdFromToken = res.user.id;

      const existingUser = await User.findUnique({
        where: {
          id: userIdFromToken,
        },
      });

      if (!existingUser) {
        return res.status(404).json({ message: "User Not Found" });
      }

      const existingCourse = await Course.findUnique({
        where: {
          id: courseId,
        },
      });

      if (!existingCourse) {
        return res.status(404).json({ message: "Course Not Found" });
      }

      if (nilai < 1 || nilai > 5) {
        return res
          .status(400)
          .json({ message: "Rating should be between 1 and 5" });
      }

      rantingId = rantingId || courseId;

      if (!rantingId) {
        rantingId = courseId;
      }

      let ranting = await Ranting.findUnique({
        where: {
          id: rantingId,
        },
      });

      if (!ranting) {
        ranting = await Ranting.create({
          data: {
            id: rantingId,
            totalRanting: nilai,
          },
        });
      } else {
        ranting = await Ranting.update({
          where: {
            id: rantingId,
          },
          data: {
            totalRanting: ranting.totalRanting + nilai,
          },
        });
      }

      const review = await Review.create({
        data: {
          nilai: nilai,
          feedback: feedback,
          userId: userIdFromToken,
          courseId: courseId,
          rantingId: ranting.id,
        },
      });

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

      await Ranting.update({
        where: {
          id: ranting.id,
        },
        data: {
          totalRanting: averageRanting,
        },
      });

      return res
        .status(200)
        .json({ message: "Review created successfully", review });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
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

      return res
        .status(200)
        .json({ message: "All Review retrived successfully", allReviews });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
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
      return res
        .status(200)
        .json({ message: "Review retrieved successfully", data });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  destroy: async (req, res) => {
    try {
      const existingReviews = await Review.findUnique({
        where: {
          id: parseInt(req.params.id),
        },
      });

      if (!existingReviews) {
        return res.status(404).json({ message: "Review not found" });
      }

      await Review.delete({
        where: {
          id: parseInt(req.params.id),
        },
      });
      return res
        .status(200)
        .json({ message: "Review delete successfully", existingReviews });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
};
