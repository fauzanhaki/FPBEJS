const { User, Profile, Role } = require("../../models"),
  encry = require("../../utils/encryption"),
  utils = require("../../utils"),
  { google } = require("google-auth-library"),
  nodemailer = require("nodemailer");

module.exports = {
  createUser: async (req, res) => {
    try {
      let { username, email, password, resetToken, verificationToken, name } =
        req.body;

      // Directly set roleId to 2
      const roleId = 2;

      const existingEmail = await User.findFirst({
        where: {
          email: email,
        },
      });

      if (existingEmail) {
        return res.status(400).json(utils.apiError("Email is already taken"));
      }

      const existingRole = await Role.findUnique({
        where: {
          id: roleId,
        },
      });

      if (!existingRole)
        return res.status(404).json(utils.apiError("Role Not Found"));

      const register = await User.create({
        data: {
          username: username,
          email: email,
          password: await encry.encryptPassword(password),
          resetToken: resetToken,
          verificationToken: verificationToken,
          role: {
            connect: { id: roleId },
          },
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
          roleId: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return res
        .status(200)
        .json(utils.apiSuccess("Register successfully", response));
    } catch (error) {
      console.error(error);
      return res.status(500).json(utils.apiError("Internal Server Error"));
    }
  },

  create: async (req, res) => {
    try {
      let {
        username,
        email,
        password,
        resetToken,
        verificationToken,
        roleId,
        name,
      } = req.body;

      roleId = parseInt(roleId);

      const existingEmail = await User.findFirst({
        where: {
          email: email,
        },
      });

      if (existingEmail) {
        return res.status(400).json(utils.apiError("Email is already taken"));
      }

      const existingRole = await Role.findUnique({
        where: {
          id: roleId,
        },
      });

      if (!existingRole)
        return res.status(404).json(utils.apiError("Role Not Found"));

      const register = await User.create({
        data: {
          username: username,
          email: email,
          password: await encry.encryptPassword(password),
          resetToken: resetToken,
          verificationToken: verificationToken,
          role: {
            connect: { id: roleId },
          },
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
          roleId: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return res
        .status(200)
        .json(utils.apiSuccess("Register successfully", response));
    } catch (error) {
      console.error(error);
      return res.status(500).json(utils.apiError("Internal Server Error"));
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findFirst({
        where: {
          email: email,
        },
      });

      if (!user)
        return res
          .status(403)
          .json(utils.apiError("Email or password is incorrect"));

      const verifyPassword = await encry.verifyHashedData(
        password,
        user.password
      );
      if (!verifyPassword)
        return res
          .status(403)
          .json(utils.apiError("Email or password is incorrect"));

      const payload = {
        id: user.id,
        email: user.email,
        roleId: user.roleId,
      };

      const token = encry.createJwt(payload);

      return res
        .status(200)
        .json(utils.apiSuccess("Login successfully", token));
    } catch (error) {
      console.error(error);
      return res.status(500).json(utils.apiError("Internal Server Error"));
    }
  },

  me: async (req, res) => {
    try {
      const user = await User.findUnique({
        where: {
          id: res.user.id,
        },
      });

      const data = utils.exclude(user, [
        "password",
        "resetToken",
        "verificationToken",
      ]);

      return res
        .status(200)
        .json(utils.apiSuccess("Fetch Data Successfully", data));
    } catch (error) {
      console.log(error);
      return res.status(500).json(utils.apiError("Internal Server Error"));
    }
  },

  changePassword: async (req, res) => {
    try {
      const userId = +res.user.id;
      const { old_password, new_password } = req.body;

      if (typeof userId !== "number" || !(old_password && new_password)) {
        return res.status(400).json(utils.apiError("Bad Syntax"));
      }

      const user = await User.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) return res.status(404).json(utils.apiError("User not found"));

      const verifyPassword = await encry.verifyHashedData(
        old_password,
        user.password
      );

      if (verifyPassword) {
        const newPassword = await encry.encryptPassword(new_password);
        await User.update({
          where: {
            id: userId,
          },
          data: {
            password: newPassword,
          },
        });
        return res
          .status(201)
          .json(utils.apiSuccess("Password changed successfully"));
      }
      return res
        .status(409)
        .json(utils.apiSuccess("Your current password is wrong"));
    } catch (error) {
      console.error(error);
      return res.status(500).json(utils.apiSuccess("Internal Server Error!"));
    }
  },

  resetPassword: async (req, res) => {
    try {
      const findUser = await User.findFirst({
        where: {
          email: req.body.email,
        },
      });

      if (!findUser) {
        return res.status(404).json(utils.apiError("User not found"));
      }

      const resetToken = await encry.encryptPassword(findUser.email);

      await User.update({
        where: {
          id: findUser.id,
        },
        data: {
          resetToken,
          verificationToken: resetToken, // Assuming you want to use the same token for verification
        },
      });

      return res
        .status(200)
        .json(utils.apiSuccess("Password reset token generated successfully"));
    } catch (error) {
      console.error(error);
      return res.status(500).json(utils.apiError("Internal Server Error"));
    }
  },

  setPassword: async (req, res) => {
    try {
      const findUser = await User.findFirst({
        where: {
          resetToken: req.body.key,
        },
      });

      if (!findUser) {
        return res
          .status(404)
          .json(utils.apiError("User not found or invalid reset token"));
      }

      // Update password and resetToken
      await User.update({
        where: {
          id: findUser.id,
        },
        data: {
          password: await encry.encryptPassword(req.body.password),
          resetToken: null,
        },
      });

      return res
        .status(200)
        .json(utils.apiSuccess("Password set successfully"));
    } catch (error) {
      console.error(error);
      return res.status(500).json(utils.apiError("Internal Server Error"));
    }
  },

  googleLogin: async (req, res) => {
    try {
      const { token } = req.body;
      const client = new google.auth.OAuth2();
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const { email } = ticket.getPayload();

      const existingUser = await User.findFirst({
        where: {
          email: email,
        },
      });

      if (existingUser) {
        const payload = {
          id: existingUser.id,
          email: existingUser.email,
          roleId: existingUser.roleId,
        };
        const newToken = encry.createJwt(payload);
        return res
          .status(200)
          .json(utils.apiSuccess("Login successfully", newToken));
      } else {
        return res.status(404).json(utils.apiError("User not found"));
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json(utils.apiError("Internal Server Error"));
    }
  },

  resetPasswordgoogle: async (req, res) => {
    try {
      const findUser = await User.findFirst({
        where: {
          email: req.body.email,
        },
      });

      if (!findUser) {
        return res.status(404).json(utils.apiError("User not found"));
      }

      const resetToken = utils.generateResetToken();
      const verificationToken = await encry.encryptPassword(resetToken);

      await User.update({
        where: {
          id: findUser.id,
        },
        data: {
          resetToken,
          verificationToken,
        },
      });

      await sendResetEmail(findUser.email, resetToken);

      return res
        .status(200)
        .json(utils.apiSuccess("Password reset token sent successfully"));
    } catch (error) {
      console.error(error);
      return res.status(500).json(utils.apiError("Internal Server Error"));
    }
  },
};

const sendResetEmail = async (email, resetToken) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: "Password Reset",
    text: `Your password reset token is: ${resetToken}`,
  };

  await transporter.sendMail(mailOptions);
};
