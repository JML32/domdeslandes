const { Sequelize, DataTypes } = require("sequelize");
const UserModel = require("../models/user");
const PaintModel = require("../models/paint");
const CategoryModel = require("../models/category");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
  }
);

const User = UserModel(sequelize, DataTypes);
const Paint = PaintModel(sequelize, DataTypes);
const Category = CategoryModel(sequelize, DataTypes);
Category.hasMany(Paint);
Paint.belongsTo(Category);

const initDb = () => {
  return sequelize.sync().then((_) => {
    console.log("La base de donnée a bien été initialisée !");
  });
};

module.exports = { sequelize, initDb, User, Paint, Category };
