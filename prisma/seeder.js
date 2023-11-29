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
    fakeTransaction } = require('./fake-data');


async function seed() {
  // Seeder untuk User
  for (let i = 0; i < 10; i++) {
    await prisma.user.create({
      data: fakeUser(),
    });
  }

  // Seeder untuk Profile
  for (let i = 0; i < 10; i++) {
    await prisma.profile.create({
      data: fakeProfile(),
    });
  }
 
  // Seeder untuk Notification
  for (let i = 0; i < 10; i++) {
    await prisma.notification.create({
      data: fakeNotification(),
    });
  }

  // Seeder untuk Category
  for (let i = 0; i < 3; i++) {
    await prisma.category.create({
      data: fakeCategory(),
    });
  }

  // Seeder untuk Course
  for (let i = 0; i < 10; i++) {
    await prisma.course.create({
      data: fakeCourse(),
    });
  }

  // Seeder untuk PaymentMethod
  for (let i = 0; i < 3; i++) {
    await prisma.paymentMethod.create({
      data: fakePaymentMethod(),
    });
  }

  // Seeder untuk Transaction
  for (let i = 0; i < 5; i++) {
    await prisma.transaction.create({
      data: fakeTransaction(),
    });
  }


  // Seeder untuk DetailTransaction
  for (let i = 0; i < 10; i++) {
    await prisma.detailTransaction.create({
      data: fakeDetailTransaction(),
    });
  }

  // Seeder untuk Review
  for (let i = 0; i < 10; i++) {
    await prisma.review.create({
      data: fakeReview(),
    });
  }

  console.log('Seeder selesai.');
  await prisma.$disconnect();
}

seed();
