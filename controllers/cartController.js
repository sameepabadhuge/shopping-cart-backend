const Cart = require("../models/Cart");

// Add To Cart
exports.addToCart = async (req, res) => {
  try {
    const { userId, product } = req.body;

    if (!userId || !product) {
      return res.status(400).json({
        message: "Missing userId or product",
      });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) =>
        item.productId &&
        item.productId.toString() ===
          product.productId
    );

    if (existingItem) {
      existingItem.qty += product.qty;
    } else {
      cart.items.push(product);
    }

    await cart.save();

    res.json({
      message: "Added to cart",
      cart,
    });

  } catch (error) {
    console.log("ADD CART ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// Get Cart
exports.getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart =
      await Cart.findOne({ userId });

    res.json(cart || { items: [] });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// Update Qty
exports.updateQty = async (req, res) => {
  try {
    const {
      userId,
      productId,
      qty,
    } = req.body;

    const cart =
      await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) =>
        item.productId &&
        item.productId.toString() ===
          productId
    );

    if (item) {
      item.qty = qty;
    }

    await cart.save();

    res.json(cart);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// Remove Item
exports.removeItem = async (req, res) => {
  try {
    const {
      userId,
      productId,
    } = req.body;

    const cart =
      await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) =>
        item.productId &&
        item.productId.toString() !==
          productId
    );

    await cart.save();

    res.json(cart);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// Clear Cart
exports.clearCart = async (req, res) => {
  try {
    const { userId } = req.body;

    await Cart.findOneAndUpdate(
      { userId },
      { items: [] }
    );

    res.json({
      message: "Cart cleared",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};