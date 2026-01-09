const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const KhoanThuHoKhau = sequelize.define(
  "KhoanThuHoKhau",
  {
<<<<<<< HEAD
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_khoan_thu: { type: DataTypes.INTEGER, allowNull: false },
    id_ho_khau: { type: DataTypes.INTEGER, allowNull: false },
    so_tien: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    tableName: "khoan_thu_ho_khau",
=======
    MaKhoanThuTheoHo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    MaKhoanThu: { type: DataTypes.INTEGER, allowNull: false },
    MaHoKhau: { type: DataTypes.STRING(10), allowNull: false },
    SoLuong: { type: DataTypes.INTEGER },
    ThanhTien: { type: DataTypes.INTEGER, allowNull: false },
    TrangThai: { type: DataTypes.STRING(10) },
  },
  {
    tableName: "KhoanThuTheoHo",
>>>>>>> main
    timestamps: false,
  }
);

const HoKhau = sequelize.define(
  "HoKhau",
  {
<<<<<<< HEAD
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    ma_ho_khau: { type: DataTypes.STRING(20) },
    id_can_ho: { type: DataTypes.INTEGER },
  },
  {
    tableName: "ho_khau",
=======
    MaHoKhau: { type: DataTypes.STRING(10), primaryKey: true },
    MaCanHo: { type: DataTypes.INTEGER },
    DiaChiThuongTru: { type: DataTypes.STRING(200) },
    NoiCap: { type: DataTypes.STRING(200) },
    NgayCap: { type: DataTypes.DATE },
  },
  {
    tableName: "HoKhau",
>>>>>>> main
    timestamps: false,
  }
);

const CanHo = sequelize.define(
  "CanHo",
  {
<<<<<<< HEAD
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    dien_tich: { type: DataTypes.FLOAT },
  },
  {
    tableName: "can_ho",
    timestamps: false,
  }
);

const Xe = sequelize.define(
  "Xe",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_ho_khau: { type: DataTypes.INTEGER },
  },
  {
    tableName: "xe",
=======
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
>>>>>>> main
    timestamps: false,
  }
);

const NhanKhau = sequelize.define(
  "NhanKhau",
  {
<<<<<<< HEAD
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_ho_khau: { type: DataTypes.INTEGER },
    trang_thai: { type: DataTypes.INTEGER },
  },
  {
    tableName: "nhan_khau",
=======
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
>>>>>>> main
    timestamps: false,
  }
);

