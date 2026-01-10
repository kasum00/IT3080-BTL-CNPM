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
  }
};

// Update
const updateKhoanThu = async (req, res) => {
  try {
    //debug
    console.log("=== UPDATE KHOAN THU ===");
    console.log("ID:", req.params.id);
    console.log("Request body:", JSON.stringify(req.body, null, 2));

    // Kiểm tra xem khoản thu có tồn tại không
    const existingKhoanThu = await KhoanThu.findByPk(req.params.id);
    if (!existingKhoanThu) {
      return res.status(404).json({
        success: false,
        error: "Không tìm thấy khoản thu với ID: " + req.params.id,
      });
    }

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
    console.error("=== ERROR updating KhoanThu ===");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    if (error.parent) {
      console.error("SQL Error:", error.parent.message);
      console.error("SQL Code:", error.parent.code);
    }
    res.status(500).json({
      success: false,
      error: error.message,
      sqlError: error.parent?.message || null,
    });
  }
};

// Check if có hộ đã đóng tiền cho khoản thu này
const checkKhoanThuHasPaidHouseholds = async (req, res) => {
  try {
    const { id } = req.params;

    const khoanThu = await KhoanThu.findByPk(id);
    if (!khoanThu) {
      return res.status(404).json({
        success: false,
        error: "Không tìm thấy khoản thu",
      });
    }

    // Đếm số hộ đã đóng tiền (TrangThai = 'Đã đóng' hoặc 'da_thu')
    const [result] = await sequelize.query(
      `SELECT COUNT(*) as total FROM KhoanThuTheoHo 
       WHERE MaKhoanThu = :id AND (TrangThai = 'Đã đóng' OR TrangThai = 'da_thu')`,
      {
        replacements: { id },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const totalPaidHouseholds = result.total;

    res.json({
      success: true,
      data: {
        maKhoanThu: id,
        tenKhoanThu: khoanThu.TenKhoanThu,
        soHoDaDongTien: totalPaidHouseholds,
        canDelete: totalPaidHouseholds === 0,
      },
    });
  } catch (error) {
    console.error("Error checking KhoanThu paid households:", error);
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

    // Kiểm tra xem có hộ nào đã đóng tiền chưa
    const [paidResult] = await sequelize.query(
      `SELECT COUNT(*) as total FROM KhoanThuTheoHo 
       WHERE MaKhoanThu = :id AND (TrangThai = 'Đã đóng' OR TrangThai = 'da_thu')`,
      {
        replacements: { id },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (paidResult.total > 0) {
      return res.status(400).json({
        success: false,
        error: "Không thể xóa khoản thu này vì đã có hộ đóng tiền",
        info: {
          soHoDaDongTien: paidResult.total,
        },
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
  checkKhoanThuHasPaidHouseholds,
  KhoanThu,
};
