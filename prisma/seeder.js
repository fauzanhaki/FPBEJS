const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();



const { fakeUser,
  fakeProfile,
  fakeCategory,
  fakeCourse,
  fakeDetailTransaction,
  fakePaymentMethod,
  fakeNotification,
  fakeReview,
  getUniqueNumber } = require('./fake-data');


async function seed() {
  // Seeder untuk User
  for (let i = 0; i < 10; i++) {
    await prisma.user.create({
      data: fakeUser(),
    });
  }

  // Seeder untuk Profile
  const user = await prisma.user.findMany();
  for (let i = 0; i < 10; i++) {
    await prisma.profile.create({
      data: {
        ...fakeProfile(),
        userId: user[i].id,
      }
    });
  }

  // Seeder untuk Notification
  for (let i = 0; i < 10; i++) {
    await prisma.notification.create({
      data: {
        ...fakeNotification(),
        userId: getUniqueNumber(user),
      },
    });
  }

  // Seeder untuk Category
  for (let i = 0; i < 3; i++) {
    await prisma.category.create({
      data: fakeCategory(),
    });
  }
  const category = await prisma.category.findMany();

  // Seeder untuk Course
  for (let i = 0; i < 10; i++) {
    await prisma.course.create({
      data: {
        ...fakeCourse(),
        categoryId: getUniqueNumber(category),
      },
    });
  }

  // Seeder untuk PaymentMethod
  for (let i = 0; i < 5; i++) {
    await prisma.paymentMethod.create({
      data: fakePaymentMethod(),
    });
  }

  // Seeder untuk Transaction
  for (let i = 0; i < 10; i++) {
    await prisma.transaction.create({
      data: {
        userId: getUniqueNumber(user)
      },
    });
  }


  // Seeder untuk DetailTransaction
  const paymentMethod = await prisma.paymentMethod.findMany()
  const course = await prisma.paymentMethod.findMany()
  const transaction = await prisma.transaction.findMany()
  for (let i = 0; i < 10; i++) {
    await prisma.detailTransaction.create({
      data: {
        courseId: getUniqueNumber(course),
        transactionId: getUniqueNumber(transaction),
        paymentMethodId: getUniqueNumber(paymentMethod),
        ...fakeDetailTransaction()
      },
    });
  }

  // Seeder untuk Review
  for (let i = 0; i < 10; i++) {
    await prisma.review.create({
      data: {
        ...fakeReview(),
        userId: getUniqueNumber(user),
        courseId: getUniqueNumber(course)
      },
    });
  }

  console.log('Seeder selesai.');
  await prisma.$disconnect();
}

seed();
