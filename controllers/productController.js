const Product =
require("../models/Product");


// Add Product
exports.addProduct = async (req, res) => {
  try {

    const product =
      await Product.create({
        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
        stock: req.body.stock,
        description: req.body.description,
        image: req.file ? req.file.filename : ""
      });

    res.status(201).json(product);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// Get Products
exports.getProducts = async (req, res) => {
  try {

    const products =
      await Product.find().sort({
        createdAt: -1
      });

    res.json(products);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// Delete Product
exports.deleteProduct = async (req, res) => {
  try {

    await Product.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Deleted Successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// Update Product
exports.updateProduct = async (req, res) => {
  try {

    const updateData = {
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      stock: req.body.stock,
      description: req.body.description
    };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    const product =
      await Product.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

    res.json(product);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};