const fs = require("fs");
const path = require("path");
const order = require("../models/order");
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
      user.getOrders({ include: Paint }).then((order) => {
        const paintsOrdersArray = order.map((item) => ({
          id: item.id,
          paints: item.paints,
        }));
        let paintsOrderArray = [];
        for (let i = 0; i < paintsOrdersArray.length; i++) {
          if (paintsOrdersArray[i].id == 10) {
            paintsOrderArray.push(paintsOrdersArray[i].paints);
            paintsOrderArray.push(paintsOrdersArray[i].paints.orderItem);
          }
        }
        res.json(paintsOrderArray);

        for (i = 0; i < paintsOrderArray.length; i++) {
          for (j = 0; j < paintsOrderArray[i].length; j++) {
            let paintTitle = paintsOrderArray[i][j].title;
            let paintQty = paintsOrderArray[i][j].orderItem.quantity;
            console.log(paintTitle);
            console.log(paintQty);
          }
        }
      });
    })
    .catch((err) => console.log(err));
};
