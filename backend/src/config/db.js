const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("bluemoon", "root", "", {
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
