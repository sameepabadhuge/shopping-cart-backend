const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  addProduct,
  getProducts,
  getSingleProduct,
  deleteProduct,
  updateProduct,
} = require("../controllers/productController");

// Multer Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Routes

// Add Product
router.post("/", upload.single("image"), addProduct);

// Get All Products
router.get("/", getProducts);

// Get Single Product
router.get("/:id", getSingleProduct);

// Delete Product
router.delete("/:id", deleteProduct);

// Update Product
router.put("/:id", upload.single("image"), updateProduct);

module.exports = router;