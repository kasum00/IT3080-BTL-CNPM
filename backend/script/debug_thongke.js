require("dotenv").config();
const sequelize = require("../src/config/db");

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected!\n");

    // Test UPPER function
    const [upperTest] = await sequelize.query(
      `SELECT UPPER('da_thu') as up, LOWER('ĐÃ ĐÓNG') as low`
    );
    console.log(
      "0. UPPER('da_thu') =",
      upperTest[0].up,
      ", LOWER('ĐÃ ĐÓNG') =",
      upperTest[0].low
    );

    // 1. Tổng tiền
    const [tongTien] = await sequelize.query(
      `SELECT IFNULL(SUM(ThanhTien), 0) as total FROM KhoanThuTheoHo`
    );
    console.log("1. Tong tien:", tongTien);

    // 2. Đã thu - query hiện tại
    const [daThu1] = await sequelize.query(
      `SELECT IFNULL(SUM(ThanhTien), 0) as total 
       FROM KhoanThuTheoHo 
       WHERE UPPER(TrangThai) = 'ĐÃ ĐÓNG' OR LOWER(TrangThai) = 'da_thu'`
    );
    console.log(
      "2. Da thu (query hien tai - UPPER = 'ĐÃ ĐÓNG' OR LOWER = 'da_thu'):",
      daThu1
    );

    // 3. Đã thu - so sánh trực tiếp
    const [daThu2] = await sequelize.query(
      `SELECT IFNULL(SUM(ThanhTien), 0) as total 
       FROM KhoanThuTheoHo 
       WHERE TrangThai IN ('ĐÃ ĐÓNG', 'da_thu')`
    );
    console.log("3. Da thu (TrangThai IN - chinh xac):", daThu2);

    // 4. Đã thu - dùng UPPER IN
    const [daThu3] = await sequelize.query(
      `SELECT IFNULL(SUM(ThanhTien), 0) as total 
       FROM KhoanThuTheoHo 
       WHERE UPPER(TrangThai) IN ('ĐÃ ĐÓNG', 'DA_THU')`
    );
    console.log(
      "4. Da thu (UPPER IN - sai vi UPPER('da_thu')='DA_THU' != 'ĐÃ ĐÓNG'):",
      daThu3
    );

    // 5. Chi tiết từng loại TrangThai
    const [chiTiet] = await sequelize.query(
      `SELECT TrangThai, SUM(ThanhTien) as tong, COUNT(*) as soLuong
       FROM KhoanThuTheoHo 
       GROUP BY TrangThai`
    );
    console.log("\n5. Chi tiet theo TrangThai:");
    chiTiet.forEach((r) =>
      console.log(
        `   - '${r.TrangThai}': ${r.soLuong} records, tong = ${r.tong}`
      )
    );

    // 6. Kiểm tra query theoLoai - CHỈ TÍNH da_thu
    const [theoLoai] = await sequelize.query(
      `SELECT 
         kt.DonViTinh,
         COUNT(DISTINCT kt.MaKhoanThu) as soKhoanThu,
         IFNULL(SUM(kthk.ThanhTien), 0) as tongTien,
         IFNULL(SUM(CASE WHEN LOWER(kthk.TrangThai) = 'da_thu' THEN kthk.ThanhTien ELSE 0 END), 0) as daThu
       FROM KhoanThu kt
       LEFT JOIN KhoanThuTheoHo kthk ON kt.MaKhoanThu = kthk.MaKhoanThu
       GROUP BY kt.DonViTinh`
    );
    console.log("\n6. Theo loai (CHI TINH da_thu):");
    theoLoai.forEach((r) =>
      console.log(
        `   - ${r.DonViTinh}: tongTien=${r.tongTien}, daThu=${r.daThu}`
      )
    );

    // 7. Test query tổng quan mới
    const [daThuMoi] = await sequelize.query(
      `SELECT IFNULL(SUM(ThanhTien), 0) as total 
       FROM KhoanThuTheoHo 
       WHERE LOWER(TrangThai) = 'da_thu'`
    );
    console.log("\n7. Da thu MOI (chi tinh da_thu):", daThuMoi);

    process.exit(0);
  } catch (e) {
    console.error("Error:", e.message);
    process.exit(1);
  }
})();
