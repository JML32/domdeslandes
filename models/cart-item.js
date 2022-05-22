module.exports = (sequelize, DataTypes) => {
  return sequelize.define("cartItem", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
    },
  });
};
