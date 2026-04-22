const Product = require("../models/Product");

const getDashboardStats = async (req, res) => {
  try {
    // Get all products
    const products = await Product.find();

    // Total products count
    const totalProducts = products.length;

    // Unique categories count
    const totalCategories = [
      ...new Set(
        products.map(
          (item) => item.category
        )
      ),
    ].length;

    // Total stock
    const totalStock = products.reduce(
      (sum, item) =>
        sum + Number(item.stock),
      0
    );

    // Inventory value
    const inventoryValue =
      products.reduce(
        (sum, item) =>
          sum +
          Number(item.price) *
            Number(item.stock),
        0
      );

    // Recent 5 products
    const recentProducts =
      await Product.find()
        .sort({ createdAt: -1 })
        .limit(5);

    res.status(200).json({
      totalProducts,
      totalCategories,
      totalStock,
      inventoryValue,
      recentProducts,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};