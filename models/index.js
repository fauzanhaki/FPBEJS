const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();

module.exports = {
    users: prisma.user,
    category: prisma.Category,
    course: prisma.course
}