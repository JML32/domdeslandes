const path = require("path");
const express = require("express");
const favicon = require("serve-favicon");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");

const errorController = require("./controllers/error");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const { sequelize, initDb, User, Paint, Category } = require("./util/database");

const port = process.env.PORT || 3000;

// const User = require("./models/user");
// const Cart = require("./models/cart");
// const CartItem = require("./models/cart-item");
// const Order = require("./models/order");
// const OrderItem = require("./models/order-item");

const app = express();
app
  .use(favicon(__dirname + "/favicon.ico"))
  .use(bodyParser.urlencoded({ extended: false }))
  .use(express.static(path.join(__dirname, "public")))
  .use(cors())
  .use(
    session({
      secret: "my secret to be long",
      resave: false,
      saveUnitialized: false,
    })
  );

app.set("view engine", "ejs");
app.set("views", "views");

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);

initDb();

run = async () => {
  // let user1 = await User.create({
  //   name: "toto",
  //   email: "toto@gmail.com",
  // });
  // let category1 = await Category.create({
  //   title: "Les bécasses",
  // });
  // let category2 = await Category.create({
  //   title: "Les chiens",
  // });
  // let paint1 = await Paint.create({
  //   title: "en plein ciel",
  //   price: 120,
  //   imageUrl: "/images/en_plein_ciel.webp",
  //   description:
  //     "Dessin réalisé au pastel sur papier 300g \r\n Dimension de l’œuvre : 26,5 cm * 39 cm \r\n Dimension du papier 29,7 cm * 42 cm \r\n Prix frais de port inclus \r\n Œuvre originale, pas de reproduction possible.",
  // });
  // let paint2 = await Paint.create({
  //   title: "compagnie de face",
  //   price: 120,
  //   imageUrl: "/images/en_plein_ciel.webp",
  //   description:
  //     "Dessin réalisé au pastel sur papier 300g \r\n Dimension de l’œuvre : 26,5 cm * 39 cm \r\n Dimension du papier 29,7 cm * 42 cm \r\n Prix frais de port inclus \r\n Œuvre originale, pas de reproduction possible.",
  // });
  //Paint.findAll({
  //  include: ["category"],
  //}).then((paints) => {
  //  return console.log("All paints >> ", JSON.stringify(paints, null, 2));
  //});
};

run();

app.listen(port, async () => {
  console.log(`Server up on http://localhost: ${port}`);

  console.log("Database Connected!");
});
