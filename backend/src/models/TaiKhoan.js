const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const TaiKhoan = sequelize.define(
  "TaiKhoan",
  {
    MaTaiKhoan: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    Username: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    Password: { type: DataTypes.STRING(255), allowNull: false }, // bcrypt hash
    VaiTro: { type: DataTypes.STRING(20), allowNull: false },     // admin | ban_quan_ly | cu_dan
    TrangThai: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    LanDangNhapCuoi: { type: DataTypes.DATE, allowNull: true },
    CreatedAt: { type: DataTypes.DATE, allowNull: true },
  },
  {
    tableName: "TaiKhoan",
    timestamps: false, // bảng bạn không có updatedAt
  }
);

module.exports = TaiKhoan;
