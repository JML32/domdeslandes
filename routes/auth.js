const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();
const { check, body } = require("express-validator/check");

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post("/login", authController.postLogin);

router.post(
  "/signup",
  [
    check("email").isEmail().withMessage("Please enter a valid email"),
    body(
      "password",
      "please enter a valid password with only numbers and characters at least 5 characters and 40 max."
    )
      .isLength({ min: 5, max: 40 })
      .isAlphanumeric(),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new error("passwords have to match");
      }
      return true;
    }),
  ],
  authController.postSignup
);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
