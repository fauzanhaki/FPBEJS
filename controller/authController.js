const { User } = require("../models");
const {
  cryptPassword,
  verifyHashed,
  encryptEmail,
  createToken,
  generateOTP,
  exclude,
} = require("../utils");
const { sendOTPByEmail, sendLinkByEmail, sendWarnByEmail } = require("../utils/sendEmail");


module.exports = {
  login: async (req, res, next) => {
    try {
      const { email, password, no_telp, username } = req.body;

      let user;
      if (email) {
        user = await User.findFirst({
          where: { email: email },
          include: { profile: true },
        });
      } else if (no_telp) {
        user = await User.findFirst({
          where: {
            profile: {
              no_telp: no_telp
            }
          },
          include: { profile: true },
        });
      } else if (username) {
        user = await User.findFirst({
          where: { username: username },
          include: { profile: true },
        });
      } else {
        return res.status(400).json({ message: "Invalid login request" });
      }

      if (!user) {
        return res.status(403).json({ message: "Invalid credentials" });
      }

      const verifyPassword = await verifyHashed(password, user.password.toString());
      if (!verifyPassword) {
        return res.status(403).json({ message: "Invalid password" });
      }

      const payload = {
        id: user.id,
        email: user.email,
        no_telp: user.profile?.no_telp,
        username: user.username,
      };
      const token = createToken(payload);

      return res.status(200).json({ data: { id: user.id, token } });
    } catch (error) {
      next(error)
    }
  },

  register: async (req, res, next) => {
    const { username, email, password, no_telp } = req.body;
    const otp = generateOTP();
    try {
      const findUser = await User.findFirst({
        where: {
          OR: [
            { username: username },
            { email: email },
            { profile: { no_telp: no_telp } },
          ],
        },
        include: {
          profile: true,
        },
      });

      if (findUser) {
        if (findUser.username === username) {
          return res.status(403).json({ message: 'Username already in use' });
        }

        if (findUser.email === email) {
          return res.status(403).json({ message: 'Email already in use' });
        }

        if (findUser.profile?.no_telp === no_telp) {
          return res.status(403).json({ message: 'Phone number already in use' });
        }
      }

      const newUser = await User.create({
        data: {
          username: username,
          email: email,
          password: cryptPassword(password),
          role: "user",
          verificationToken: otp,
          profile: {
            create: {
              no_telp: no_telp,
            },
          },
        },
        include: {
          profile: true,
        },
      });

      const verifyPassword = await verifyHashed(password, newUser.password.toString());
      if (!verifyPassword) {
        return res.status(403).json({ message: "Invalid password" });
      }

      const payload = {
        id: newUser.id,
        email: newUser.email,
      };
      const token = createToken(payload);

      const data = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        profile: {
          no_telp: newUser.profile.no_telp
        },
        token: token
      }

      if (data) {
        sendOTPByEmail(req.body.email, otp, (error, info) => {
          if (error) {
            return res.status(404).json({ message: 'Error during registration' });
          } else {
            res.status(200).json({ message: 'Registration successful and OTP sent successfully for verification', data });
          }
        });
      }

    } catch (error) {
      next(error)
    }
  },

  sendOTP: async (req, res, next) => {
    const userId = res.user.id;
    const otp = generateOTP();
    try {
      const user = await User.findUnique({
        where: { id: userId }
      })

      if (!user || user.length == 0) return res.status(403).json({ message: "User not found" })

      await User.update({
        where: { id: userId },
        data: { verificationToken: otp }
      })


      if (user) {
        sendOTPByEmail(req.body.email, otp, (error, info) => {
          if (error) {
            return res.status(404).json({ message: 'Error during registration' });
          } else {
            res.status(200).json({ message: 'OTP sent successfully for verification' });
          }
        });
      }
    } catch (error) {
      next(error)
    }
  },

  verifyOtp: async (req, res, next) => {
    const { otp } = req.body;
    const userId = res.user.id;

    try {
      const user = await User.findFirst({
        where: { id: userId, verificationToken: otp },
      });

      if (!user) {
        return res.status(403).json({ message: 'Invalid OTP' });
      }

      const currentTime = new Date();
      const tokenUpdateTime = new Date(user.updatedAt);

      if (currentTime - tokenUpdateTime <= 5 * 60 * 60 * 1000) {
        await User.update({
          where: { id: userId },
          data: { verificationToken: null },
        });

        return res.status(200).json({ message: 'Verification success' });
      } else {
        return res.status(403).json({ message: 'Token expired' });
      }
    } catch (error) {
      next(error);
    }
  },

  forgotPassword: async (req, res, next) => {
    const { email } = req.body;
    try {
        const findUser = await User.findFirst({
            where: { email: email }
        });

        if (!findUser) {
            return res.status(404).json({ message: "Account with this email not found" });
        }

        const resetToken = await encryptEmail(email); 

        await User.update({
            data: {
                resetPasswordToken: resetToken
            },
            where: {
                id: findUser.id
            }
        });

        const data = {
          resetToken: findUser.resetPasswordToken
        }

        sendLinkByEmail(findUser.email, resetToken, (error, info) => {
            if (error) {
                return res.status(500).json({ message: 'Error during sending reset password link' });
            } else {
                res.status(200).json({ message: 'Reset password link sent successfully', data });
            }
        });
    } catch (error) {
        next(error);
    }
},

resetPassword: async (req, res, next) => {
  try {
    const { key, new_password, confirm_password } = req.body;

    const user = await User.findFirst({
      where: {
        resetPasswordToken: key,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (new_password !== confirm_password) {
      return res.status(400).json({ message: "New password and confirm password do not match" });
    }

    const verifyPassword = await verifyHashed(new_password, user.password.toString());
    if (verifyPassword) {
      const newPassword = cryptPassword(new_password);
      await User.update({
        where: {
          id: user.id,
        },
        data: {
          password: newPassword,
          resetPasswordToken: null,
        },
      });

      sendWarnByEmail(user.email, (error, info) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ message: 'Error during sending warning' });
        } else {
          return res.status(200).json({ message: "Update password success" });
        }
      });
    } else {
      return res.status(400).json({ message: "Password verification failed" });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
},


  me: async (req, res, next) => {
    try {
      const userId = res.user.id;
      const user = await User.findUnique({
        where: {
          id: userId,
        },
      });

      const data = exclude(user, [
        "password",
        "resetPasswordToken",
        "verificationToken",
      ]);

      return res.status(200).json({ message: "Fetch Data Successfully", data });
    } catch (error) {
      next(error)
    }
  },
}
