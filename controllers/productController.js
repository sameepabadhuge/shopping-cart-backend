const Product =
  require("../models/Product");

/* Add Product */
exports.addProduct =
async (req, res) => {
  try {
    const product =
      await Product.create({
        name: req.body.name,
        category:
          req.body.category,
        price: req.body.price,
        stock: req.body.stock,
        description:
          req.body.description,
        image:
          req.file
            ? req.file.filename
            : "",
      });

    res.status(201).json(
      product
    );

  } catch (error) {
    res.status(500).json({
      message:
        error.message,
    });
  }
};

/* Get Products */
exports.getProducts =
async (req, res) => {
  try {
    const products =
      await Product.find();

    res.json(products);

  } catch (error) {
    res.status(500).json({
      message:
        error.message,
    });
  }
};

/* Delete */
exports.deleteProduct =
async (req, res) => {
  try {
    await Product.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message:
        "Deleted",
    });

  } catch (error) {
    res.status(500).json({
      message:
        error.message,
    });
  }
};

/* Update */
exports.updateProduct =
async (req, res) => {
  try {
    const updateData = {
      ...req.body,
    };

    if (req.file) {
      updateData.image =
        req.file.filename;
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
      message:
        error.message,
    });
  }
};