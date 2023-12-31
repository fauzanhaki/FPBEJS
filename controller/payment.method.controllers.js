const { PaymentMethod } = require("../models");

module.exports = {
  create: async (req, res) => {
    try {
      const { name } = req.body;
      const data = await PaymentMethod.create({
        data: {
          name: name,
        },
      });
      return res
        .status(200)
        .json({ message: "Payment Method created successfully", data });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getAll: async (req, res) => {
    try {
      const data = await PaymentMethod.findMany();

      return res
        .status(200)
        .json({ message: "All Payment Method retrivired successfully", data });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
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
        return res.status(404).json({ message: "Payment Method not found" });
      }

      const data = await PaymentMethod.update({
        where: {
          id: parseInt(req.params.id),
        },
        data: {
          name: name || existingPayment.name,
        },
      });
      return res
        .status(200)
        .json({ message: "Payment Method update successfully", data });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  destroy: async (req, res) => {
    try {
      const data = await PaymentMethod.findUnique({
        where: {
          id: parseInt(req.params.id),
        },
      });

      if (!data) {
        return res.status(404).json({ message: "Payment Method not found" });
      }

      await PaymentMethod.delete({
        where: {
          id: parseInt(req.params.id),
        },
      });
      return res.status(200).json({
        message: "Payment Method delete successfully",
        data,
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
};
