const express = require("express");
const router = express.Router();

const {
  addToCart,
  getCart,
  updateQty,
  removeItem,
  clearCart,
} = require("../controllers/cartController");

router.post("/add", addToCart);

router.get("/:userId", getCart);

router.put("/update", updateQty);

router.delete("/remove", removeItem);

router.delete("/clear", clearCart);

module.exports = router;