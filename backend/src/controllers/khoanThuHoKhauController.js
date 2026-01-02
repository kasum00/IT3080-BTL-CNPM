const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const KhoanThuHoKhau = sequelize.define(
  "KhoanThuHoKhau",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_khoan_thu: { type: DataTypes.INTEGER, allowNull: false },
    id_ho_khau: { type: DataTypes.INTEGER, allowNull: false },
    so_tien: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    tableName: "khoan_thu_ho_khau",
    timestamps: false,
  }
);

const HoKhau = sequelize.define(
  "HoKhau",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    ma_ho_khau: { type: DataTypes.STRING(20) },
    id_can_ho: { type: DataTypes.INTEGER },
  },
  {
    tableName: "ho_khau",
    timestamps: false,
  }
);

const CanHo = sequelize.define(
  "CanHo",
  {
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
    timestamps: false,
  }
);

const NhanKhau = sequelize.define(
  "NhanKhau",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_ho_khau: { type: DataTypes.INTEGER },
    trang_thai: { type: DataTypes.INTEGER },
  },
  {
    tableName: "nhan_khau",
    timestamps: false,
  }
);

const calculateFee = async (id_ho_khau) => {
  const hoKhau = await HoKhau.findByPk(id_ho_khau);
  if (!hoKhau) {
    throw new Error("Không tìm thấy hộ khẩu");
  }

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
  };
};

// api

const assignKhoanThuToHoKhau = async (req, res) => {
  try {
    const { id_khoan_thu, id_ho_khau } = req.body;

    if (!id_khoan_thu || !id_ho_khau) {
      return res.status(400).json({
        error: "Thiếu thông tin",
      });
    }

    // check dup
    const existing = await KhoanThuHoKhau.findOne({
      where: { id_khoan_thu, id_ho_khau },
    });

    if (existing) {
      return res.status(400).json({
        error: "Khoản thu này đã được gán cho hộ khẩu",
        data: existing,
      });
    }

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
    res.status(500).json({ error: error.message });
  }
};

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
  }
};

module.exports = {
  assignKhoanThuToHoKhau,
  getKhoanThuByHoKhau,
};
