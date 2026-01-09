const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const NhanKhau = sequelize.define(
  "NhanKhau",
  {
    MaNhanKhau: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    MaHoKhau: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    HoTen: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    CanCuocCongDan: {
      type: DataTypes.STRING(12),
      allowNull: false,
      unique: true,
    },
    NgaySinh: DataTypes.DATE,
    NoiSinh: DataTypes.STRING(100),
    DanToc: DataTypes.STRING(20),
    NgheNghiep: DataTypes.STRING(50),
    QuanHe: {
      type: DataTypes.ENUM("chu ho", "vo", "con", "nguoi thue"),
      allowNull: false,
    },
    GhiChu: DataTypes.STRING(200),
    TrangThai: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  },
  {
    tableName: "NhanKhau",
    timestamps: false,
  }
);
//create
const createNhanKhau = async (req, res) => {
  try {
    const data = await NhanKhau.create(req.body);
    res.json(data);
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        message: "CCCD đã tồn tại, vui lòng nhập CCCD khác!",
      });
    }

    res.status(500).json({ err: err.message });
  }
};
// get all
const getAllNhanKhau = async (req, res) => {
  try {
    const data = await NhanKhau.findAll({
      order: [
        ["MaHoKhau", "ASC"],
        ["QuanHe", "ASC"], // chủ hộ
      ],
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

//get by id
const getNhanKhauByID = async (req, res) => {
  try {
    const data = await NhanKhau.findByPk(req.params.id);
    if (!data) {
      return res.status(404).json({
        message: "Không tìm thấy nhân khẩu!",
      });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//update
const updateNhanKhau = async (req, res) => {
  try {
    const nhanKhau = await NhanKhau.findByPk(req.params.id);
    if (!nhanKhau) {
      return res.status(404).json({
        message: "Không tìm thấy nhân khẩu!",
      });
    }
    await nhanKhau.update(req.body);
    res.json({
      message: "Cập nhật nhân khẩu thành công!",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//delete
const deleteNhanKhau = async (req, res) => {
  try {
    const nhanKhau = await NhanKhau.findByPk(req.params.id);
    if (!nhanKhau) {
      return res.status(404).json({
        message: "Không tìm thấy nhân khẩu!",
      });
    }

    await nhanKhau.destroy();
    res.json({
      message: "Xóa nhân khẩu thành công!",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
//lấy tổng
const getTotalNhanKhau = async (req, res) => {
  try {
    const total = await NhanKhau.count();
    res.json({
      success: true,
      total: total,
    });
  } catch (error) {
    console.error("Lỗi lấy tổng nhân khẩu:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
    });
  }
};

module.exports = {
  NhanKhau,
  createNhanKhau,
  getAllNhanKhau,
  getNhanKhauByID,
  updateNhanKhau,
  deleteNhanKhau,
  getTotalNhanKhau,
};
