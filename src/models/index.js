const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = {
    User: prisma.User,
    Role: prisma.Role,
    Profile: prisma.Profile,
    Category: prisma.Category,
    Course: prisma.Course,
    Level: prisma.Level,
    Review: prisma.Review,
    Ranting: prisma.Ranting,
    PaymentMethod: prisma.PaymentMethod,
    Transaction: prisma.Transaction,
};