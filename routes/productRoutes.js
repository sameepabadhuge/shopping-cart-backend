const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  addProduct,
  getProducts,
  deleteProduct,
  updateProduct,
} = require("../controllers/productController");

// Storage
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
router.post("/", upload.single("image"), addProduct);

router.get("/", getProducts);

router.delete("/:id", deleteProduct);

router.put("/:id", upload.single("image"), updateProduct);

module.exports = router;