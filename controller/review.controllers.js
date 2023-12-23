const { Ranting, Review, User, Course } = require("../models");

module.exports = {
  createReview: async (req, res) => {
    try {
      let { rating, feedback, courseId } = req.body;

      courseId = parseInt(courseId);
      rating = parseInt(rating);

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

      if (rating < 1 || rating > 5) {
        return res
          .status(400)
          .json({ message: "Rating should be between 1 and 5" });
      }

      const data = await Review.create({
        data: {
          rating: rating,
          feedback: feedback,
          userId: userIdFromToken,
          courseId: courseId,
        },
      });

      return res
        .status(200)
        .json({ message: "Review created successfully", data });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getAllReview: async (req, res) => {
    try {
      const data = await Review.findMany({
        select: {
          id: true,
          rating: true,
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
          createdAt: true,
          updatedAt: true
        },
      });
      return res
        .status(200)
        .json({ message: "All Review retrived successfully", data });
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
          rating: true,
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
          createdAt: true,
          updatedAt: true
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

  updateReview: async (req, res, next) => {
    try {
      const userId = res.user.id;
      const id = req.params.id;
      const { courseId, rating, feedback } = req.body;
      const user = await User.findFirst({
        where: { id: parseInt(userId) }
      });

      if (!user || user == []) return res.status(404).json({ message: "User not found" });

      const course = await Course.findFirst({
        where: { id: parseInt(courseId) }
      })

      if (!course || course == []) return res.status(404).json({ message: "Course not found" })

      const data = await Review.update({
        where: { id: parseInt(id) },
        data: {
          rating: parseInt(rating),
          feedback: feedback,
          userId: userId,
          courseId: parseInt(courseId)
        }
      })

      if (!data || data == []) return res.status(500).json({ message: "Internal server error" })

      return res.status(200).json({ message: "Update success", data })
    }
    catch (error) {
      next(error)
    }
  },

  destroy: async (req, res) => {
    try {
      const data = await Review.findUnique({
        where: {
          id: parseInt(req.params.id),
        },
      });

      if (!data) {
        return res.status(404).json({ message: "Review not found" });
      }

      await Review.delete({
        where: {
          id: parseInt(req.params.id),
        },
      });
      return res
        .status(200)
        .json({ message: "Review delete successfully", data });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
};
