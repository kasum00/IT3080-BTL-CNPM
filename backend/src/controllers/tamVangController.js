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
    MaNhanKhau: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ThoiHan: {
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
    const data = await TamVang.create(req.body);
    res.json(data);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

// get all
const getAllTamVang = async (req, res) => {
  try {
    const data = await TamVang.findAll({
      order: [["MaTamVang", "ASC"]],
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

// get by id
const getTamVangByID = async (req, res) => {
  try {
    const data = await TamVang.findByPk(req.params.id);
    if (!data) {
      return res.status(404).json({
        message: "Không tìm thấy tạm vắng!",
      });
    }
    res.json(data);
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
