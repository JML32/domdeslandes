module.exports = (sequelize, DataTypes) => {
  return sequelize.define("orderItem", {
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
