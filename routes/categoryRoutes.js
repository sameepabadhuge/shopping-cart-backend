const express = require(
  "express"
);

const router =
  express.Router();

const multer = require(
  "multer"
);

const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require(
  "../controllers/categoryController"
);

// Multer Setup
const storage =
  multer.diskStorage({
    destination: function (
      req,
      file,
      cb
    ) {
      cb(
        null,
        "uploads/"
      );
    },

    filename: function (
      req,
      file,
      cb
    ) {
      cb(
        null,
        Date.now() +
          "-" +
          file.originalname
      );
    },
  });

const upload =
  multer({
    storage,
  });

// Routes
router.get(
  "/",
  getCategories
);

router.post(
  "/",
  upload.single(
    "image"
  ),
  createCategory
);

router.put(
  "/:id",
  upload.single(
    "image"
  ),
  updateCategory
);

router.delete(
  "/:id",
  deleteCategory
);

module.exports =
  router;