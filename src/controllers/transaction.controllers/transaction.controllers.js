const { Transaction, User, Course, PaymentMethod } = require("../../models");
const utils = require("../../utils");

module.exports = {
  create: async (req, res) => {
    try {
      let { courseId, userId, paymentMethodId } = req.body;
      courseId = parseInt(courseId);
      userId = parseInt(userId);
      paymentMethodId = parseInt(paymentMethodId);

      const existingUser = await User.findUnique({
        where: {
          id: userId,
        },
      });

      if (!existingUser)
        return res.status(404).json(utils.apiError("User Not Found"));

      const existingCourse = await Course.findUnique({
        where: {
          id: courseId,
        },
      });

      if (!existingCourse)
        return res.status(404).json(utils.apiError("Course Not Found"));

      const existingPayment = await PaymentMethod.findUnique({
        where: {
          id: paymentMethodId,
        },
      });

      if (!existingPayment)
        return res.status(404).json(utils.apiError("Payment Method Not Found"));

      const successfulPayment = true;

      const harga = parseFloat(existingCourse.harga);

      const transaction = await Transaction.create({
        data: {
          user: {
            connect: { id: userId },
          },
          course: {
            connect: { id: courseId },
          },
          paymentMethod: {
            connect: { id: paymentMethodId },
          },
          totalHarga: harga,
          paymentStatus: successfulPayment,
        },
      });
      return res
        .status(200)
        .json(
          utils.apiSuccess("Created Transaction successfully", transaction)
        );
    } catch (error) {
      console.log(error);
      return res.status(500).json(utils.apiError("Internal Server Error"));
    }
  },

  getAll: async (req, res) => {
    try {
      const allTransaction = await Transaction.findMany({
        select: {
          id: true,
          totalHarga: true,
          paymentStatus: true,
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
          paymentMethod: {
            select: {
              name: true,
            },
          },
        },
      });
      return res
        .status(200)
        .json(
          utils.apiSuccess(
            "All Transaction retrieved successfully",
            allTransaction
          )
        );
    } catch (error) {
      console.log(error);
      return res.status(500).json(utils.apiError("Internal Server Error"));
    }
  },

  destroy: async (req, res) => {
    try {
      const existingTransaction = await Transaction.findUnique({
        where: {
          id: parseInt(req.params.id),
        },
      });

      if (!existingTransaction) {
        return res.status(404).json(utils.apiError("Transaction not found"));
      }

      await Transaction.delete({
        where: {
          id: parseInt(req.params.id),
        },
      });
      return res
        .status(200)
        .json(
          utils.apiSuccess(
            "Transaction delete successfully",
            existingTransaction
          )
        );
    } catch (error) {
      console.log(error);
      return res.status(500).json(utils.apiError("Internal Server Error"));
    }
  },
};
