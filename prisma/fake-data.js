const { Role, Level } = require('@prisma/client'),
  { faker } = require('@faker-js/faker/locale/id_ID'),
  bcrypt = require('bcrypt')

const uniqueNumbers = Array.from({ length: 10 }, (_, index) => index + 1);

function getUniqueNumber() {
  if (uniqueNumbers.length === 0) {
    console.error("No unique numbers available.");
    return null;
  }

  const randomIndex = faker.number.int({ min: 0, max: uniqueNumbers.length - 1 });
  const randomNumber = uniqueNumbers[randomIndex];
  uniqueNumbers.splice(randomIndex, 1);
  return randomNumber;
}

function fakeUser() {
  return {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: bcrypt.hashSync("12345678", bcrypt.genSaltSync(5)),
    resetPasswordToken: undefined,
    verificationToken: undefined,
    role: faker.helpers.arrayElement([Role.user, Role.admin]),
  };
}

function fakeProfile() {
  return {
    name: faker.person.fullName(),
    no_telp: faker.lorem.words(5),
    profilePicture: faker.lorem.words(5),
    city: faker.location.city(),
    province: faker.location.state(),
    country: "Indonesia",
    userId: getUniqueNumber()
  };
}

function fakeNotification() {
  return {
    message: faker.lorem.words(5),
    isRead: faker.datatype.boolean(),
    userId: getUniqueNumber(),
  };
}

function fakeCategory() {
  return {
    name: faker.helpers.arrayElement(["UI/UX", "Front-End", "Back-End"]),
  };
}

function fakeCourse() {
  return {
    name: faker.person.fullName(),
    courseCode: faker.lorem.words(5),
    isPremium: faker.datatype.boolean(),
    categoryId: getUniqueNumber(),
    level: faker.helpers.arrayElement([Level.beginner, Level.intermediate, Level.advanced]),
    price: faker.number.int({ min: 99000, max: 1000000 }),
    description: faker.lorem.words(5),
  };
}

function fakeTransaction() {
  return {
    userId: getUniqueNumber(),
  };
}

function fakePaymentMethod() {
  return {
    name: faker.helpers.arrayElement(["Dana", "Gopay", "Saku", "Dompet", "Cash"]),
  };
}

function fakeDetailTransaction() {
  return {
    courseId: getUniqueNumber(),
    transactionId: getUniqueNumber(),
    paymentMethodId: getUniqueNumber(),
    paymentStatus: faker.datatype.boolean(),
  };
}

function fakeReview() {
  return {
    rating: faker.lorem.words(5),
    feedback: faker.lorem.words(5),
    date: new Date(),
    userId: getUniqueNumber(),
    courseId: getUniqueNumber(),
  };
}


module.exports = {
  fakeUser,
  fakeProfile,
  fakeCategory,
  fakeCourse,
  fakeDetailTransaction,
  fakePaymentMethod,
  fakeNotification,
  fakeReview,
  fakeTransaction
}
