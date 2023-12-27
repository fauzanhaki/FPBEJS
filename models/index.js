const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = {
  User: prisma.user,
  Profile: prisma.profile,
  Category: prisma.category,
  Course: prisma.course,
  Module: prisma.module,
  Review: prisma.review,
  PaymentMethod: prisma.paymentMethod,
  Transaction: prisma.transaction,
  DetailTransaction: prisma.detailTransaction,
};
