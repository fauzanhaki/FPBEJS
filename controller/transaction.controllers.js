const { Transaction, User, Course, PaymentMethod, DetailTransaction, Category } = require("../models");

module.exports = {
  create: async (req, res) => {
    try {
      const { courseId, paymentStatus = true, total, paymentMethod, cardNumber, cardHolderName, cvv, expiryDate } = req.body;
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

      const existingPayment = await PaymentMethod.findFirst({
        where: {
          name: paymentMethod
        },
      });

      if (!existingPayment) {
        return res.status(404).json({ message: "Payment Method Not Found" });
      }

      if (existingPayment.name == paymentMethod.toLowerCase()) {
        const data = await Transaction.create({
          data: {
            userId: userIdFromToken,
            total: Number(total),
            detailTransaction: {
              create: {
                courseId: parseInt(courseId),
                paymentMethodId: existingPayment.id,
                cardNumber: cardNumber,
                cardHolderName: cardHolderName,
                paymentStatus: paymentStatus,
                cvv: cvv,
                // expiryDate: new Date(expiryDate),
                expiryDate: expiryDate,
              }
            }
          }
        })
        return res.status(200).json({
          message: "Created Transaction successfully",
          data,
        });
      }

      const data = await Transaction.create({
        data: {
          userId: existingUser.id,
          total: Number(total),
          detailTransaction: {
            create: {
              courseId: parseInt(courseId),
              paymentMethodId: existingPayment.id,
              paymentStatus: Boolean(paymentStatus),
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
      const transaction = await Transaction.findMany()

      if (!transaction || transaction.length === 0) {
        return res.status(404).json({ message: 'No transactions found' });
      }

      const data = await Promise.all(
        transaction.map(async (transaction) => {
          const user = await User.findUnique({
            where: {id: transaction.userId}
          })

          const detailTransaction = await DetailTransaction.findUnique({
            where: { id: parseInt(transaction.id) },
          });

          const course = await Course.findUnique({
            where: { id: detailTransaction.courseId }
          })

          const category = await Category.findUnique({
            where: { id: course.categoryId }
          })

          const paymentMethod = await PaymentMethod.findUnique({
            where: { id: detailTransaction.paymentMethodId }
          })

          if (!detailTransaction.paymentStatus) {
            detailTransaction.createdAt = "-"
            detailTransaction.updatedAt = "-"
            paymentMethod.name = "-"
          }

          return {
            id: transaction.id,
            username: user.username,
            course: course.name,
            courseCode: course.courseCode,
            courseLevel: course.level,
            category: category.name,
            price: course.price,
            total: transaction.total,
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

  myTransaction: async (req, res) => {
    try {
      const userId = Number(res.user.id);
      const transaction = await Transaction.findFirst({
        where: {userId: userId}
      })

      if (!transaction || transaction.length === 0) {
        return res.status(404).json({ message: 'No transactions found' });
      }

      
          const user = await User.findUnique({
            where: {id: userId}
          })

          const detailTransaction = await DetailTransaction.findUnique({
            where: { id: parseInt(transaction.id) }
          });

          const course = await Course.findUnique({
            where: { id: detailTransaction.courseId }
          })

          const category = await Category.findUnique({
            where: { id: course.categoryId }
          })

          const paymentMethod = await PaymentMethod.findUnique({
            where: { id: detailTransaction.paymentMethodId }
          })

          if (!detailTransaction.paymentStatus) {
            detailTransaction.createdAt = "-"
            detailTransaction.updatedAt = "-"
            paymentMethod.name = "-"
          }

          const data =  {
            id: transaction.id,
            username: user.username,
            course: course.name,
            courseCode: course.courseCode,
            courseLevel: course.level,
            category: category.name,
            price: course.price,
            total: transaction.total,
            paymentStatus: detailTransaction.paymentStatus,
            paymentMethod: paymentMethod.name,
            createdAt: detailTransaction.createdAt,
            updatedAt: detailTransaction.updatedAt
          };

      return res.status(200).json({
        message: "Get by id successfully",
        data,
      });
    } catch (error) {
      console.log(error);
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
