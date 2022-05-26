const express = require("express");
const shopController = require("../controllers/shop");
const queryController = require("../controllers/query");
const isAuth = require("../middleware/is-auth");
const router = express.Router();

router.get("/", shopController.getIndex);
router.get("/query", queryController.getQuery);
//router.get("/paints", shopController.getPaints);
router.get("/paints/:paintId", shopController.getPaint);
router.get("/cart", isAuth, shopController.getCart);

router.post("/cart", isAuth, shopController.postCart);

router.post("/cart-delete-item", isAuth, shopController.postCartDeleteProduct);

router.get("/checkout", isAuth, shopController.getCheckout);

router.get("/checkout/success", shopController.getCheckoutSuccess);

router.get("/checkout/cancel", shopController.getCheckout);

router.post("/create-order", isAuth, shopController.postOrder);

router.get("/orders", isAuth, shopController.getOrders);

router.get("/orders/:orderId", isAuth, shopController.getInvoice);

module.exports = router;
