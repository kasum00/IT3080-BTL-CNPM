const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const TamVang = sequelize.define(
  "TamVang",
  {
    MaTamVang: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    CanCuocCongDan: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    NgayBatDau: {
      type: DataTypes.DATE,
    },
    NgayKetThuc: {
      type: DataTypes.DATE,
    },
    LyDo: {
      type: DataTypes.STRING(200),
    },
  },
  {
    tableName: "TamVang",
    timestamps: false,
  }
);

// create
const createTamVang = async (req, res) => {
  try {
    const{CanCuocCongDan, NgayBatDau, NgayKetThuc, LyDo } = req.body;

    if (!CanCuocCongDan|| !NgayBatDau || !NgayKetThuc) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
    }

    const tamVang = await TamVang.create({
      CanCuocCongDan,
      NgayBatDau,
      NgayKetThuc,
      LyDo,
    });

    res.status(201).json(tamVang);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// get all
const getAllTamVang = async (req, res) => {
  try {
    const [rows] = await sequelize.query(`
      SELECT
        tv.MaTamVang,
        nk.HoTen,
        nk.CanCuocCongDan AS CCCD,
        tv.NgayBatDau,
        tv.NgayKetThuc,
        tv.LyDo
      FROM TamVang tv
      JOIN NhanKhau nk ON tv.CanCuocCongDan = nk.CanCuocCongDan
    `);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

// get by id
const getTamVangByID = async (req, res) => {
  try {
    const [rows] = await sequelize.query(
      `
      SELECT 
        tv.MaTamVang,
        nk.HoTen,
        tv.CanCuocCongDan AS CCCD,
        tv.NgayBatDau,
        tv.NgayKetThuc,
        tv.LyDo
      FROM TamVang tv
      JOIN NhanKhau nk ON tv.CanCuocCongDan = nk.CanCuocCongDan
      WHERE tv.MaTamVang = :id
    `,
      {
        replacements: { id: req.params.id },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!rows) {
      return res.status(404).json({ message: "Không tìm thấy tạm vắng!" });
    }
    // rows lúc này là 1 object (vì dùng QueryTypes.SELECT)
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// update
const updateTamVang = async (req, res) => {
  try {
    const tamVang = await TamVang.findByPk(req.params.id);
    if (!tamVang) {
      return res.status(404).json({
        message: "Không tìm thấy tạm vắng!",
      });
    }

    await tamVang.update(req.body);
    res.json({
      message: "Cập nhật tạm vắng thành công!",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// delete
const deleteTamVang = async (req, res) => {
  try {
    const tamVang = await TamVang.findByPk(req.params.id);
    if (!tamVang) {
      return res.status(404).json({
        message: "Không tìm thấy tạm vắng!",
      });
    }

    await tamVang.destroy();
    res.json({
      message: "Xóa tạm vắng thành công!",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  TamVang,
  createTamVang,
  getAllTamVang,
  getTamVangByID,
  updateTamVang,
  deleteTamVang,
};
