const express =
  require("express");

const router =
  express.Router();

const {
  addToCart,
  getCart,
  updateQty,
  removeItem,
  clearCart,
} = require(
  "../controllers/cartController"
);

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

/* =========================
   CART ROUTES
========================= */

/* Add Item */
router.post(
  "/add",
  protect,
  addToCart
);

/* Get User Cart */
router.get(
  "/:userId",
  protect,
  getCart
);

/* Update Qty */
router.put(
  "/update",
  protect,
  updateQty
);

/* Remove Item */
router.delete(
  "/remove",
  protect,
  removeItem
);

/* Clear Cart */
router.delete(
  "/clear",
  protect,
  clearCart
);

module.exports =
  router;