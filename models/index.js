const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();

module.exports = {
    users: prisma.user,
    category: prisma.category,
    course: prisma.course,
    profile: prisma.profile
}