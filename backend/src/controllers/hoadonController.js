const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const HoaDon = sequelize.define(
  "HoaDon",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    ma_hoa_don: { type: DataTypes.STRING(30), allowNull: false, unique: true },
    id_khoan_thu_ho_khau: { type: DataTypes.INTEGER, allowNull: false },
    so_tien_da_nop: { type: DataTypes.INTEGER, defaultValue: 0 },
    ngay_nop: { type: DataTypes.DATEONLY, allowNull: true },
    da_nop: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    tableName: "hoa_don",
    timestamps: false,
  }
);

const KhoanThuHoKhau = sequelize.define(
  "KhoanThuHoKhau",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_khoan_thu: { type: DataTypes.INTEGER },
    id_ho_khau: { type: DataTypes.INTEGER },
    so_tien: { type: DataTypes.INTEGER },
  },
  {
    tableName: "khoan_thu_ho_khau",
    timestamps: false,
  }
);

/**
 * POST /api/hoa-don
 * Body: {
 *   ma_hoa_don: "HD001",
 *   id_khoan_thu_ho_khau: 1,
 *   so_tien_da_nop: 0 (optional, default = 0),
 *   ngay_nop: null (optional)
 * }
 *
 */
const createHoaDon = async (req, res) => {
  try {
    const { ma_hoa_don, id_khoan_thu_ho_khau, so_tien_da_nop, ngay_nop } =
      req.body;

    // Validate input
    if (!ma_hoa_don || !id_khoan_thu_ho_khau) {
      return res.status(400).json({
        error:
          "Thiếu thông tin: ma_hoa_don và id_khoan_thu_ho_khau là bắt buộc",
      });
    }

    const khoanThuHoKhau = await KhoanThuHoKhau.findByPk(id_khoan_thu_ho_khau);
    if (!khoanThuHoKhau) {
      return res.status(404).json({
        error: "Không tìm thấy khoản thu hộ khẩu",
      });
    }

    const existing = await HoaDon.findOne({ where: { ma_hoa_don } });
    if (existing) {
      return res.status(400).json({
        error: "Mã hóa đơn đã tồn tại",
      });
    }

    const newHoaDon = await HoaDon.create({
      ma_hoa_don,
      id_khoan_thu_ho_khau,
      so_tien_da_nop: so_tien_da_nop || 0,
      ngay_nop: ngay_nop || null,
    });

    const result = await sequelize.query(
      `
      SELECT 
        hd.id,
        hd.ma_hoa_don,
        hd.id_khoan_thu_ho_khau,
        hd.so_tien_da_nop,
        hd.ngay_nop,
        hd.da_nop,
        kthk.so_tien AS so_tien_can_nop,
        (kthk.so_tien - IFNULL(hd.so_tien_da_nop, 0)) AS con_thieu,
        kt.ma_khoan_thu,
        kt.ten_khoan_thu,
        hk.ma_ho_khau
      FROM hoa_don hd
      JOIN khoan_thu_ho_khau kthk ON hd.id_khoan_thu_ho_khau = kthk.id
      JOIN khoan_thu kt ON kthk.id_khoan_thu = kt.id
      JOIN ho_khau hk ON kthk.id_ho_khau = hk.id
      WHERE hd.id = :id
      `,
      {
        replacements: { id: newHoaDon.id },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.status(201).json({
      message: "Tạo hóa đơn thành công",
      data: result[0],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const thanhToanHoaDon = async (req, res) => {
  try {
    const { id } = req.params;
    const { so_tien_nop, ngay_nop } = req.body;

    if (!so_tien_nop || so_tien_nop <= 0) {
      return res.status(400).json({
        error: "Số tiền nộp phải lớn hơn 0",
      });
    }

    const hoaDon = await HoaDon.findByPk(id);
    if (!hoaDon) {
      return res.status(404).json({
        error: "Không tìm thấy hóa đơn",
      });
    }

    const khoanThuHoKhau = await KhoanThuHoKhau.findByPk(
      hoaDon.id_khoan_thu_ho_khau
    );
    const soTienCanNop = khoanThuHoKhau.so_tien;
    const soTienDaNop = (hoaDon.so_tien_da_nop || 0) + so_tien_nop;

    // không nộp quá
    if (soTienDaNop > soTienCanNop) {
      return res.status(400).json({
        error: `Số tiền nộp vượt quá số tiền cần thanh toán (còn thiếu: ${
          soTienCanNop - (hoaDon.so_tien_da_nop || 0)
        })`,
        so_tien_can_nop: soTienCanNop,
        so_tien_da_nop_truoc: hoaDon.so_tien_da_nop || 0,
        con_thieu: soTienCanNop - (hoaDon.so_tien_da_nop || 0),
      });
    }

    const daNopDu = soTienDaNop >= soTienCanNop;

    // update da_nop
    await HoaDon.update(
      {
        so_tien_da_nop: soTienDaNop,
        ngay_nop: ngay_nop || new Date(),
        da_nop: daNopDu,
      },
      {
        where: { id },
      }
    );

    const result = await sequelize.query(
      `
      SELECT 
        hd.id,
        hd.ma_hoa_don,
        hd.id_khoan_thu_ho_khau,
        hd.so_tien_da_nop,
        hd.ngay_nop,
        hd.da_nop,
        kthk.so_tien AS so_tien_can_nop,
        (kthk.so_tien - hd.so_tien_da_nop) AS con_thieu,
        CASE 
          WHEN hd.so_tien_da_nop >= kthk.so_tien THEN 'da_thanh_toan'
          WHEN hd.so_tien_da_nop > 0 THEN 'thanh_toan_mot_phan'
          ELSE 'chua_thanh_toan'
        END AS trang_thai,
        kt.ma_khoan_thu,
        kt.ten_khoan_thu,
        hk.ma_ho_khau
      FROM hoa_don hd
      JOIN khoan_thu_ho_khau kthk ON hd.id_khoan_thu_ho_khau = kthk.id
      JOIN khoan_thu kt ON kthk.id_khoan_thu = kt.id
      JOIN ho_khau hk ON kthk.id_ho_khau = hk.id
      WHERE hd.id = :id
      `,
      {
        replacements: { id },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.json({
      message: "Cập nhật thanh toán thành công",
      data: result[0],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getHoaDon = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await sequelize.query(
      `
      SELECT 
        hd.id,
        hd.ma_hoa_don,
        hd.id_khoan_thu_ho_khau,
        hd.so_tien_da_nop,
        hd.ngay_nop,
        hd.da_nop,
        kthk.so_tien AS so_tien_can_nop,
        (kthk.so_tien - IFNULL(hd.so_tien_da_nop, 0)) AS con_thieu,
        CASE 
          WHEN hd.so_tien_da_nop >= kthk.so_tien THEN 'da_thanh_toan'
          WHEN hd.so_tien_da_nop > 0 THEN 'thanh_toan_mot_phan'
          ELSE 'chua_thanh_toan'
        END AS trang_thai,
        kt.ma_khoan_thu,
        kt.ten_khoan_thu,
        kt.loai_khoan_thu,
        hk.ma_ho_khau,
        ch.ma_can_ho,
        ch.ten_can_ho
      FROM hoa_don hd
      JOIN khoan_thu_ho_khau kthk ON hd.id_khoan_thu_ho_khau = kthk.id
      JOIN khoan_thu kt ON kthk.id_khoan_thu = kt.id
      JOIN ho_khau hk ON kthk.id_ho_khau = hk.id
      LEFT JOIN can_ho ch ON hk.id_can_ho = ch.id
      WHERE hd.id = :id
      `,
      {
        replacements: { id },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (result.length === 0) {
      return res.status(404).json({
        error: "Không tìm thấy hóa đơn",
      });
    }

    res.json({
      message: "Lấy thông tin hóa đơn thành công",
      data: result[0],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteHoaDon = async (req, res) => {
  try {
    const { id } = req.params;

    const hoaDon = await HoaDon.findByPk(id);
    if (!hoaDon) {
      return res.status(404).json({
        error: "Không tìm thấy hóa đơn",
      });
    }

    if (hoaDon.da_nop) {
      return res.status(403).json({
        error: "Không thể xóa hóa đơn đã thanh toán đủ",
        data: {
          ma_hoa_don: hoaDon.ma_hoa_don,
          da_nop: true,
          so_tien_da_nop: hoaDon.so_tien_da_nop,
          ngay_nop: hoaDon.ngay_nop,
        },
        ghi_chu:
          "Chỉ có thể xóa hóa đơn chưa thanh toán hoặc thanh toán một phần",
      });
    }

    await HoaDon.destroy({ where: { id } });

    res.json({
      message: "Xóa hóa đơn thành công",
      data: {
        ma_hoa_don: hoaDon.ma_hoa_don,
        so_tien_da_nop: hoaDon.so_tien_da_nop,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * PUT /api/hoa-don/:id
 * Body: { ma_hoa_don, so_tien_da_nop, ngay_nop, ... }
 
 */
const updateHoaDon = async (req, res) => {
  try {
    const { id } = req.params;

    const hoaDon = await HoaDon.findByPk(id);
    if (!hoaDon) {
      return res.status(404).json({
        error: "Không tìm thấy hóa đơn",
      });
    }

    if (hoaDon.da_nop) {
      return res.status(403).json({
        error: "Không thể sửa hóa đơn đã thanh toán đủ",
        data: {
          ma_hoa_don: hoaDon.ma_hoa_don,
          da_nop: true,
          so_tien_da_nop: hoaDon.so_tien_da_nop,
        },
      });
    }

    await HoaDon.update(req.body, {
      where: { id },
    });

    const updated = await HoaDon.findByPk(id);

    res.json({
      message: "Cập nhật hóa đơn thành công",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createHoaDon,
  thanhToanHoaDon,
  getHoaDon,
  updateHoaDon,
  deleteHoaDon,
};
