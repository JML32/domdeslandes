module.exports = (sequelize, DataTypes) => {
  return sequelize.define("user", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: "Le nom est déjà pris.",
      },
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "user",
    },

    password: {
      type: DataTypes.STRING,
    },
  });
};
