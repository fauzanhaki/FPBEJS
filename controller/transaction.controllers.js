const { Transaction, User, Course, PaymentMethod } = require("../models");

module.exports = {
  create: async (req, res) => {
    try {
      const { courseId, paymentMethodId } = req.body;
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

      const existingPayment = await PaymentMethod.findUnique({
        where: {
          id: paymentMethodId,
        },
      });

      if (!existingPayment) {
        return res.status(404).json({ message: "Payment Method Not Found" });
      }

      const successfulPayment = true;
      const harga = parseFloat(existingCourse.price);

      const transaction = await Transaction.create({
        data: {
          user: {
            connect: { id: userIdFromToken },
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

      return res.status(200).json({
        message: "Created Transaction successfully",
        transaction,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
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
      return res.status(200).json({
        message: "All Transaction retrieved successfully",
        allTransaction,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getById: async (req, res) => {
    try {
      const userId = res.user.id;

      const transactions = await Transaction.findMany({
        where: {
          userId: userId,
        },
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

      if (!transactions || transactions.length === 0) {
        return res.status(404).json({ message: "No transactions found" });
      }

      return res
        .status(200)
        .json({ message: "Transactions retrieved successfully", transactions });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
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
        return res.status(404).json({ message: "Transaction not found" });
      }

      await Transaction.delete({
        where: {
          id: parseInt(req.params.id),
        },
      });
      return res.status(200).json({
        message: "Transaction delete successfully",
        existingTransaction,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
};
