const fs = require("fs");
const path = require("path");
const { createInvoice } = require("../Util/createinvoice");

const {
  Paint,
  Category,
  Cart,
  CartItem,
  User,
  Order,
  OrderItem,
} = require("../Util/database");

// exports.getQuery = (req, res, next) => {
//   User.findAll({ order: [["createdAt", "DESC"]], include: Cart })
//     .then((result) => {
//       res.json(result);
//       result.map((item) => {
//         console.log(item.id);
//         console.log(item.email);
//         console.log(item.cart.id);
//         console.log(item.cart.userId);
//       });

//       //res.redirect("/");
//       // res.render("query/list", {
//       //   prods: paints,
//       //   pageTitle: "query",
//       //   path: "/query",
//       // });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

// exports.getQuery = (req, res, next) => {
//   User.findOne({ where: { id: 1 } })
//     .then((user) => {
//       user.getOrders({ include: Paint }).then((orders) => {
//         res.json(orders);
//       });
//     })
//     .catch((err) => console.log(err));
// };

exports.getQuery = (req, res, next) => {
  User.findOne({ where: { id: 2 } })
    .then((user) => {
      user.getOrders({ include: Paint }).then((orders) => {
        res.json(orders);
        const paintsArray = orders.map((item) => ({
          id: item.id,
          paints: item.paints,
        }));
        console.log("paintsTitle : ", paintsArray);
      });
    })
    .catch((err) => console.log(err));
};
