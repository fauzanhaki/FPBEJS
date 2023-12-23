const { Transaction, User, Course, PaymentMethod, DetailTransaction, Category } = require("../models");

module.exports = {
  create: async (req, res) => {
    try {
      const { courseId, paymentMethodId, paymentStatus } = req.body;
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
          id: parseInt(courseId),
        },
      });

      if (!existingCourse) {
        return res.status(404).json({ message: "Course Not Found" });
      }

      const existingPayment = await PaymentMethod.findUnique({
        where: {
          id: parseInt(paymentMethodId),
        },
      });

      if (!existingPayment) {
        return res.status(404).json({ message: "Payment Method Not Found" });
      }


      const data = await Transaction.create({
        data: {
          userId: existingUser.id,
          detailTransaction: {
            create: {
              courseId: parseInt(courseId),
              paymentMethodId: parseInt(paymentMethodId),
              paymentStatus: Boolean(paymentStatus)
            }
          }
        }
      })

      return res.status(200).json({
        message: "Created Transaction successfully",
        data,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getAll: async (req, res) => {
    try {
      const transaction = await Transaction.findMany({
        select: {
          id: true,
          detailTransaction: true,
          user: {
            select: {
              username: true
            }
          }
        },
      });
    
      if (!transaction || transaction.length === 0) {
        return res.status(404).json({ message: 'No transactions found' });
      }
    
      const data = await Promise.all(
        transaction.map(async (transaction) => {
          const detailTransaction = await DetailTransaction.findUnique({
            where: { id: parseInt(transaction.id) },
          });

          const course = await Course.findUnique({
            where: {id: detailTransaction.courseId}
          })

          const category = await Category.findUnique({
            where: {id: course.categoryId}
          })

          const paymentMethod = await PaymentMethod.findUnique({
            where:{id: detailTransaction.paymentMethodId}
          })

          if(!detailTransaction.paymentStatus) {
            detailTransaction.createdAt = "-"
            detailTransaction.updatedAt = "-"
            paymentMethod.name = "-"
          }
    
          return {
            id: transaction.id,
            username: transaction.user.username,
            course: course.name,
            courseCode: course.courseCode,
            courseLevel: course.level,
            category: category.name,
            price: course.price,
            paymentStatus: detailTransaction.paymentStatus,
            paymentMethod: paymentMethod.name,
            createdAt: detailTransaction.createdAt,
            updatedAt: detailTransaction.updatedAt
          };
        })
      );
    
      return res.status(200).json({
        message: "All Transaction retrieved successfully",
        data,
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
