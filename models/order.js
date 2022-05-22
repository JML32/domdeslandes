module.exports = (sequelize, DataTypes) => {
  return sequelize.define("order", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
  });
};
