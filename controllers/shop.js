const fs = require("fs");
const path = require("path");
const order = require("../models/order");
require("dotenv").config();
const { createInvoice } = require("../Util/createinvoice");
const stripe = require("stripe")(process.env.STRIPE_KEY);

const {
  Paint,
  Category,
  Cart,
  CartItem,
  User,
  Order,
  OrderItem,
} = require("../Util/database");

const ITEMS_PER_PAGE = 2;

// Paint controller
exports.getPaints = (req, res, next) => {
  Paint.findAll({ include: ["category"] })
    .then((paints) => {
      console.log("paints", paints);
    })
    .then((paints) => {
      res.render("shop/paint-list", {
        prods: paints,
        pageTitle: "All Paints",
        path: "/paints",
      });
    })

    .catch((err) => {
      console.log(err);
    });
};

exports.getPaint = (req, res, next) => {
  const prodId = req.params.paintId;
  // Product.findAll({ where: { id: prodId } })
  //   .then(products => {
  //     res.render('shop/product-detail', {
  //       product: products[0],
  //       pageTitle: products[0].title,
  //       path: '/products'
  //     });
  //   })
  //   .catch(err => console.log(err));
  Paint.findByPk(prodId, { include: ["category"] })
    .then((paint) => {
      res.render("shop/paint-detail", {
        paint: paint,
        pageTitle: paint.title,
        path: "/paints",
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;
  Paint.count()
    .then((count) => {
      totalItems = count;
      return Paint.findAll({
        offset: (page - 1) * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE,
      }).then((paints) => {
        res.render("shop/paint-list", {
          prods: paints,
          pageTitle: "Shop",
          path: "/",
          currentPage: page,
          hasNextPage: ITEMS_PER_PAGE * page < totalItems,
          hasPreviousPage: page > 1,
          nextPage: page + 1,
          previousPage: page - 1,
          lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// CART controller
exports.getCart = (req, res, next) => {
  User.findOne({ where: { id: req.session.user.id } }).then((user) => {
    user
      .getCart()
      .then((cart) => {
        return cart
          .getPaints()
          .then((paints) => {
            res.render("shop/cart", {
              path: "/cart",
              pageTitle: "Your Cart",
              paints: paints,
            });
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  });
};

exports.postCart = (req, res, next) => {
  const paintId = req.body.paintId;

  let fetchedCart;
  let newQuantity = 1;

  User.findOne({ where: { id: req.session.user.id } }).then((user) => {
    user
      .getCart()
      .then((cart) => {
        fetchedCart = cart;
        return cart.getPaints({ where: { id: paintId } });
      })
      .then((paints) => {
        let paint;
        if (paints.length > 0) {
          paint = paints[0];
        }
        if (paint) {
          const oldQuantity = paint.cartItem.quantity;
          newQuantity = oldQuantity + 1;
          return paint;
        }
        return Paint.findByPk(paintId);
      })
      .then((paint) => {
        return fetchedCart.addPaint(paint, {
          through: { quantity: newQuantity },
        });
      })
      .then(() => {
        res.redirect("/cart");
      })
      .catch((err) => console.log(err));
  });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const paintId = req.body.paintId;
  User.findOne({ where: { id: req.session.user.id } }).then((user) => {
    user
      .getCart()
      .then((cart) => {
        return cart.getPaints({ where: { id: paintId } });
      })
      .then((paints) => {
        const paint = paints[0];
        return paint.cartItem.destroy();
      })
      .then((result) => {
        res.redirect("/cart");
      })
      .catch((err) => console.log(err));
  });
};

// Order controller
exports.getOrders = (req, res, next) => {
  User.findOne({ where: { id: req.session.user.id } }).then((user) => {
    user
      .getOrders({ include: ["paints"] })
      .then((orders) => {
        res.render("shop/orders", {
          path: "/orders",
          pageTitle: "Your Orders",
          orders: orders,
        });
      })
      .catch((err) => console.log(err));
  });
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  User.findOne({ where: { id: req.session.user.id } }).then((user) => {
    user
      .getCart()
      .then((cart) => {
        fetchedCart = cart;
        return cart.getPaints();
      })
      .then((paints) => {
        User.findOne({ where: { id: req.session.user.id } })
          .then((user) => {
            return user
              .createOrder()
              .then((order) => {
                return order.addPaints(
                  paints.map((paint) => {
                    paint.orderItem = { quantity: paint.cartItem.quantity };
                    return paint;
                  })
                );
              })
              .catch((err) => console.log(err));
          })
          .then((result) => {
            return fetchedCart.setPaints(null);
          })
          .then((result) => {
            res.redirect("/orders");
          })
          .catch((err) => console.log(err));
      });
  });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;

  User.findOne({ where: { id: req.session.user.id } }).then((user) => {
    const userInfos = user;
    user
      .getOrders({ where: { id: orderId }, include: ["paints"] })
      .then((order) => {
        if (!order) {
          return next(new Error("No order found."));
        }
        const invoiceName = "invoice-" + orderId + ".pdf";
        const invoicePath = path.join("public", "invoices", invoiceName);

        const paintsOrdersArray = order.map((item) => ({
          id: item.id,
          paints: item.paints,
        }));
        let paintsOrderArray = [];
        for (let i = 0; i < paintsOrdersArray.length; i++) {
          if (paintsOrdersArray[i].id == orderId) {
            paintsOrderArray.push(paintsOrdersArray[i].paints);
            paintsOrderArray.push(paintsOrdersArray[i].paints.orderItem);
          }
        }

        invoice = {
          shipping: {
            name: userInfos.name,
            address: userInfos.address,
            city: userInfos.city,
            state: userInfos.state,
            country: userInfos.country,
            postal_code: userInfos.postalCode,
          },
          items: paintsOrderArray,
          paid: 0,
          invoice_nr: orderId,
        };

        createInvoice(invoice, invoicePath);
      })
      .then((result) => {
        res.redirect("/");
      });
  });
};

// Stripe payment controller
exports.getCheckout = (req, res, next) => {
  let products;
  let total = 0;

  const orderId = req.params.orderId;

  User.findOne({ where: { id: req.session.user.id } }).then((user) => {
    user
      .getOrders({ include: ["paints"] })
      .then((order) => {
        const paintsOrdersArray = order.map((item) => ({
          id: item.id,
          paints: item.paints,
        }));

        let paintsOrderArray = [];
        for (let i = 0; i < paintsOrdersArray.length; i++) {
          if (paintsOrdersArray[i].id == orderId) {
            paintsOrderArray.push(paintsOrdersArray[i].paints);
            paintsOrderArray.push(paintsOrdersArray[i].paints.orderItem);
          }
        }

        products = paintsOrderArray[0];

        total = 0;
        // products.forEach((product) => {
        //   total += product.orderItem.quantity * product.price;
        // });

        //res.json(products);
        return stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: products.map((p) => {
            return {
              name: p.title,
              description: p.description,
              amount: p.price * 100,
              currency: "eur",
              quantity: p.orderItem.quantity,
            };
          }),
          success_url:
            req.protocol + "://" + req.get("host") + "/checkout/success", // => http://localhost:3000
          cancel_url:
            req.protocol + "://" + req.get("host") + "/checkout/cancel",
        });
      })
      .then((session) => {
        res.render("shop/checkout", {
          path: "/checkout",
          pageTitle: "Checkout",
          products: products,
          //totalSum: total,
          totalSum: total,
          sessionId: session.id,
        });
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  });
};

exports.getCheckoutSuccess = (req, res, next) => {
  return res.redirect("/");
  // return res.redirect("/").catch((err) => {
  //   const error = new Error(err);
  //   error.httpStatusCode = 500;
  //   return next(error);
  // });
  // const order = new Order({
  //   user: {
  //     email: req.session.user.email,
  //     userId: req.session.user,
  //   },
  //   products: products,
  // });
  // return (
  //   order
  //     .save()
  //     //})
  //     .then((result) => {
  //       return req.user.clearCart();
  //     })
  //     .then(() => {
  //       res.redirect("/orders");
  //     })
  //     .catch((err) => {
  //       const error = new Error(err);
  //       error.httpStatusCode = 500;
  //       return next(error);
  //     })
  // );
};
