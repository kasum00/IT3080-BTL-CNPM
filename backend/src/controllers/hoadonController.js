const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const HoaDon = sequelize.define(
  "HoaDon",
  {
    MaHoaDon: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    MaHoKhau: { type: DataTypes.STRING(10), allowNull: false },
    MaKhoanThuTheoHo: { type: DataTypes.INTEGER, allowNull: true },
    TenHoaDon: { type: DataTypes.STRING(100), allowNull: true },
    TongSoTien: { type: DataTypes.INTEGER, defaultValue: 0 },
    SoTienDaNop: { type: DataTypes.INTEGER, defaultValue: 0 },
    DaNop: { type: DataTypes.BOOLEAN, defaultValue: false },
    NgayNop: { type: DataTypes.DATEONLY, allowNull: true },
    NgayXuatHoaDon: { type: DataTypes.DATEONLY, allowNull: true },
  },
  {
    tableName: "HoaDon",
    timestamps: false,
  }
);

const KhoanThuHoKhau = sequelize.define(
  "KhoanThuHoKhau",
  {
    MaKhoanThuTheoHo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    MaKhoanThu: { type: DataTypes.INTEGER },
    MaHoKhau: { type: DataTypes.STRING(10) },
    SoLuong: { type: DataTypes.INTEGER, defaultValue: 0 },
    ThanhTien: { type: DataTypes.INTEGER, defaultValue: 0 },
    TrangThai: { type: DataTypes.STRING(20), defaultValue: "Chưa đóng" },
  },
  {
    tableName: "KhoanThuTheoHo",
    timestamps: false,
  }
);

