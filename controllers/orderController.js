const Order = require("../models/Order");
const Cart = require("../models/Cart");

// CREATE ORDER
const createOrder = async (req, res) => {
  try {
    const {
      userId,
      customerName,
      phone,
      address,
      city,
      postalCode,
      items,
      subtotal,
      shipping,
      total,
    } = req.body;

    const order =
      await Order.create({
        userId,
        customerName,
        phone,
        address,
        city,
        postalCode,
        items,
        subtotal,
        shipping,
        total,
      });

    // Clear cart after order
    await Cart.findOneAndDelete({
      userId,
    });

    res.status(201).json({
      message:
        "Order placed successfully",
      order,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET USER ORDERS
const getUserOrders =
  async (req, res) => {
    try {
      const orders =
        await Order.find({
          userId: req.params.userId,
        }).sort({
          createdAt: -1,
        });

      res.json(orders);

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

// GET ALL ORDERS (ADMIN)
const getAllOrders =
  async (req, res) => {
    try {
      const orders =
        await Order.find().sort({
          createdAt: -1,
        });

      res.json(orders);

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

module.exports = {
  createOrder,
  getUserOrders,
  getAllOrders,
};