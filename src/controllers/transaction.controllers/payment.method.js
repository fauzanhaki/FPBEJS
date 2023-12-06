const { PaymentMethod } = require("../../models");
const utils = require("../../utils");

module.exports = {
  create: async (req, res) => {
    try {
      const { name } = req.body;
      const create = await PaymentMethod.create({
        data: {
          name: name,
        },
      });

      return res.status(201).json({
        error: false,
        message: "Payment Method created successfully",
        data: create,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json(utils.apiError("Internal Server Error"));
    }
  },

  getAll: async (req, res) => {
    try {
      const data = await PaymentMethod.findMany();

      return res.status(200).json({
        data,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json(utils.apiError("Internal Server Error"));
    }
  },

  update: async (req, res) => {
    try {
      const { name } = req.body;
      const existingPayment = await PaymentMethod.findUnique({
        where: {
          id: parseInt(req.params.id),
        },
      });

      if (!existingPayment) {
        return res
          .status(404)
          .json({ error: true, message: "Payment Method not found" });
      }

      const update = await PaymentMethod.update({
        where: {
          id: parseInt(req.params.id),
        },
        data: {
          name: name || existingPayment.name,
        },
      });

      return res.status(200).json({
        error: false,
        message: "Payment method update successfully",
        data: update,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json(utils.apiError("Internal Server Error"));
    }
  },

  destroy: async (req, res) => {
    try {
      const existingPayment = await PaymentMethod.findUnique({
        where: {
          id: parseInt(req.params.id),
        },
      });

      if (!existingPayment) {
        return res
          .status(404)
          .json({ error: true, message: "Payment Method not found" });
      }

      await PaymentMethod.delete({
        where: {
          id: parseInt(req.params.id),
        },
      });
      return res.status(200).json({
        error: false,
        message: "Payment method delete successfully",
        data: existingPayment,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json(utils.apiError("Internal Server Error"));
    }
  },
};
