const { Role } = require("../../models"),
  utils = require("../../utils");

module.exports = {
  create: async (req, res) => {
    try {
      const { name } = req.body;
      const create = await Role.create({
        data: {
          name: name,
        },
      });
      return res
        .status(200)
        .json(utils.apiSuccess("Roles created successfully", create));
    } catch (error) {
      console.error(error);
      return res.status(500).json(utils.apiError("Internal Server Error"));
    }
  },

  getAll: async (req, res) => {
    try {
      const data = await Role.findMany();

      return res
        .status(200)
        .json(utils.apiSuccess("All Roles retrivired successfully", data));
    } catch (error) {
      console.error(error);
      return res.status(500).json(utils.apiError("Internal Server Error"));
    }
  },

  update: async (req, res) => {
    try {
      const { name } = req.body;
      const existingRole = await Role.findUnique({
        where: {
          id: parseInt(req.params.id),
        },
      });

      if (!existingRole) {
        return res.status(404).json(utils.apiError("Roles not found"));
      }

      const update = await Role.update({
        where: {
          id: parseInt(req.params.id),
        },
        data: {
          name: name || existingRole.name,
        },
      });
      return res
        .status(200)
        .json(utils.apiSuccess("Roles update successfully", update));
    } catch (error) {
      console.error(error);
      return res.status(500).json(utils.apiError("Internal Server Error"));
    }
  },

  destroy: async (req, res) => {
    try {
      const existingRole = await Role.findUnique({
        where: {
          id: parseInt(req.params.id),
        },
      });

      if (!existingRole) {
        return res.status(404).json(utils.apiError("Roles not found"));
      }

      await Role.delete({
        where: {
          id: parseInt(req.params.id),
        },
      });
      return res
        .status(200)
        .json(utils.apiSuccess("Roles delete successfully", existingRole));
    } catch (error) {
      console.error(error);
      return res.status(500).json(utils.apiError("Internal Server Error"));
    }
  },
};
