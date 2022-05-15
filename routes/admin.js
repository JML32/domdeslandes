const path = require("path");
const express = require("express");

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");
const router = express.Router();

// ADMIN PAINTS
// /admin/add-product => GET
router.get("/add-paint", isAuth, adminController.getAddPaint);
// /admin/products => GET
router.get("/paints", isAuth, adminController.getPaints);
// /admin/add-product => POST
router.post(
  "/add-paint",
  isAuth,
  adminController.uploadPaintPhoto,
  adminController.postAddPaint
);

// router.post(
//   "/add-paint",
//   adminController.uploadPaintPhoto,
//   adminController.resizePaintPhoto,
//   adminController.postAddPaint
// );
router.get("/edit-paint/:paintId", isAuth, adminController.getEditPaint);
router.post("/edit-paint", isAuth, adminController.postEditPaint);
router.post("/delete-paint", isAuth, adminController.postDeletePaint);

// ADMIN CATEGORIES
router.get("/categories", isAuth, adminController.getCategories);
router.get("/add-category", isAuth, adminController.getAddCategory);
// /admin/add-product => POST
router.post("/add-category", isAuth, adminController.postAddCategory);

module.exports = router;
