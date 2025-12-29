const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

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
    },
    DiaChiTamTru: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    CanCuocCongDan: {
      type: DataTypes.STRING(20),
    },
  },
  {
    tableName: "TamTru",
    timestamps: false,
  }
);

// create
const createTamTru = async (req, res) => {
  try {
    const data = await TamTru.create(req.body);
    res.json(data);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

// get all
const getAllTamTru = async (req, res) => {
  try {
    const data = await TamTru.findAll({
      order: [["MaTamTru", "ASC"]],
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

// get by id
const getTamTruByID = async (req, res) => {
  try {
    const data = await TamTru.findByPk(req.params.id);
    if (!data) {
      return res.status(404).json({
        message: "Không tìm thấy tạm trú!",
      });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// update
const updateTamTru = async (req, res) => {
  try {
    const tamTru = await TamTru.findByPk(req.params.id);
    if (!tamTru) {
      return res.status(404).json({
        message: "Không tìm thấy tạm trú!",
      });
    }

    await tamTru.update(req.body);
    res.json({
      message: "Cập nhật tạm trú thành công!",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// delete
const deleteTamTru = async (req, res) => {
  try {
    const tamTru = await TamTru.findByPk(req.params.id);
    if (!tamTru) {
      return res.status(404).json({
        message: "Không tìm thấy tạm trú!",
      });
    }

    await tamTru.destroy();
    res.json({
      message: "Xóa tạm trú thành công!",
    });
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
