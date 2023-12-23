const { Role, Level } = require('@prisma/client'),
  { faker } = require('@faker-js/faker/locale/id_ID'),
  bcrypt = require('bcrypt');


function getUniqueNumber(number) {
  const randomArrayIndex = faker.number.int({ min: 0, max: number.length - 1 });
  const id = number[randomArrayIndex].id;
  return id
}

function fakeUser() {
  return {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: bcrypt.hashSync("12345678", bcrypt.genSaltSync(5)),
    resetPasswordToken: undefined,
    verificationToken: undefined,
    role: faker.helpers.arrayElement([Role.user, Role.admin, Role.mentor]),
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
  };
}

function fakeNotification() {
  return {
    message: faker.lorem.words(5),
    isRead: faker.datatype.boolean(),
  };
}

const categories = ["UI/UX", "Front-End", "Back-End"];
let usedCategories = [];
function fakeCategory() {
  let name = '';

  const unusedCategories = categories.filter(category => !usedCategories.includes(category));

  if (unusedCategories.length > 0) {
    const randomIndex = Math.floor(Math.random() * unusedCategories.length);
    name = unusedCategories[randomIndex];
    usedCategories.push(name);
  } else {
    usedCategories = [];
    name = categories[Math.floor(Math.random() * categories.length)];
    usedCategories.push(name);
  }

  return {
    name: name,
  };
}


function fakeCourse() {
  return {
    name: faker.person.fullName(),
    courseCode: faker.lorem.words(5),
    isPremium: faker.datatype.boolean(),
    level: faker.helpers.arrayElement([Level.beginner, Level.intermediate, Level.advanced]),
    price: faker.number.int({ min: 99000, max: 1000000 }),
    description: faker.lorem.words(5),
    videoUrl: faker.lorem.words(5),
  };
}

const paymentMethod = ["Dana", "OVO", "Gopay", "Saku", "Link Aja"];
let usedPaymentMethod = [];
function fakePaymentMethod() {
  let name = '';

  const unusedPaymentMethod = paymentMethod.filter(method => !usedPaymentMethod.includes(method));

  if (unusedPaymentMethod.length > 0) {
    const randomIndex = Math.floor(Math.random() * unusedPaymentMethod.length);
    name = unusedPaymentMethod[randomIndex];
    usedPaymentMethod.push(name);
  } else {
    usedPaymentMethod = [];
    name = categories[Math.floor(Math.random() * categories.length)];
    usedPaymentMethod.push(name);
  }

  return {
    name: name,
  };
}

function fakeDetailTransaction() {
  return {
    paymentStatus: faker.datatype.boolean(),
  };
}

function fakeReview() {
  return {
    rating: faker.number.int({min: 1, max: 5}),
    feedback: faker.lorem.words(5),
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
  getUniqueNumber
}