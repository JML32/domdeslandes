const { Paint, Category } = require("../Util/database");

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
  Paint.findAll({ include: ["category"] })
    .then((paints) => {
      res.render("shop/paint-list", {
        prods: paints,
        pageTitle: "Shop",
        path: "/",
        isAuthenticated: req.session.isLoggedIn,
        //isAuthenticated: false, // to be changed !
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
