const { User, Role } = require("../models");
const {
  cryptPassword,
  verifyHashed,
  encryptToken,
  createToken,
  exclude,
} = require("../utils");

module.exports = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findFirst({
        where: {
          email,
        },
      });
      if (!user) return res.status(403).json({ message: "Email incorrect" });

      const verifyPassword = await verifyHashed(password, user.password);
      if (!verifyPassword)
        return res.status(403).json({ message: "Password is incorrect" });

      const payload = { id: user.id, email: user.email };
      const token = createToken(payload);

      return res.status(200).json({ token });
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  createUser: async (req, res) => {
    try {
      let { username, email, password, resetToken, verificationToken, name } =
        req.body;

      const role = "user";

      const existingEmail = await User.findFirst({
        where: {
          email: email,
        },
      });

      if (existingEmail) {
        return res.status(400).json({ message: "Email is already taken" });
      }

      const register = await User.create({
        data: {
          username: username,
          email: email,
          password: await cryptPassword(password),
          resetToken: resetToken,
          verificationToken: verificationToken,
          role: role,
          profile: {
            create: {
              name: name,
            },
          },
        },
      });

      const response = await User.findUnique({
        where: {
          id: register.id,
        },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return res
        .status(200)
        .json({ message: "Register successfully", response });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  createAdmin: async (req, res) => {
    try {
      let {
        username,
        email,
        password,
        resetToken,
        verificationToken,
        role,
        name,
      } = req.body;

      const existingEmail = await User.findFirst({
        where: {
          email: email,
        },
      });

      if (existingEmail) {
        return res.status(400).json({ message: "Email is already taken" });
      }

      const register = await User.create({
        data: {
          username: username,
          email: email,
          password: await cryptPassword(password),
          resetToken: resetToken,
          verificationToken: verificationToken,
          role: role,
          profile: {
            create: {
              name: name,
            },
          },
        },
      });

      const response = await User.findUnique({
        where: {
          id: register.id,
        },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return res
        .status(200)
        .json({ message: "Register successfully", response });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  me: async (req, res) => {
    try {
      const user = await User.findUnique({
        where: {
          id: res.user.id,
        },
      });

      const data = exclude(user, [
        "password",
        "resetPasswordToken",
        "verificationToken",
      ]);

      return res.status(200).json({ message: "Fetch Data Successfully", data });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
};
