const { User } = require("../models");

const authPage = (allowedRoles) => {
  return async (req, res, next) => {
    const userId = res.user.id;

    try {
      const user = await User.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      const userRole = user.role;

      if (allowedRoles.includes(userRole)) {
        next();
      } else {
        return res.status(403).json({ error: "Access forbidden" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };
};

module.exports = {
  authPage,
};
