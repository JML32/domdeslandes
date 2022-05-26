const { Sequelize, DataTypes } = require("sequelize");
const UserModel = require("../models/user");
const PaintModel = require("../models/paint");
const CartModel = require("../models/cart");
const CartItemModel = require("../models/cart-item");
const OrderModel = require("../models/order");
const OrderItemModel = require("../models/order-item");
const CategoryModel = require("../models/category");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    timezone: "+02:00",
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
  }
);

const User = UserModel(sequelize, DataTypes);
const Paint = PaintModel(sequelize, DataTypes);
const Cart = CartModel(sequelize, DataTypes);
const CartItem = CartItemModel(sequelize, DataTypes);
const Order = OrderModel(sequelize, DataTypes);
const OrderItem = OrderItemModel(sequelize, DataTypes);
const Category = CategoryModel(sequelize, DataTypes);

Category.hasMany(Paint);
Paint.belongsTo(Category);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Paint, { through: CartItem });
Paint.belongsToMany(Cart, { through: CartItem });
User.hasMany(Order);
Order.belongsTo(User);
Order.belongsToMany(Paint, { through: OrderItem });
Paint.belongsToMany(Order, { through: OrderItem });

const initDb = () => {
  return sequelize.sync({ alter: true }).then((_) => {
    console.log("La base de donnée a bien été initialisée !");
  });
};

module.exports = { sequelize, initDb, User, Paint, Category, Cart, CartItem };
