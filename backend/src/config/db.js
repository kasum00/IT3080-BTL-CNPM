const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("bluemoon2", "root", "123456", {
  // ("database_name", "root", "password")
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

sequelize
  .authenticate()
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Unable to connect to database:", err));

module.exports = sequelize;
