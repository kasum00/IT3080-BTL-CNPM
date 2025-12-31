const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const KhoanThuHoKhau = sequelize.define(
  "KhoanThuHoKhau",
  {
    MaKhoanThu: { type: DataTypes.INTEGER, allowNull: false },
    MaHoKhau: { type: DataTypes.STRING(10), allowNull: false },
    SoLuong: { type: DataTypes.INTEGER },
    ThanhTien: { type: DataTypes.INTEGER, allowNull: false },
    TrangThai: { type: DataTypes.STRING(10) },
  },
  {
    tableName: "KhoanThuTheoHo",
    timestamps: false,
  }
);

const HoKhau = sequelize.define(
  "HoKhau",
  {
    MaHoKhau: { type: DataTypes.STRING(10), primaryKey: true },
    MaCanHo: { type: DataTypes.INTEGER },
    DiaChiThuongTru: { type: DataTypes.STRING(200) },
    NoiCap: { type: DataTypes.STRING(200) },
    NgayCap: { type: DataTypes.DATE },
  },
  {
    tableName: "HoKhau",
    timestamps: false,
  }
);

const CanHo = sequelize.define(
  "CanHo",
  {
    MaCanHo: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    MaHoKhau: { type: DataTypes.STRING(10) },
    TenCanHo: { type: DataTypes.STRING(100) },
    Tang: { type: DataTypes.STRING(50) },
    DienTich: { type: DataTypes.FLOAT },
    TrangThai: { type: DataTypes.STRING(20) },
    MoTa: { type: DataTypes.STRING(500) },
  },
  {
    tableName: "CanHo",
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
    MaHoKhau: { type: DataTypes.STRING(10) },
    HoTen: { type: DataTypes.STRING(100) },
    TrangThai: { type: DataTypes.INTEGER },
  },
  {
    tableName: "NhanKhau",
    timestamps: false,
  }
);

const getKhoanThuByHoKhau = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Thiếu ID hộ khẩu",
      });
    }

    const result = await sequelize.query(
      `
      SELECT 
        kthk.MaKhoanThuTheoHo,
        kthk.MaKhoanThu,
        kthk.MaHoKhau,
        kthk.SoLuong,
        kthk.ThanhTien,
        kthk.TrangThai,
        kt.TenKhoanThu,
        kt.LoaiKhoanThu,
        kt.DonViTinh,
        kt.DonGia,
        kt.ChiTiet,
        kt.ThoiGianBatDau,
        kt.ThoiGianKetThuc
      FROM KhoanThuTheoHo kthk
      JOIN KhoanThu kt ON kthk.MaKhoanThu = kt.MaKhoanThu
      WHERE kthk.MaHoKhau = :id
      `,
      {
        replacements: { id },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Không tìm thấy khoản thu cho hộ khẩu này",
      });
    }

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error getting KhoanThuHoKhau:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const calculateFee = async (maHoKhau) => {
  const hoKhau = await HoKhau.findByPk(maHoKhau);
  if (!hoKhau) {
    throw new Error("Không tìm thấy hộ khẩu");
  }

  const canHo = await CanHo.findByPk(hoKhau.MaCanHo);
  const dienTich = canHo ? canHo.DienTich : 0;

  const soNhanKhau = await NhanKhau.count({
    where: {
      MaHoKhau: maHoKhau,
      TrangThai: 1, // alive
    },
  });

  // Có thể thay đổi công thức tính sau
  const PHI_DIEN_TICH = 10000; // vnd/m^2
  const PHI_NHAN_KHAU = 20000; // vnd/người

  const tongTien = dienTich * PHI_DIEN_TICH + soNhanKhau * PHI_NHAN_KHAU;

  return {
    dien_tich: dienTich,
    so_nhan_khau: soNhanKhau,
    tong_tien: Math.round(tongTien),
    chi_tiet: {
      phi_dien_tich: dienTich * PHI_DIEN_TICH,
      phi_nhan_khau: soNhanKhau * PHI_NHAN_KHAU,
    },
  };
};

// api

const assignKhoanThuToHoKhau = async (req, res) => {
  try {
    const { MaKhoanThu, MaHoKhau } = req.body;

    if (!MaKhoanThu || !MaHoKhau) {
      return res.status(400).json({
        error: "Thiếu thông tin MaKhoanThu hoặc MaHoKhau",
      });
    }

    // Kiểm tra trùng lặp
    const existing = await KhoanThuHoKhau.findOne({
      where: { MaKhoanThu, MaHoKhau },
    });

    if (existing) {
      return res.status(400).json({
        error: "Khoản thu này đã được gán cho hộ khẩu",
        data: existing,
      });
    }

    const feeInfo = await calculateFee(MaHoKhau);

    const newRecord = await KhoanThuHoKhau.create({
      MaKhoanThu,
      MaHoKhau,
      SoLuong: feeInfo.so_nhan_khau,
      ThanhTien: feeInfo.tong_tien,
      TrangThai: "Chưa đóng",
    });

    res.status(201).json({
      success: true,
      data: newRecord,
    });
  } catch (error) {
    console.error("Error assigning KhoanThu to HoKhau:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  assignKhoanThuToHoKhau,
  getKhoanThuByHoKhau,
};
