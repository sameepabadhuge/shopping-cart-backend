const express = require("express");

const router =
  express.Router();

const {
  createOrder,
  getUserOrders,
  getAllOrders,
} = require("../controllers/orderController");

// Place Order
router.post(
  "/create",
  createOrder
);

// User Orders
router.get(
  "/user/:userId",
  getUserOrders
);

// Admin Orders
router.get(
  "/all",
  getAllOrders
);

module.exports = router;