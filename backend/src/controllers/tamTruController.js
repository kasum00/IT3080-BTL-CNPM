const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

/* ===============================
   MODEL (GIỮ NGUYÊN)
================================ */
const TamTru = sequelize.define(
  "TamTru",
  {
    MaTamTru: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    MaNhanKhau: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    DiaChiThuongTru: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    DiaChiTamTru: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    CanCuocCongDan: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    NgayBatDau: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    NgayKetThuc: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    tableName: "TamTru",
    timestamps: false,
  }
);

/* ===============================
   CREATE
================================ */
const createTamTru = async (req, res) => {
  try {
    const data = await TamTru.create(req.body);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ===============================
   GET ALL (JOIN NhanKhau → CÓ HỌ TÊN)
================================ */
const getAllTamTru = async (req, res) => {
  try {
    const [data] = await sequelize.query(`
      SELECT 
        tt.MaTamTru,
        tt.MaNhanKhau,
        nk.HoTen,
        tt.DiaChiThuongTru,
        tt.DiaChiTamTru,
        tt.CanCuocCongDan,
        tt.NgayBatDau,
        tt.NgayKetThuc
      FROM TamTru tt
      JOIN NhanKhau nk ON tt.MaNhanKhau = nk.MaNhanKhau
      ORDER BY tt.MaTamTru ASC
    `);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ===============================
   GET BY ID
================================ */
const getTamTruByID = async (req, res) => {
  try {
    const { id } = req.params;

    const [data] = await sequelize.query(
      `
      SELECT 
        tt.MaTamTru,
        tt.MaNhanKhau,
        nk.HoTen,
        tt.DiaChiThuongTru,
        tt.DiaChiTamTru,
        tt.CanCuocCongDan,
        tt.NgayBatDau,
        tt.NgayKetThuc
      FROM TamTru tt
      JOIN NhanKhau nk ON tt.MaNhanKhau = nk.MaNhanKhau
      WHERE tt.MaTamTru = ?
    `,
      { replacements: [id] }
    );

    if (data.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy tạm trú!" });
    }

    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ===============================
   UPDATE
================================ */
const updateTamTru = async (req, res) => {
  try {
    const tamTru = await TamTru.findByPk(req.params.id);
    if (!tamTru) {
      return res.status(404).json({
        message: "Không tìm thấy tạm trú!",
      });
    }

    await tamTru.update(req.body);
    res.json({ message: "Cập nhật tạm trú thành công!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ===============================
   DELETE
================================ */
const deleteTamTru = async (req, res) => {
  try {
    const tamTru = await TamTru.findByPk(req.params.id);
    if (!tamTru) {
      return res.status(404).json({
        message: "Không tìm thấy tạm trú!",
      });
    }

    await tamTru.destroy();
    res.json({ message: "Xóa tạm trú thành công!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  TamTru,
  createTamTru,
  getAllTamTru,
  getTamTruByID,
  updateTamTru,
  deleteTamTru,
};