<<<<<<< HEAD
const calculateFee = async (id_ho_khau) => {
  const hoKhau = await HoKhau.findByPk(id_ho_khau);
=======
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

const calculateFee = async (maHoKhau, maKhoanThu) => {
  const hoKhau = await HoKhau.findByPk(maHoKhau);
>>>>>>> main
  if (!hoKhau) {
    throw new Error("Không tìm thấy hộ khẩu");
  }

<<<<<<< HEAD
  const canHo = await CanHo.findByPk(hoKhau.id_can_ho);
  const dienTich = canHo ? canHo.dien_tich : 0;

  const soXe = await Xe.count({
    where: { id_ho_khau: id_ho_khau },
  });

  const soNhanKhau = await NhanKhau.count({
    where: {
      id_ho_khau: id_ho_khau,
      trang_thai: 1, // alive
    },
  });

  // can be changed later
  const PHI_DIEN_TICH = 10000; // vnd/m^2
  const PHI_XE = 50000; // vnd/xe
  const PHI_NHAN_KHAU = 20000; // vnd/ppl

  const tongTien =
    dienTich * PHI_DIEN_TICH + soXe * PHI_XE + soNhanKhau * PHI_NHAN_KHAU;

  return {
    dien_tich: dienTich,
    so_xe: soXe,
    so_nhan_khau: soNhanKhau,
    tong_tien: Math.round(tongTien),
    chi_tiet: {
      phi_dien_tich: dienTich * PHI_DIEN_TICH,
      phi_xe: soXe * PHI_XE,
      phi_nhan_khau: soNhanKhau * PHI_NHAN_KHAU,
    },
=======
  // Lấy thông tin khoản thu để biết đơn vị tính
  const khoanThu = await sequelize.query(
    `SELECT DonGia, DonViTinh FROM KhoanThu WHERE MaKhoanThu = :maKhoanThu`,
    {
      replacements: { maKhoanThu },
      type: sequelize.QueryTypes.SELECT,
    }
  );

  if (!khoanThu || khoanThu.length === 0) {
    throw new Error("Không tìm thấy khoản thu");
  }

  const donGia = khoanThu[0].DonGia || 0;
  const donViTinh = khoanThu[0].DonViTinh || "nhan_khau";

  const soNhanKhau = await NhanKhau.count({
    where: {
      MaHoKhau: maHoKhau,
      TrangThai: 1, // alive
    },
  });

  let thanhTien = 0;
  let soLuong = 0;

  // Tính thành tiền dựa vào đơn vị tính
  if (donViTinh === "ho_khau") {
    // Tính theo hộ khẩu: 1 hộ = 1 đơn giá
    thanhTien = donGia;
    soLuong = 1;
  } else if (donViTinh === "dien_tich") {
    // Tính theo diện tích: diện tích * đơn giá
    const canHo = await CanHo.findOne({
      where: { MaHoKhau: maHoKhau },
    });
    if (canHo && canHo.DienTich) {
      thanhTien = canHo.DienTich * donGia;
      soLuong = canHo.DienTich;
    } else {
      thanhTien = 0;
      soLuong = 0;
    }
  } else {
    // Tính theo nhân khẩu: số người * đơn giá
    thanhTien = soNhanKhau * donGia;
    soLuong = soNhanKhau;
  }

  return {
    so_nhan_khau: soLuong, // Đổi tên biến này thành số lượng chung
    tong_tien: Math.round(thanhTien),
    don_vi_tinh: donViTinh,
    don_gia: donGia,
>>>>>>> main
  };
};

// api

const assignKhoanThuToHoKhau = async (req, res) => {
  try {
<<<<<<< HEAD
    const { id_khoan_thu, id_ho_khau } = req.body;

    if (!id_khoan_thu || !id_ho_khau) {
      return res.status(400).json({
        error: "Thiếu thông tin",
      });
    }

    // check dup
    const existing = await KhoanThuHoKhau.findOne({
      where: { id_khoan_thu, id_ho_khau },
=======
    const { MaKhoanThu, MaHoKhau } = req.body;

    if (!MaKhoanThu || !MaHoKhau) {
      return res.status(400).json({
        error: "Thiếu thông tin MaKhoanThu hoặc MaHoKhau",
      });
    }

    // Kiểm tra trùng lặp
    const existing = await KhoanThuHoKhau.findOne({
      where: { MaKhoanThu, MaHoKhau },
>>>>>>> main
    });

    if (existing) {
      return res.status(400).json({
        error: "Khoản thu này đã được gán cho hộ khẩu",
        data: existing,
      });
    }

<<<<<<< HEAD
    const feeInfo = await calculateFee(id_ho_khau);

    const newRecord = await KhoanThuHoKhau.create({
      id_khoan_thu,
      id_ho_khau,
      so_tien: feeInfo.tong_tien,
    });

    res.status(201).json({
      message: "Gán khoản thu thành công",
      data: newRecord,
      tinh_toan: feeInfo,
    });
  } catch (error) {
=======
    const feeInfo = await calculateFee(MaHoKhau, MaKhoanThu);

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
>>>>>>> main
    res.status(500).json({ error: error.message });
  }
};

<<<<<<< HEAD
const getKhoanThuByHoKhau = async (req, res) => {
  try {
    const { id_ho_khau } = req.params;

    // get all khoan thu
    const result = await sequelize.query(
      `
      SELECT 
        kthk.id,
        kthk.id_khoan_thu,
        kthk.id_ho_khau,
        kthk.so_tien,
        kt.ma_khoan_thu,
        kt.ten_khoan_thu,
        kt.loai_khoan_thu,
        kt.chi_tiet,
        kt.thoi_gian_bat_dau,
        kt.thoi_gian_ket_thuc,
        hk.ma_ho_khau
      FROM khoan_thu_ho_khau kthk
      JOIN khoan_thu kt ON kthk.id_khoan_thu = kt.id
      JOIN ho_khau hk ON kthk.id_ho_khau = hk.id
      WHERE kthk.id_ho_khau = :id_ho_khau
      ORDER BY kt.thoi_gian_bat_dau DESC
      `,
      {
        replacements: { id_ho_khau },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const feeInfo = await calculateFee(id_ho_khau);

    res.json({
      message: "Lấy danh sách khoản thu thành công",
      ho_khau_info: {
        id_ho_khau: parseInt(id_ho_khau),
        ...feeInfo,
      },
      total: result.length,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
=======
// Update trạng thái khoản thu
const updateTrangThaiKhoanThu = async (req, res) => {
  try {
    const { maHoKhau, maKhoanThu } = req.params;
    const { TrangThai } = req.body;

    if (!maHoKhau || !maKhoanThu) {
      return res.status(400).json({
        success: false,
        error: "Thiếu thông tin mã hộ khẩu hoặc mã khoản thu",
      });
    }

    const trangThaiMoi = TrangThai || "da_thu";

    // Sử dụng raw query để cập nhật
    const [result] = await sequelize.query(
      `
      UPDATE KhoanThuTheoHo 
      SET TrangThai = :trangThai 
      WHERE MaHoKhau = :maHoKhau AND MaKhoanThu = :maKhoanThu
      `,
      {
        replacements: {
          trangThai: trangThaiMoi,
          maHoKhau: maHoKhau,
          maKhoanThu: maKhoanThu,
        },
        type: sequelize.QueryTypes.UPDATE,
      }
    );

    if (result === 0) {
      return res.status(404).json({
        success: false,
        error: "Không tìm thấy khoản thu",
      });
    }

    res.json({
      success: true,
      message: "Cập nhật trạng thái thành công",
      data: {
        MaHoKhau: maHoKhau,
        MaKhoanThu: maKhoanThu,
        TrangThai: trangThaiMoi,
      },
    });
  } catch (error) {
    console.error("Error updating TrangThai:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Xóa khoản thu khỏi hộ khẩu (bỏ gán)
const deleteKhoanThuFromHoKhau = async (req, res) => {
  try {
    const { maHoKhau, maKhoanThu } = req.params;

    if (!maHoKhau || !maKhoanThu) {
      return res.status(400).json({
        success: false,
        error: "Thiếu thông tin mã hộ khẩu hoặc mã khoản thu",
      });
    }

    // Tìm record cần xóa
    const record = await KhoanThuHoKhau.findOne({
      where: { MaHoKhau: maHoKhau, MaKhoanThu: maKhoanThu },
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        error: "Không tìm thấy khoản thu đã gán cho hộ khẩu này",
      });
    }

    // Xóa record
    await record.destroy();

    res.json({
      success: true,
      message: "Đã bỏ gán khoản thu khỏi hộ khẩu",
      data: {
        MaHoKhau: maHoKhau,
        MaKhoanThu: maKhoanThu,
      },
    });
  } catch (error) {
    console.error("Error deleting KhoanThuHoKhau:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
>>>>>>> main
  }
};

module.exports = {
  assignKhoanThuToHoKhau,
  getKhoanThuByHoKhau,
<<<<<<< HEAD
=======
  updateTrangThaiKhoanThu,
  deleteKhoanThuFromHoKhau,
>>>>>>> main
};
