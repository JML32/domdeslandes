const multer = require("multer");
const sharp = require("sharp");
const { Paint, Category } = require("../Util/database");

// photos
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `${file.originalname}-${Date.now()}.${ext}`);
  },
});

//const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(console.log("error"), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadPaintPhoto = upload.single("imageUrl");

// exports.resizePaintPhoto = (req, res, next) => {
//   if (!req.file) return next();

//   req.file.filename = `${Date.now()}.webp`;

//   sharp(req.file.buffer)
//     .resize(500, 500)
//     .toFormat("webp")
//     .toFile(`public/images/${req.file.filename}`);

//   next();
// };

// Paints controller
exports.getAddPaint = (req, res, next) => {
  Category.findAll().then((categories) => {
    res.render("admin/edit-paint", {
      pageTitle: "Add Paint",
      path: "/admin/add-paint",
      editing: false,
      categories: categories,
    });
  });
};

exports.postAddPaint = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = "/images/" + req.file.filename;
  const price = req.body.price;
  const description = req.body.description;
  const category = parseInt(req.body.category);

  Paint.create({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description,
    categoryId: category,
  })
    .then((result) => {
      console.log(result);
      console.log("Created Product");
      res.redirect("/admin/paints");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditPaint = (req, res, next) => {
  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.paintId;
  //req.user
  //.getPaints({ where: { id: prodId } })
  //Paint.findByPk(prodId)
  Paint.findByPk(prodId, {
    include: ["category"],
  })
    .then((paint) => {
      Category.findAll().then((categories) => {
        if (!paint) {
          return res.redirect("/");
        }
        res.render("admin/edit-paint", {
          pageTitle: "Edit Paint",
          path: "/admin/edit-paint",
          editing: editMode,
          paint: paint,
          categories: categories,
        });
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditPaint = (req, res, next) => {
  const prodId = req.body.paintId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  const updatedcategoryId = req.body.category;
  Paint.findByPk(prodId)
    .then((paint) => {
      paint.title = updatedTitle;
      paint.price = updatedPrice;
      paint.description = updatedDesc;
      paint.imageUrl = updatedImageUrl;
      paint.categoryId = updatedcategoryId;
      return paint.save();
    })
    .then((result) => {
      console.log("UPDATED PRODUCT!");
      res.redirect("/admin/paints");
    })
    .catch((err) => console.log(err));
};

exports.getPaints = (req, res, next) => {
  Paint.findAll({ include: ["category"] }).then((paints) => {
    res
      .render("admin/paints", {
        prods: paints,
        pageTitle: "Admin Products",
        path: "/admin/paints",
      })
      .catch((err) => console.log(err));
  });
};

exports.postDeletePaint = (req, res, next) => {
  const prodId = req.body.paintId;
  Paint.findByPk(prodId)
    .then((paint) => {
      return paint.destroy();
    })
    .then((result) => {
      console.log("DESTROYED PRODUCT");
      res.redirect("/admin/paints");
    })
    .catch((err) => console.log(err));
};

// Category controller
exports.getCategories = (req, res, next) => {
  Category.findAll().then((categories) => {
    res
      .render("admin/categories", {
        prods: categories,
        pageTitle: "Admin Categories",
        path: "/admin/categories",
      })
      .catch((err) => console.log(err));
  });
};

exports.getAddCategory = (req, res, next) => {
  res.render("admin/edit-category", {
    pageTitle: "Add Category",
    path: "/admin/add-category",
    editing: false,
  });
};

exports.postAddCategory = (req, res, next) => {
  const title = req.body.title;
  Category.create({
    title: title,
  })
    .then((result) => {
      // console.log(result);
      console.log("Created Category");
      res.redirect("/admin/categories");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditCategory = (req, res, next) => {
  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.categoryId;
  //req.user
  //.getPaints({ where: { id: prodId } })
  //Paint.findByPk(prodId)
  Category.findByPk(prodId)
    .then((category) => {
      res.render("admin/edit-category", {
        pageTitle: "Edit Category",
        path: "/admin/edit-category",
        editing: editMode,
        category: category,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditCategory = (req, res, next) => {
  const prodId = req.body.categoryId;
  const updatedTitle = req.body.title;
  Category.findByPk(prodId)
    .then((category) => {
      category.title = updatedTitle;
      return category.save();
    })
    .then((result) => {
      console.log("UPDATED Category!");
      res.redirect("/admin/categories");
    })
    .catch((err) => console.log(err));
};

exports.postDeleteCategory = (req, res, next) => {
  const prodId = req.body.categoryId;
  Category.findByPk(prodId)
    .then((category) => {
      return category.destroy();
    })
    .then((result) => {
      console.log("DESTROYED Category");
      res.redirect("/admin/categories");
    })
    .catch((err) => console.log(err));
};
