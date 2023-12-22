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

        let { name, no_telp, city, province, country } = req.body;
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

        const data = await Profile.create({
          data: {
            name: name,
            no_telp: no_telp,
            profilePicture: pictureUrl,
            city: city,
            province: province,
            country: country,
            userId: userIdFromToken,
          },
        });

        return res
          .status(200)
          .json({ message: "Profile created successfully", data });
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getAll: async (req, res) => {
    try {
      const data = await Profile.findMany({
        select: {
          id: true,
          name: true,
          no_telp: true,
          profilePicture: true,
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
        .json({ message: "All Review retrived successfully", data });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getById: async (req, res) => {
    try {
      const userId = res.user.id;

      const data = await Profile.findUnique({
        where: {
          userId: userId,
        },
        select: {
          id: true,
          name: true,
          no_telp: true,
          profilePicture: true,
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

      if (!data) {
        return res.status(404).json({ message: "Profile not found" });
      }

      return res
        .status(200)
        .json({ message: "Profile retrieved successfully", data });
    } catch (error) {
      console.log(error);
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

        const { name, no_telp, city, province, country } = req.body;
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

        const data = await Profile.update({
          where: {
            userId: userIdFromToken,
          },
          data: {
            name: name || existingProfile.name,
            no_telp: no_telp || existingProfile.no_telp,
            profilePicture: pictureUrl,
            city: city || existingProfile.city,
            province: province || existingProfile.province,
            country: country || existingProfile.country,
          },
        });

        return res
          .status(200)
          .json({ message: "Profile update successful", data });
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
