const { Category } = require("../../models");
const utils = require("../../utils");

module.exports = {
  create: async (req, res) => {
    try {
      const { name } = req.body;

      // Periksa apakah file gambar terlampir
      if (!req.file) {
        return res.status(400).json(utils.error("Image is required"));
      }

      // Dapatkan data gambar dari buffer
      const image = req.file.buffer;

      // Simpan data ke dalam database
      const createdCategory = await Category.create({
        data: {
          name: name,
          image: image,
        },
      });

      return res
        .status(200)
        .json(
          utils.apiSuccess("Category created successfully", createdCategory)
        );
    } catch (error) {
      console.error(error);
      return res.status(500).json(utils.apiError("Internal Server Error"));
    }
  },
};
