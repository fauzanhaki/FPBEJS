const { User } = require("../models")

const unverifiedUser = async (req, res, next) => {
  const userId = res.user.id;

  try {
    await User.deleteMany({
      where: {
        id: userId,
        verificationToken: { not: null },
        updatedAt: { lte: new Date(new Date() - 5 * 60 * 60 * 1000) },
      },
    });

    next();
  } catch (error) {
    console.error('Error deleting unverified user:', error);
    next(error);
  }
}

module.exports = unverifiedUser;