const TongTienHoKhau = sequelize.define(
  "TongTienHoKhau",
  {
    MaHoKhau: { type: DataTypes.STRING(10), primaryKey: true },
    TongTien: { type: DataTypes.INTEGER, defaultValue: 0 },
    TongDaNop: { type: DataTypes.INTEGER, defaultValue: 0 },
    TongConThieu: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  {
    tableName: "TongTienHoKhau",
    timestamps: false,
  }
);

/**
 * POST /api/hoa-don
 * Body: {
 *   MaHoKhau: "HK001",
 *   MaKhoanThuTheoHo: 1 (optional - nếu hóa đơn cho 1 khoản thu cụ thể),
 *   TenHoaDon: "Hóa đơn tháng 1/2026"
 * }
 */
const createHoaDon = async (req, res) => {
  try {
    const { MaHoKhau, MaKhoanThuTheoHo, TenHoaDon } = req.body;

    if (!MaHoKhau) {
      return res.status(400).json({
        error: "Thiếu thông tin: MaHoKhau là bắt buộc",
      });
    }

    let tongSoTien = 0;

    // Nếu có MaKhoanThuTheoHo, lấy ThanhTien của khoản thu đó
    if (MaKhoanThuTheoHo) {
      const khoanThu = await KhoanThuHoKhau.findByPk(MaKhoanThuTheoHo);
      if (!khoanThu) {
        return res.status(404).json({
          error: "Không tìm thấy khoản thu theo hộ",
        });
      }
      tongSoTien = khoanThu.ThanhTien;
    } else {
      // Lấy tổng tiền từ TongTienHoKhau
      const tongTien = await TongTienHoKhau.findByPk(MaHoKhau);
      if (tongTien) {
        tongSoTien = tongTien.TongConThieu;
      }
    }

    const newHoaDon = await HoaDon.create({
      MaHoKhau,
      MaKhoanThuTheoHo: MaKhoanThuTheoHo || null,
      TenHoaDon: TenHoaDon || `Hóa đơn - ${MaHoKhau}`,
      TongSoTien: tongSoTien,
      SoTienDaNop: 0,
      DaNop: false,
      NgayXuatHoaDon: new Date(),
    });

    const result = await sequelize.query(
      `
      SELECT 
        hd.MaHoaDon,
        hd.MaHoKhau,
        hd.MaKhoanThuTheoHo,
        hd.TenHoaDon,
        hd.TongSoTien,
        hd.SoTienDaNop,
        (hd.TongSoTien - hd.SoTienDaNop) AS ConThieu,
        hd.DaNop,
        hd.NgayNop,
        hd.NgayXuatHoaDon,
        tthk.TongTien AS TongTienHoKhau,
        tthk.TongDaNop AS TongDaNopHoKhau,
        tthk.TongConThieu AS TongConThieuHoKhau
      FROM HoaDon hd
      LEFT JOIN TongTienHoKhau tthk ON hd.MaHoKhau = tthk.MaHoKhau
      WHERE hd.MaHoaDon = :id
      `,
      {
        replacements: { id: newHoaDon.MaHoaDon },
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
    const { SoTienNop, NgayNop } = req.body;

    if (!SoTienNop || SoTienNop <= 0) {
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

    const soTienCanNop = hoaDon.TongSoTien;
    const soTienDaNop = (hoaDon.SoTienDaNop || 0) + SoTienNop;

    // Không nộp quá
    if (soTienDaNop > soTienCanNop) {
      return res.status(400).json({
        error: `Số tiền nộp vượt quá số tiền cần thanh toán (còn thiếu: ${
          soTienCanNop - (hoaDon.SoTienDaNop || 0)
        })`,
        TongSoTien: soTienCanNop,
        SoTienDaNopTruoc: hoaDon.SoTienDaNop || 0,
        ConThieu: soTienCanNop - (hoaDon.SoTienDaNop || 0),
      });
    }

    const daNopDu = soTienDaNop >= soTienCanNop;

    // Update hóa đơn
    await HoaDon.update(
      {
        SoTienDaNop: soTienDaNop,
        NgayNop: NgayNop || new Date(),
        DaNop: daNopDu,
      },
      {
        where: { MaHoaDon: id },
      }
    );

    // Cập nhật TongTienHoKhau
    await TongTienHoKhau.increment(
      { TongDaNop: SoTienNop, TongConThieu: -SoTienNop },
      { where: { MaHoKhau: hoaDon.MaHoKhau } }
    );

    // Nếu hóa đơn liên kết với khoản thu cụ thể, cập nhật trạng thái
    if (hoaDon.MaKhoanThuTheoHo && daNopDu) {
      await KhoanThuHoKhau.update(
        { TrangThai: "Đã đóng" },
        { where: { MaKhoanThuTheoHo: hoaDon.MaKhoanThuTheoHo } }
      );
    }

    const result = await sequelize.query(
      `
      SELECT 
        hd.MaHoaDon,
        hd.MaHoKhau,
        hd.TenHoaDon,
        hd.TongSoTien,
        hd.SoTienDaNop,
        (hd.TongSoTien - hd.SoTienDaNop) AS ConThieu,
        hd.DaNop,
        hd.NgayNop,
        CASE 
          WHEN hd.SoTienDaNop >= hd.TongSoTien THEN 'da_thanh_toan'
          WHEN hd.SoTienDaNop > 0 THEN 'thanh_toan_mot_phan'
          ELSE 'chua_thanh_toan'
        END AS TrangThai,
        tthk.TongTien AS TongTienHoKhau,
        tthk.TongDaNop AS TongDaNopHoKhau,
        tthk.TongConThieu AS TongConThieuHoKhau
      FROM HoaDon hd
      LEFT JOIN TongTienHoKhau tthk ON hd.MaHoKhau = tthk.MaHoKhau
      WHERE hd.MaHoaDon = :id
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
        hd.MaHoaDon,
        hd.MaHoKhau,
        hd.MaKhoanThuTheoHo,
        hd.TenHoaDon,
        hd.TongSoTien,
        hd.SoTienDaNop,
        (hd.TongSoTien - IFNULL(hd.SoTienDaNop, 0)) AS ConThieu,
        hd.DaNop,
        hd.NgayNop,
        hd.NgayXuatHoaDon,
        CASE 
          WHEN hd.SoTienDaNop >= hd.TongSoTien THEN 'da_thanh_toan'
          WHEN hd.SoTienDaNop > 0 THEN 'thanh_toan_mot_phan'
          ELSE 'chua_thanh_toan'
        END AS TrangThai,
        kt.TenKhoanThu,
        kt.LoaiKhoanThu,
        tthk.TongTien AS TongTienHoKhau,
        tthk.TongDaNop AS TongDaNopHoKhau,
        tthk.TongConThieu AS TongConThieuHoKhau,
        ch.MaCanHo,
        ch.TenCanHo
      FROM HoaDon hd
      LEFT JOIN KhoanThuTheoHo kthh ON hd.MaKhoanThuTheoHo = kthh.MaKhoanThuTheoHo
      LEFT JOIN KhoanThu kt ON kthh.MaKhoanThu = kt.MaKhoanThu
      LEFT JOIN TongTienHoKhau tthk ON hd.MaHoKhau = tthk.MaHoKhau
      LEFT JOIN HoKhau hk ON hd.MaHoKhau = hk.MaHoKhau
      LEFT JOIN CanHo ch ON hk.MaCanHo = ch.MaCanHo
      WHERE hd.MaHoaDon = :id
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

    if (hoaDon.DaNop) {
      return res.status(403).json({
        error: "Không thể xóa hóa đơn đã thanh toán đủ",
        data: {
          MaHoaDon: hoaDon.MaHoaDon,
          DaNop: true,
          SoTienDaNop: hoaDon.SoTienDaNop,
          NgayNop: hoaDon.NgayNop,
        },
        ghi_chu:
          "Chỉ có thể xóa hóa đơn chưa thanh toán hoặc thanh toán một phần",
      });
    }

    // Hoàn trả lại số tiền đã nộp vào TongTienHoKhau
    if (hoaDon.SoTienDaNop > 0) {
      await TongTienHoKhau.increment(
        { TongDaNop: -hoaDon.SoTienDaNop, TongConThieu: hoaDon.SoTienDaNop },
        { where: { MaHoKhau: hoaDon.MaHoKhau } }
      );
    }

    await HoaDon.destroy({ where: { MaHoaDon: id } });

    res.json({
      message: "Xóa hóa đơn thành công",
      data: {
        MaHoaDon: hoaDon.MaHoaDon,
        SoTienDaNop: hoaDon.SoTienDaNop,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * PUT /api/hoa-don/:id
 * Body: { TenHoaDon, ... }
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

    if (hoaDon.DaNop) {
      return res.status(403).json({
        error: "Không thể sửa hóa đơn đã thanh toán đủ",
        data: {
          MaHoaDon: hoaDon.MaHoaDon,
          DaNop: true,
          SoTienDaNop: hoaDon.SoTienDaNop,
        },
      });
    }

    // Chỉ cho phép cập nhật một số trường
    const allowedFields = ["TenHoaDon"];
    const updateData = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    await HoaDon.update(updateData, {
      where: { MaHoaDon: id },
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

/**
 * GET /api/hoa-don/ho-khau/:maHoKhau
 * Lấy tất cả hóa đơn của một hộ khẩu
 */
const getHoaDonByHoKhau = async (req, res) => {
  try {
    const { maHoKhau } = req.params;

    const result = await sequelize.query(
      `
      SELECT 
        hd.MaHoaDon,
        hd.MaHoKhau,
        hd.TenHoaDon,
        hd.TongSoTien,
        hd.SoTienDaNop,
        (hd.TongSoTien - IFNULL(hd.SoTienDaNop, 0)) AS ConThieu,
        hd.DaNop,
        hd.NgayNop,
        hd.NgayXuatHoaDon,
        CASE 
          WHEN hd.SoTienDaNop >= hd.TongSoTien THEN 'da_thanh_toan'
          WHEN hd.SoTienDaNop > 0 THEN 'thanh_toan_mot_phan'
          ELSE 'chua_thanh_toan'
        END AS TrangThai
      FROM HoaDon hd
      WHERE hd.MaHoKhau = :maHoKhau
      ORDER BY hd.NgayXuatHoaDon DESC
      `,
      {
        replacements: { maHoKhau },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    // Lấy thông tin tổng tiền hộ khẩu
    const tongTien = await TongTienHoKhau.findByPk(maHoKhau);

    res.json({
      message: "Lấy danh sách hóa đơn thành công",
      data: {
        hoaDons: result,
        tongTienHoKhau: tongTien || {
          TongTien: 0,
          TongDaNop: 0,
          TongConThieu: 0,
        },
      },
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
  getHoaDonByHoKhau,
};
