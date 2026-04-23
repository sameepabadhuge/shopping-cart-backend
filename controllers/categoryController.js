const Category = require(
  "../models/Category"
);

const Product = require(
  "../models/Product"
);

// Get All Categories + Product Count
exports.getCategories =
  async (req, res) => {
    try {
      const categories =
        await Category.find().sort({
          createdAt: -1,
        });

      const data =
        await Promise.all(
          categories.map(
            async (item) => {
              const count =
                await Product.countDocuments(
                  {
                    category:
                      item.name,
                  }
                );

              return {
                ...item._doc,
                productCount:
                  count,
              };
            }
          )
        );

      res.json(data);
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// Create Category
exports.createCategory =
  async (req, res) => {
    try {
      const category =
        await Category.create(
          {
            name: req.body.name,
            image:
              req.file
                ? req.file
                    .filename
                : "",
          }
        );

      res.status(201).json(
        category
      );
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// Update Category
exports.updateCategory =
  async (req, res) => {
    try {
      const data = {
        name: req.body.name,
      };

      if (req.file) {
        data.image =
          req.file.filename;
      }

      const updated =
        await Category.findByIdAndUpdate(
          req.params.id,
          data,
          { new: true }
        );

      res.json(updated);
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// Delete Category
exports.deleteCategory =
  async (req, res) => {
    try {
      await Category.findByIdAndDelete(
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