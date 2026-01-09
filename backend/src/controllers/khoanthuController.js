const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const KhoanThu = sequelize.define(
  "KhoanThu",
  {
<<<<<<< HEAD
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    ma_khoan_thu: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    ten_khoan_thu: { type: DataTypes.STRING(100), allowNull: false },
    loai_khoan_thu: {
      type: DataTypes.ENUM("dinh_ky", "mot_lan"),
      allowNull: false,
    },
    chi_tiet: { type: DataTypes.STRING(500), allowNull: true },
    ghi_chu: { type: DataTypes.STRING(200), allowNull: true },
    thoi_gian_bat_dau: { type: DataTypes.DATEONLY, allowNull: true },
    thoi_gian_ket_thuc: { type: DataTypes.DATEONLY, allowNull: true },
  },
  {
    tableName: "khoan_thu",
=======
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
>>>>>>> main
    timestamps: false,
  }
);

<<<<<<< HEAD
// Create
const createKhoanThu = async (req, res) => {
  try {
    const data = await KhoanThu.create(req.body);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read
const getKhoanThu = async (req, res) => {
  try {
    const data = await KhoanThu.findByPk(req.params.id);
    if (!data) {
      return res.status(404).json({ message: "Không tìm thấy khoản thu" });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
=======
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

    // Kiểm tra ngày kết thúc phải lớn hơn ngày bắt đầu
    if (req.body.ThoiGianKetThuc && req.body.ThoiGianBatDau) {
      const startDate = new Date(req.body.ThoiGianBatDau);
      const endDate = new Date(req.body.ThoiGianKetThuc);

      if (endDate <= startDate) {
        return res.status(400).json({
          success: false,
          error: "Ngày kết thúc phải lớn hơn ngày bắt đầu",
        });
      }
    }

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
>>>>>>> main
  }
};

// Update
const updateKhoanThu = async (req, res) => {
  try {
<<<<<<< HEAD
    await KhoanThu.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.json({ message: "Cập nhật thành công" });
  } catch (error) {
    res.status(500).json({ error: error.message });
=======
    //debug
    console.log("update");
    console.log("ID:", req.params.id);
    console.log("Request body:", req.body);

    // Kiểm tra ngày kết thúc phải lớn hơn ngày bắt đầu
    if (req.body.ThoiGianKetThuc && req.body.ThoiGianBatDau) {
      const startDate = new Date(req.body.ThoiGianBatDau);
      const endDate = new Date(req.body.ThoiGianKetThuc);

      if (endDate <= startDate) {
        return res.status(400).json({
          success: false,
          error: "Ngày kết thúc phải lớn hơn ngày bắt đầu",
        });
      }
    }

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
>>>>>>> main
  }
};

// Delete
<<<<<<< HEAD

const deleteKhoanThu = async (req, res) => {
  try {
=======
const deleteKhoanThu = async (req, res) => {
  try {
    // debug
    console.log("delete");
    console.log("ID:", req.params.id);

>>>>>>> main
    const { id } = req.params;

    const khoanThu = await KhoanThu.findByPk(id);
    if (!khoanThu) {
      return res.status(404).json({
<<<<<<< HEAD
=======
        success: false,
>>>>>>> main
        error: "Không tìm thấy khoản thu",
      });
    }

    const [result] = await sequelize.query(
<<<<<<< HEAD
      `SELECT COUNT(*) as total FROM khoan_thu_ho_khau WHERE id_khoan_thu = :id`,
=======
      `SELECT COUNT(*) as total FROM KhoanThuTheoHo WHERE MaKhoanThu = :id`,
>>>>>>> main
      {
        replacements: { id },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const totalHoKhau = result.total;

<<<<<<< HEAD
    // Xóa khoản thu (CASCADE sẽ tự động xóa khoan_thu_ho_khau và hoa_don)
    await KhoanThu.destroy({ where: { id } });

    res.json({
      message: "Xóa khoản thu thành công",
      info: {
        ma_khoan_thu: khoanThu.ma_khoan_thu,
        ten_khoan_thu: khoanThu.ten_khoan_thu,
=======
    // Xóa khoản thu (CASCADE sẽ tự động xóa KhoanThuTheoHo và HoaDon)
    await KhoanThu.destroy({ where: { MaKhoanThu: id } });

    res.json({
      success: true,
      message: "Xóa khoản thu thành công",
      info: {
        ma_khoan_thu: khoanThu.MaKhoanThu,
        ten_khoan_thu: khoanThu.TenKhoanThu,
>>>>>>> main
        so_ho_khau_bi_anh_huong: totalHoKhau,
        luu_y: "Đã xóa tất cả khoản thu hộ khẩu và hóa đơn liên quan",
      },
    });
  } catch (error) {
<<<<<<< HEAD
    res.status(500).json({ error: error.message });
=======
    console.error("Error deleting KhoanThu:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
>>>>>>> main
  }
};

module.exports = {
<<<<<<< HEAD
=======
  getAllKhoanThu,
>>>>>>> main
  createKhoanThu,
  getKhoanThu,
  updateKhoanThu,
  deleteKhoanThu,
  KhoanThu,
<<<<<<< HEAD
};
=======
};
>>>>>>> main
