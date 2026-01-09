require("dotenv").config();

console.log({
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_HOST: process.env.DB_HOST,
  DB_PASS_len: (process.env.DB_PASS || "").length,
});

const bcrypt = require("bcryptjs");
const sequelize = require("../src/config/db");
const TaiKhoan = require("../src/models/TaiKhoan");

(async () => {
  try {
    await sequelize.authenticate();

    const username = "test@gmail.com"; // hoặc "admin"
    const plain = "123456";
    const hash = await bcrypt.hash(plain, 10);

    const found = await TaiKhoan.findOne({ where: { Username: username } });

    if (!found) {
      await TaiKhoan.create({
        Username: username,
        Password: hash,
        VaiTro: "ban_quan_ly", // hoặc "admin"
        TrangThai: 1,
        LanDangNhapCuoi: null,
        CreatedAt: new Date(),
      });
      console.log("Created account:", username, "pass:", plain);
    } else {
      await TaiKhoan.update({ Password: hash }, { where: { Username: username } });
      console.log("Updated password for:", username, "pass:", plain);
    }

    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
