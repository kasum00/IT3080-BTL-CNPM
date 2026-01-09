const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "bluemoon", // tên database
  "root", // user mysql
  null, // ❌ KHÔNG mật khẩu
  {
    host: "localhost",
    dialect: "mysql",
    logging: false,
  }
);

sequelize
  .authenticate()
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Unable to connect to database:", err));

module.exports = sequelize;
