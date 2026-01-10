const sequelize = require("../config/db");

// Debug: Kiểm tra giá trị TrangThai thực tế trong database
const debugTrangThai = async (req, res) => {
  try {
    const [result] = await sequelize.query(
      `SELECT DISTINCT TrangThai, COUNT(*) as count FROM KhoanThuTheoHo GROUP BY TrangThai`
    );
    console.log("=== DEBUG TrangThai values ===");
    console.log(result);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Debug error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

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

    // 3. Số tiền đã thu (chỉ tính trạng thái = 'da_thu' - được set khi thanh toán qua hệ thống)
    const [daThuResult] = await sequelize.query(
      `SELECT IFNULL(SUM(ThanhTien), 0) as daThu 
       FROM KhoanThuTheoHo 
       WHERE LOWER(TrangThai) = 'da_thu'`
    );
    const daThu = daThuResult[0]?.daThu || 0;

    // 4. Số tiền cần thu (chưa đóng)
    const canThu = tongTien - daThu;

    // 5. Tỷ lệ đã thu / tổng
    const tyLeThu = tongTien > 0 ? ((daThu / tongTien) * 100).toFixed(2) : 0;

    // 6. Số hộ đã đóng đủ (tất cả khoản thu của hộ đều có TrangThai = 'da_thu')
    const [hoDaDongDuResult] = await sequelize.query(
      `SELECT COUNT(DISTINCT MaHoKhau) as soHo
       FROM HoKhau hk
       WHERE NOT EXISTS (
         SELECT 1 
         FROM KhoanThuTheoHo kthk 
         WHERE kthk.MaHoKhau = hk.MaHoKhau 
         AND LOWER(kthk.TrangThai) != 'da_thu'
       )
       AND EXISTS (
         SELECT 1 
         FROM KhoanThuTheoHo kthk2 
         WHERE kthk2.MaHoKhau = hk.MaHoKhau
       )`
    );
    const soHoDaDongDu = hoDaDongDuResult[0]?.soHo || 0;

    // 7. Số hộ chưa đóng đủ (có ít nhất 1 khoản thu chưa có TrangThai = 'da_thu')
    const [hoChuaDongDuResult] = await sequelize.query(
      `SELECT COUNT(DISTINCT MaHoKhau) as soHo
       FROM KhoanThuTheoHo
       WHERE LOWER(TrangThai) != 'da_thu' OR TrangThai IS NULL`
    );
    const soHoChuaDongDu = hoChuaDongDuResult[0]?.soHo || 0;

    // 7.1. Tổng số hộ có khoản thu (để hiển thị chính xác)
    const [tongSoHoResult] = await sequelize.query(
      `SELECT COUNT(DISTINCT MaHoKhau) as tongSoHo FROM KhoanThuTheoHo`
    );
    const tongSoHo = tongSoHoResult[0]?.tongSoHo || 0;

    // 8. Thống kê theo đơn vị tính khoản thu
    const [theoLoaiResult] = await sequelize.query(
      `SELECT 
         kt.DonViTinh,
         COUNT(DISTINCT kt.MaKhoanThu) as soKhoanThu,
         IFNULL(SUM(kthk.ThanhTien), 0) as tongTien,
         IFNULL(SUM(CASE WHEN LOWER(kthk.TrangThai) = 'da_thu' THEN kthk.ThanhTien ELSE 0 END), 0) as daThu
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
        tongSoHo,
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
         IFNULL(SUM(CASE WHEN LOWER(kthk.TrangThai) = 'da_thu' THEN kthk.ThanhTien ELSE 0 END), 0) as daThu,
         SUM(CASE WHEN LOWER(kthk.TrangThai) = 'da_thu' THEN 1 ELSE 0 END) as soHoDaDong,
         SUM(CASE WHEN LOWER(kthk.TrangThai) != 'da_thu' OR kthk.TrangThai IS NULL THEN 1 ELSE 0 END) as soHoChuaDong
       FROM KhoanThu kt
       LEFT JOIN KhoanThuTheoHo kthk ON kt.MaKhoanThu = kthk.MaKhoanThu
       GROUP BY kt.MaKhoanThu
       ORDER BY kt.MaKhoanThu ASC`
    );

    res.json({
      success: true,
      data: result.map((item) => {
        // Xử lý loại khoản thu - có thể là số hoặc string từ database
        let loaiKhoanThuLabel = "Một lần";
        if (
          item.LoaiKhoanThu === 1 ||
          item.LoaiKhoanThu === "1" ||
          item.LoaiKhoanThu === "Định kỳ"
        ) {
          loaiKhoanThuLabel = "Định kỳ";
        }

        return {
          ...item,
          loaiKhoanThu: loaiKhoanThuLabel,
          canThu: item.tongTien - item.daThu,
          // Tỷ lệ thanh toán = tiền đã thu / tổng tiền (nhất quán với tổng quan)
          tyLeThu:
            item.tongTien > 0
              ? ((item.daThu / item.tongTien) * 100).toFixed(2)
              : 0,
        };
      }),
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
         IFNULL(SUM(CASE WHEN LOWER(kthk.TrangThai) = 'da_thu' THEN kthk.ThanhTien ELSE 0 END), 0) as daThu,
         COUNT(kthk.MaKhoanThuTheoHo) as soKhoanThu,
         SUM(CASE WHEN LOWER(kthk.TrangThai) = 'da_thu' THEN 1 ELSE 0 END) as soDaDong,
         SUM(CASE WHEN LOWER(kthk.TrangThai) != 'da_thu' OR kthk.TrangThai IS NULL THEN 1 ELSE 0 END) as soChuaDong
       FROM HoKhau hk
       LEFT JOIN CanHo ch ON hk.MaHoKhau = ch.MaHoKhau
       LEFT JOIN NhanKhau nk ON hk.MaHoKhau = nk.MaHoKhau AND LOWER(nk.QuanHe) = 'chu ho'
       LEFT JOIN KhoanThuTheoHo kthk ON hk.MaHoKhau = kthk.MaHoKhau
       GROUP BY 
        hk.MaHoKhau,                                         
        ch.TenCanHo,
        nk.HoTen
       ORDER BY hk.MaHoKhau ASC`
    );

    res.json({
      success: true,
      data: result.map((item) => ({
        ...item,
        soKhoanThu: parseInt(item.soKhoanThu) || 0,
        soDaDong: parseInt(item.soDaDong) || 0,
        soChuaDong: parseInt(item.soChuaDong) || 0,
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
  debugTrangThai,
};
