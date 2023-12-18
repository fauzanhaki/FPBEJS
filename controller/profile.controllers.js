const { User, Profile } = require("../models"),
  { imageKit } = require("../utils/image.kit"),
  multer = require("multer"),
  upload = multer().single("picture");

module.exports = {
  create: async (req, res) => {
    try {
      upload(req, res, async (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Error uploading file" });
        }

        let { name, phone, city, province, country } = req.body;
        const userIdFromToken = res.user.id;

        const existingUser = await User.findUnique({
          where: {
            id: userIdFromToken,
          },
        });

        if (!existingUser) {
          return res.status(404).json({ message: "User Not Found" });
        }

        let pictureUrl = null;

        if (req.file) {
          try {
            const uploadResponse = await imageKit.upload({
              file: req.file.buffer.toString("base64"),
              fileName: `${userIdFromToken}_profile_picture`,
            });
            pictureUrl = uploadResponse.url;
          } catch (uploadError) {
            console.error(uploadError);
            return res
              .status(500)
              .json({ message: "Error uploading file to ImageKit" });
          }
        }

        const profile = await Profile.create({
          data: {
            name: name,
            phone: phone,
            picture: pictureUrl,
            city: city,
            province: province,
            country: country,
            userId: userIdFromToken,
          },
        });

        return res
          .status(200)
          .json({ message: "Profile created successfully", profile });
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getAll: async (req, res) => {
    try {
      const allProfile = await Profile.findMany({
        select: {
          id: true,
          name: true,
          phone: true,
          picture: true,
          city: true,
          province: true,
          country: true,
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      });
      return res
        .status(200)
        .json({ message: "All Review retrived successfully", allProfile });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getById: async (req, res) => {
    try {
      const userId = res.user.id;

      const profile = await Profile.findUnique({
        where: {
          userId: userId,
        },
        select: {
          id: true,
          name: true,
          phone: true,
          picture: true,
          city: true,
          province: true,
          country: true,
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      });

      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      return res
        .status(200)
        .json({ message: "Profile retrieved successfully", profile });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  update: async (req, res) => {
    try {
      upload(req, res, async (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Error uploading file" });
        }

        const { name, phone, city, province, country } = req.body;
        const userIdFromToken = res.user.id;

        const existingProfile = await Profile.findUnique({
          where: {
            userId: userIdFromToken,
          },
        });

        if (!existingProfile) {
          return res.status(404).json({ message: "Profile not found" });
        }

        let pictureUrl = existingProfile.picture;

        if (req.file) {
          try {
            const uploadResponse = await imageKit.upload({
              file: req.file.buffer.toString("base64"),
              fileName: `${userIdFromToken}_profile_picture`,
            });
            pictureUrl = uploadResponse.url;
          } catch (uploadError) {
            console.error(uploadError);
            return res
              .status(500)
              .json({ message: "Error uploading file to ImageKit" });
          }
        }

        const updatedProfile = await Profile.update({
          where: {
            userId: userIdFromToken,
          },
          data: {
            name: name || existingProfile.name,
            phone: phone || existingProfile.phone,
            picture: pictureUrl,
            city: city || existingProfile.city,
            province: province || existingProfile.province,
            country: country || existingProfile.country,
          },
        });

        return res
          .status(200)
          .json({ message: "Profile update successful", updatedProfile });
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  destroy: async (req, res) => {
    try {
      const existingProfile = await Profile.findUnique({
        where: {
          id: parseInt(req.params.id),
        },
      });

      if (!existingProfile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      await Profile.delete({
        where: {
          id: parseInt(req.params.id),
        },
      });

      return res
        .status(200)
        .json({ message: "Profile delete successfully", existingProfile });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
};
