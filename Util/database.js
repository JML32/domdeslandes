const { Sequelize, DataTypes } = require("sequelize");
const UserModel = require("../models/user");
const PaintModel = require("../models/paint");
const CategoryModel = require("../models/category");

const sequelize = new Sequelize("dompaints", "root", "", {
  dialect: "mysql",
  host: "localhost",
  port: 3306,
});

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
