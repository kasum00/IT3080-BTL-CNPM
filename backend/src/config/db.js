const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("bluemoon", "root", "123456", {
  // ("database_name", "root", "password")
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

sequelize
  .authenticate()
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Unable to connect to database:", err));

<<<<<<< HEAD
module.exports = sequelize;
=======
module.exports = sequelize;
>>>>>>> main
