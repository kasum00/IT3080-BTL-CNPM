const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const KhoanThu = sequelize.define(
  "KhoanThu",
  {
    MaKhoanThu: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "MaKhoanThu",
    },
    TenKhoanThu: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "TenKhoanThu",
    },
    LoaiKhoanThu: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "LoaiKhoanThu",
    },
    ThoiGianBatDau: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "ThoiGianBatDau",
    },
    ThoiGianKetThuc: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "ThoiGianKetThuc",
    },
    DonViTinh: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "DonViTinh",
    },
    DonGia: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "DonGia",
    },
    ChiTiet: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: "ChiTiet",
    },
    GhiChu: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: "GhiChu",
    },
  },
  {
    tableName: "KhoanThu",
    timestamps: false,
  }
);

// Get all
const getAllKhoanThu = async (req, res) => {
  try {
    const data = await KhoanThu.findAll();
    console.log(`Found ${data.length} khoan thu`); // debug
    res.json({
      success: true,
      data: data,
      total: data.length,
    });
  } catch (error) {
    console.error("Error getting all KhoanThu:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Create
const createKhoanThu = async (req, res) => {
  try {
    console.log("Request body:", req.body); // debug

    const data = await KhoanThu.create(req.body);

    console.log("Created data:", data.toJSON());
    console.log("MaKhoanThu:", data.MaKhoanThu);

    res.json({
      success: true,
      message: "Thêm khoản thu thành công",
      data: data,
    });
  } catch (error) {
    console.error("Error creating KhoanThu:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.stack,
    });
  }
};

// Get by ID
const getKhoanThu = async (req, res) => {
  try {
    console.log("ID:", req.params.id); // debug

    const data = await KhoanThu.findByPk(req.params.id);
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy khoản thu",
      });
    }
    res.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("Error getting KhoanThu:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Update
const updateKhoanThu = async (req, res) => {
  try {
    //debug
    console.log("update");
    console.log("ID:", req.params.id);
    console.log("Request body:", req.body);

    const [rowsUpdated] = await KhoanThu.update(req.body, {
      where: {
        MaKhoanThu: req.params.id,
      },
    });

    console.log("Rows updated:", rowsUpdated);

    res.json({
      success: true,
      message: "Cập nhật thành công",
      rowsUpdated,
    });
  } catch (error) {
    console.error("Error updating KhoanThu:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete
const deleteKhoanThu = async (req, res) => {
  try {
    // debug
    console.log("delete");
    console.log("ID:", req.params.id);

    const { id } = req.params;

    const khoanThu = await KhoanThu.findByPk(id);
    if (!khoanThu) {
      return res.status(404).json({
        success: false,
        error: "Không tìm thấy khoản thu",
      });
    }

    const [result] = await sequelize.query(
      `SELECT COUNT(*) as total FROM KhoanThuTheoHo WHERE MaKhoanThu = :id`,
      {
        replacements: { id },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const totalHoKhau = result.total;

    // Xóa khoản thu (CASCADE sẽ tự động xóa KhoanThuTheoHo và HoaDon)
    await KhoanThu.destroy({ where: { MaKhoanThu: id } });

    res.json({
      success: true,
      message: "Xóa khoản thu thành công",
      info: {
        ma_khoan_thu: khoanThu.MaKhoanThu,
        ten_khoan_thu: khoanThu.TenKhoanThu,
        so_ho_khau_bi_anh_huong: totalHoKhau,
        luu_y: "Đã xóa tất cả khoản thu hộ khẩu và hóa đơn liên quan",
      },
    });
  } catch (error) {
    console.error("Error deleting KhoanThu:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  getAllKhoanThu,
  createKhoanThu,
  getKhoanThu,
  updateKhoanThu,
  deleteKhoanThu,
  KhoanThu,
};
