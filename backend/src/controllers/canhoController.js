const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const CanHo = sequelize.define(
  "CanHo",
  {
    MaCanHo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    MaHoKhau: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    TenCanHo: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    Tang: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    DienTich: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    TrangThai: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "trong",
    },
    MoTa: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    tableName: "CanHo",
    timestamps: false,
  }
);
const HoKhau = sequelize.define(
  "HoKhau",
  {
    MaHoKhau: {
      type: DataTypes.STRING(10),
      primaryKey: true,
      allowNull: false,
    },
    MaCanHo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
    },
    DiaChiThuongTru: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    NoiCap: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    NgayCap: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    tableName: "HoKhau",
    timestamps: false,
  }
);

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
    },
    HoTen: {
      type: DataTypes.STRING(100),
    },
    QuanHe: {
      type: DataTypes.STRING(30),
    },
  },
  {
    tableName: "NhanKhau",
    timestamps: false,
  }
);

// Tìm hộ khẩu đang ở căn hộ (nếu không trống)
const findHouseholdInAparment = async (req, res) => {
  try {
    const data = await CanHo.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({
        message: "Không tìm thấy căn hộ!",
      });
    }

    // nếu trống thì ??  - temporary
    if (data.TrangThai === "trong") {
      return res.status(200).json({
        message: "Căn hộ đang trống, không có gia đình nào đang sống ",
        canHo: data,
        hoKhau: null,
      });
    }

    const hoKhau = await HoKhau.findOne({
      where: { MaCanHo: req.params.id },
    });

    if (!hoKhau) {
      return res.status(404).json({
        message: "Không tìm thấy hộ khẩu cho căn hộ này",
        canHo: data,
      });
    }

    res.status(200).json({
      message: "Tìm thấy hộ khẩu thành công",
      canHo: data,
      hoKhau: hoKhau,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
      message: "Lỗi khi tìm hộ khẩu",
    });
  }
};

// Tìm chủ hộ từ căn hộ
const findOwnerByApartment = async (req, res) => {
  try {
    const canHo = await CanHo.findByPk(req.params.id);

    if (!canHo) {
      return res.status(404).json({
        message: "Không tìm thấy căn hộ!",
      });
    }

    if (canHo.TrangThai === "trong") {
      return res.status(200).json({
        message: "Căn hộ đang trống, không có chủ hộ",
        canHo: canHo,
        chuHo: null,
      });
    }

    const hoKhau = await HoKhau.findOne({
      where: { MaCanHo: req.params.id },
    });

    if (!hoKhau) {
      return res.status(404).json({
        message: "Không tìm thấy hộ khẩu cho căn hộ này",
        canHo: canHo,
      });
    }

    const chuHo = await NhanKhau.findOne({
      where: {
        MaHoKhau: hoKhau.MaHoKhau,
        QuanHe: "chu ho",
      },
    });

    if (!chuHo) {
      return res.status(404).json({
        message: "Không tìm thấy chủ hộ cho căn hộ này",
        canHo: canHo,
        hoKhau: hoKhau,
      });
    }

    res.status(200).json({
      message: "Tìm thấy chủ hộ thành công",
      canHo: canHo,
      hoKhau: hoKhau,
      chuHo: chuHo,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
      message: "Lỗi khi tìm chủ hộ",
    });
  }
};

// CREATE
const createCanHo = async (req, res) => {
  try {
    const data = await CanHo.create(req.body);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL
const getAllCanHo = async (req, res) => {
  try {
    const data = await CanHo.findAll({
      order: [["MaCanHo", "ASC"]],
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET BY ID
const getCanHoByID = async (req, res) => {
  try {
    const data = await CanHo.findByPk(req.params.id);
    if (!data) {
      return res.status(404).json({
        message: "Không tìm thấy căn hộ!",
      });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
const updateCanHo = async (req, res) => {
  try {
    const data = await CanHo.findByPk(req.params.id);
    if (!data) {
      return res.status(404).json({
        message: "Không tìm thấy căn hộ!",
      });
    }

    await data.update(req.body);
    res.json({
      message: "Cập nhật căn hộ thành công!",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  CanHo,
  createCanHo,
  getAllCanHo,
  getCanHoByID,
  updateCanHo,
  findHouseholdInAparment,
  findOwnerByApartment,
};
