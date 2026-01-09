const sequelize = require("../config/db");

// Thống kê tổng quan khoản thu
const getThongKeKhoanThu = async (req, res) => {
  try {
    // 1. Đếm số lượng khoản thu
    const [countResult] = await sequelize.query(
      `SELECT COUNT(*) as soKhoanThu FROM KhoanThu`
    );
    const soKhoanThu = countResult[0]?.soKhoanThu || 0;

    // 2. Tổng tiền tất cả khoản thu của tất cả hộ
    const [tongTienResult] = await sequelize.query(
      `SELECT IFNULL(SUM(ThanhTien), 0) as tongTien FROM KhoanThuTheoHo`
    );
    const tongTien = tongTienResult[0]?.tongTien || 0;

    // 3. Số tiền đã thu (trạng thái = 'Đã đóng' hoặc 'da_thu')
    const [daThuResult] = await sequelize.query(
      `SELECT IFNULL(SUM(ThanhTien), 0) as daThu 
       FROM KhoanThuTheoHo 
       WHERE TrangThai = 'Đã đóng' OR TrangThai = 'da_thu'`
    );
    const daThu = daThuResult[0]?.daThu || 0;

    // 4. Số tiền cần thu (chưa đóng)
    const canThu = tongTien - daThu;

    // 5. Tỷ lệ đã thu / tổng
    const tyLeThu = tongTien > 0 ? ((daThu / tongTien) * 100).toFixed(2) : 0;

    // 6. Số hộ đã đóng đủ
    const [hoDaDongDuResult] = await sequelize.query(
      `SELECT COUNT(DISTINCT MaHoKhau) as soHo
       FROM KhoanThuTheoHo
       WHERE MaHoKhau NOT IN (
         SELECT DISTINCT MaHoKhau 
         FROM KhoanThuTheoHo 
         WHERE TrangThai != 'Đã đóng' AND TrangThai != 'da_thu'
       )`
    );
    const soHoDaDongDu = hoDaDongDuResult[0]?.soHo || 0;

    // 7. Số hộ chưa đóng đủ
    const [hoChuaDongDuResult] = await sequelize.query(
      `SELECT COUNT(DISTINCT MaHoKhau) as soHo
       FROM KhoanThuTheoHo
       WHERE TrangThai != 'Đã đóng' AND TrangThai != 'da_thu'`
    );
    const soHoChuaDongDu = hoChuaDongDuResult[0]?.soHo || 0;

    // 8. Thống kê theo đơn vị tính khoản thu
    const [theoLoaiResult] = await sequelize.query(
      `SELECT 
         kt.DonViTinh,
         COUNT(DISTINCT kt.MaKhoanThu) as soKhoanThu,
         IFNULL(SUM(kthk.ThanhTien), 0) as tongTien,
         IFNULL(SUM(CASE WHEN kthk.TrangThai = 'Đã đóng' OR kthk.TrangThai = 'da_thu' THEN kthk.ThanhTien ELSE 0 END), 0) as daThu
       FROM KhoanThu kt
       LEFT JOIN KhoanThuTheoHo kthk ON kt.MaKhoanThu = kthk.MaKhoanThu
       GROUP BY kt.DonViTinh`
    );

    // Hàm chuyển đổi đơn vị tính sang tên hiển thị
    const getDonViTinhLabel = (donViTinh) => {
      switch (donViTinh) {
        case "nhan_khau":
          return "Theo nhân khẩu";
        case "ho_khau":
          return "Theo hộ khẩu";
        case "dien_tich":
          return "Theo diện tích (m²)";
        default:
          return "Khác";
      }
    };

    res.json({
      success: true,
      data: {
        soKhoanThu,
        tongTien,
        daThu,
        canThu,
        tyLeThu: parseFloat(tyLeThu),
        soHoDaDongDu,
        soHoChuaDongDu,
        theoLoai: theoLoaiResult.map((item) => ({
          loai: getDonViTinhLabel(item.DonViTinh),
          donViTinh: item.DonViTinh,
          soKhoanThu: item.soKhoanThu,
          tongTien: item.tongTien,
          daThu: item.daThu,
          canThu: item.tongTien - item.daThu,
        })),
      },
    });
  } catch (error) {
    console.error("Error getting thong ke khoan thu:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Thống kê chi tiết theo từng khoản thu
const getThongKeChiTiet = async (req, res) => {
  try {
    const [result] = await sequelize.query(
      `SELECT 
         kt.MaKhoanThu,
         kt.TenKhoanThu,
         kt.LoaiKhoanThu,
         kt.DonGia,
         kt.DonViTinh,
         COUNT(kthk.MaKhoanThuTheoHo) as soHoApDung,
         IFNULL(SUM(kthk.ThanhTien), 0) as tongTien,
         IFNULL(SUM(CASE WHEN kthk.TrangThai = 'Đã đóng' OR kthk.TrangThai = 'da_thu' THEN kthk.ThanhTien ELSE 0 END), 0) as daThu,
         SUM(CASE WHEN kthk.TrangThai = 'Đã đóng' OR kthk.TrangThai = 'da_thu' THEN 1 ELSE 0 END) as soHoDaDong,
         SUM(CASE WHEN kthk.TrangThai != 'Đã đóng' AND kthk.TrangThai != 'da_thu' THEN 1 ELSE 0 END) as soHoChuaDong
       FROM KhoanThu kt
       LEFT JOIN KhoanThuTheoHo kthk ON kt.MaKhoanThu = kthk.MaKhoanThu
       GROUP BY kt.MaKhoanThu
       ORDER BY kt.MaKhoanThu ASC`
    );

    res.json({
      success: true,
      data: result.map((item) => ({
        ...item,
        loaiKhoanThu: item.LoaiKhoanThu === 1 ? "Định kỳ" : "Một lần",
        canThu: item.tongTien - item.daThu,
        tyLeThu:
          item.tongTien > 0
            ? ((item.daThu / item.tongTien) * 100).toFixed(2)
            : 0,
      })),
    });
  } catch (error) {
    console.error("Error getting thong ke chi tiet:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Thống kê theo hộ khẩu
const getThongKeTheoHo = async (req, res) => {
  try {
    const [result] = await sequelize.query(
      `SELECT 
         hk.MaHoKhau,
         ch.TenCanHo,
         nk.HoTen as ChuHo,
         IFNULL(SUM(kthk.ThanhTien), 0) as tongTien,
         IFNULL(SUM(CASE WHEN kthk.TrangThai = 'Đã đóng' OR kthk.TrangThai = 'da_thu' THEN kthk.ThanhTien ELSE 0 END), 0) as daThu,
         COUNT(kthk.MaKhoanThuTheoHo) as soKhoanThu,
         SUM(CASE WHEN kthk.TrangThai = 'Đã đóng' OR kthk.TrangThai = 'da_thu' THEN 1 ELSE 0 END) as soDaDong,
         SUM(CASE WHEN kthk.TrangThai != 'Đã đóng' AND kthk.TrangThai != 'da_thu' THEN 1 ELSE 0 END) as soChuaDong
       FROM HoKhau hk
       LEFT JOIN CanHo ch ON hk.MaCanHo = ch.MaCanHo
       LEFT JOIN NhanKhau nk ON hk.MaHoKhau = nk.MaHoKhau AND nk.QuanHe = 'chu ho'
       LEFT JOIN KhoanThuTheoHo kthk ON hk.MaHoKhau = kthk.MaHoKhau
       GROUP BY hk.MaHoKhau
       ORDER BY hk.MaHoKhau ASC`
    );

    res.json({
      success: true,
      data: result.map((item) => ({
        ...item,
        canThu: item.tongTien - item.daThu,
        tyLeThu:
          item.tongTien > 0
            ? ((item.daThu / item.tongTien) * 100).toFixed(2)
            : 0,
      })),
    });
  } catch (error) {
    console.error("Error getting thong ke theo ho:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  getThongKeKhoanThu,
  getThongKeChiTiet,
  getThongKeTheoHo,
};
