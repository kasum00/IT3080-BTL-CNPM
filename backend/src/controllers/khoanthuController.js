const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const KhoanThu = sequelize.define(
  "KhoanThu",
  {
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
    timestamps: false,
  }
);

// Create
const createKhoanThu = async (req, res) => {
  try {
    const data = await KhoanThu.create(req.body);
    res.json(data);
  } catch (error) {
    res.status(500).json({error: error.message });
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
  }
};

// Update
const updateKhoanThu = async (req, res) => {
  try {
    await KhoanThu.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.json({ message: "Cập nhật thành công" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete

const deleteKhoanThu = async (req, res) => {
  try {
    const { id } = req.params;

    const khoanThu = await KhoanThu.findByPk(id);
    if (!khoanThu) {
      return res.status(404).json({
        error: "Không tìm thấy khoản thu",
      });
    }

    const [result] = await sequelize.query(
      `SELECT COUNT(*) as total FROM khoan_thu_ho_khau WHERE id_khoan_thu = :id`,
      {
        replacements: { id },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const totalHoKhau = result.total;

    // Xóa khoản thu (CASCADE sẽ tự động xóa khoan_thu_ho_khau và hoa_don)
    await KhoanThu.destroy({ where: { id } });

    res.json({
      message: "Xóa khoản thu thành công",
      info: {
        ma_khoan_thu: khoanThu.ma_khoan_thu,
        ten_khoan_thu: khoanThu.ten_khoan_thu,
        so_ho_khau_bi_anh_huong: totalHoKhau,
        luu_y: "Đã xóa tất cả khoản thu hộ khẩu và hóa đơn liên quan",
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createKhoanThu,
  getKhoanThu,
  updateKhoanThu,
  deleteKhoanThu,
  KhoanThu,
};
