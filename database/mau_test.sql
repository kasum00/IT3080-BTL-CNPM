SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE HoaDon;
TRUNCATE TABLE TongTienHoKhau;
TRUNCATE TABLE KhoanThuTheoHo;
TRUNCATE TABLE KhoanThu;
TRUNCATE TABLE TamTru;
TRUNCATE TABLE TamVang;
TRUNCATE TABLE NhanKhau;
TRUNCATE TABLE HoKhau;
TRUNCATE TABLE CanHo;
TRUNCATE TABLE TaiKhoan;

SET FOREIGN_KEY_CHECKS = 1;


/* =========================================================
   DATABASE
========================================================= */
CREATE DATABASE IF NOT EXISTS bluemoon
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE bluemoon;

/* =========================================================
   TRIGGER (TRẠNG THÁI CĂN HỘ)
========================================================= */
DELIMITER $$

DROP TRIGGER IF EXISTS trg_add_chu_ho $$
CREATE TRIGGER trg_add_chu_ho
AFTER INSERT ON NhanKhau
FOR EACH ROW
BEGIN
    IF NEW.QuanHe = 'chu ho' THEN
        UPDATE CanHo
        SET TrangThai = 'chu_o'
        WHERE MaHoKhau = NEW.MaHoKhau;
    END IF;
END$$

DROP TRIGGER IF EXISTS trg_add_nguoi_thue $$
CREATE TRIGGER trg_add_nguoi_thue
AFTER INSERT ON NhanKhau
FOR EACH ROW
BEGIN
    IF NEW.QuanHe = 'nguoi thue' THEN
        UPDATE CanHo
        SET TrangThai = 'cho_thue'
        WHERE MaHoKhau = NEW.MaHoKhau;
    END IF;
END$$

DROP TRIGGER IF EXISTS trg_delete_nhan_khau $$
CREATE TRIGGER trg_delete_nhan_khau
AFTER DELETE ON NhanKhau
FOR EACH ROW
BEGIN
    DECLARE so_chu_ho INT DEFAULT 0;
    DECLARE so_nguoi_thue INT DEFAULT 0;

    SELECT COUNT(*) INTO so_chu_ho
    FROM NhanKhau
    WHERE MaHoKhau = OLD.MaHoKhau AND QuanHe = 'chu ho';

    SELECT COUNT(*) INTO so_nguoi_thue
    FROM NhanKhau
    WHERE MaHoKhau = OLD.MaHoKhau AND QuanHe = 'nguoi thue';

    IF so_nguoi_thue > 0 THEN
        UPDATE CanHo SET TrangThai = 'cho_thue'
        WHERE MaHoKhau = OLD.MaHoKhau;
    ELSEIF so_chu_ho > 0 THEN
        UPDATE CanHo SET TrangThai = 'chu_o'
        WHERE MaHoKhau = OLD.MaHoKhau;
    ELSE
        UPDATE CanHo SET TrangThai = 'trong'
        WHERE MaHoKhau = OLD.MaHoKhau;
    END IF;
END$$

DELIMITER ;

/* =========================================================
   SEED CĂN HỘ – 5 TÒA A–E (100 CĂN)
========================================================= */
INSERT INTO CanHo (TenCanHo, Tang, DienTich, MoTa)
SELECT 
    CONCAT(t.toa, LPAD(c.stt, 2, '0')),
    CONCAT('Tầng ', FLOOR((c.stt-1)/4)+1),
    60,
    CONCAT('Căn hộ tòa ', t.toa)
FROM (
    SELECT 'A' toa UNION ALL SELECT 'B' UNION ALL
    SELECT 'C' UNION ALL SELECT 'D' UNION ALL SELECT 'E'
) t
JOIN (
    SELECT 1 stt UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL
    SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL
    SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12 UNION ALL
    SELECT 13 UNION ALL SELECT 14 UNION ALL SELECT 15 UNION ALL SELECT 16 UNION ALL
    SELECT 17 UNION ALL SELECT 18 UNION ALL SELECT 19 UNION ALL SELECT 20
) c;

/* =========================================================
   SEED HỘ KHẨU (1 CĂN = 1 HỘ)
========================================================= */
INSERT INTO HoKhau (MaHoKhau, MaCanHo, DiaChiThuongTru, NoiCap, NgayCap)
SELECT 
    CONCAT('HK', LPAD(MaCanHo, 4, '0')),
    MaCanHo,
    CONCAT('Chung cư BlueMoon - ', TenCanHo),
    'Hà Nội',
    '2023-01-01'
FROM CanHo;

UPDATE CanHo
SET MaHoKhau = CONCAT('HK', LPAD(MaCanHo, 4, '0'))
WHERE MaCanHo > 0;

/* =========================================================
   SEED NHÂN KHẨU – 5 NGƯỜI / HỘ (≈ 500 NGƯỜI)
========================================================= */
DELIMITER $$

DROP PROCEDURE IF EXISTS seed_nhan_khau $$
CREATE PROCEDURE seed_nhan_khau()
BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE hk VARCHAR(10);

    DECLARE cur CURSOR FOR
        SELECT MaHoKhau FROM HoKhau;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    OPEN cur;

    read_loop: LOOP
        FETCH cur INTO hk;
        IF done = 1 THEN
            LEAVE read_loop;
        END IF;

        INSERT INTO NhanKhau
        (MaHoKhau, HoTen, CanCuocCongDan, NgaySinh, NoiSinh, DanToc, NgheNghiep, QuanHe)
        VALUES
        (hk, CONCAT('Chủ hộ ', hk), CONCAT('CC', hk, '01'),
         '1980-01-01', 'Hà Nội', 'Kinh', 'Kinh doanh', 'chu ho'),

        (hk, CONCAT('Vợ ', hk), CONCAT('CC', hk, '02'),
         '1985-02-02', 'Hà Nội', 'Kinh', 'Nhân viên', 'vo'),

        (hk, CONCAT('Con ', hk), CONCAT('CC', hk, '03'),
         '2010-03-03', 'Hà Nội', 'Kinh', 'Học sinh', 'con'),

        (hk, CONCAT('Người thuê 1 ', hk), CONCAT('CC', hk, '04'),
         '1995-04-04', 'Nam Định', 'Kinh', 'Sinh viên', 'nguoi thue'),

        (hk, CONCAT('Người thuê 2 ', hk), CONCAT('CC', hk, '05'),
         '1997-05-05', 'Thái Bình', 'Kinh', 'Sinh viên', 'nguoi thue');
    END LOOP;

    CLOSE cur;
END$$

DELIMITER ;

CALL seed_nhan_khau();

/* =========================================================
   SEED KHOẢN THU
========================================================= */
INSERT INTO KhoanThu
(TenKhoanThu, LoaiKhoanThu, ThoiGianBatDau, ThoiGianKetThuc, DonViTinh, DonGia, ChiTiet, GhiChu)
VALUES
('Phí vệ sinh', 'Định kỳ', '2024-01-01', '2024-12-31', 'nhan_khau', 20000, 'Phí vệ sinh chung theo số nhân khẩu', 'Thu hàng tháng'),
('Phí an ninh', 'Định kỳ', '2024-01-01', '2024-12-31', 'ho_khau', 50000, 'Phí bảo vệ an ninh khu vực', 'Thu hàng tháng'),
('Quỹ bảo trì', 'Một lần', '2024-01-01', '2024-12-31', 'ho_khau', 2000000, 'Quỹ bảo trì cơ sở hạ tầng', 'Thu một lần trong năm');

/* =========================================================
   SEED KHOẢN THU THEO HỘ
========================================================= */

-- Phí vệ sinh: theo NHÂN KHẨU
INSERT INTO KhoanThuTheoHo (MaKhoanThu, MaHoKhau, SoLuong, ThanhTien)
SELECT 
    1,
    hk.MaHoKhau,
    COUNT(nk.MaNhanKhau),
    COUNT(nk.MaNhanKhau) * 20000
FROM HoKhau hk
JOIN NhanKhau nk ON hk.MaHoKhau = nk.MaHoKhau
GROUP BY hk.MaHoKhau;

-- Phí an ninh: theo HỘ KHẨU
INSERT INTO KhoanThuTheoHo (MaKhoanThu, MaHoKhau, SoLuong, ThanhTien)
SELECT 
    2,
    MaHoKhau,
    1,
    50000
FROM HoKhau;

-- Quỹ bảo trì: theo HỘ KHẨU (1 lần)
INSERT INTO KhoanThuTheoHo (MaKhoanThu, MaHoKhau, SoLuong, ThanhTien)
SELECT 
    3,
    MaHoKhau,
    1,
    2000000
FROM HoKhau;

/* =========================================================
   SEED TỔNG TIỀN HỘ KHẨU
========================================================= */
INSERT INTO TongTienHoKhau (MaHoKhau, TongTien, TongDaNop, TongConThieu)
SELECT 
    hk.MaHoKhau,
    COALESCE(SUM(kthh.ThanhTien), 0) as TongTien,
    0 as TongDaNop,
    COALESCE(SUM(kthh.ThanhTien), 0) as TongConThieu
FROM HoKhau hk
LEFT JOIN KhoanThuTheoHo kthh ON hk.MaHoKhau = kthh.MaHoKhau
GROUP BY hk.MaHoKhau;

/* =========================================================
   SEED TÀI KHOẢN
========================================================= */
-- tài khoản test -- password đều là 123456
INSERT INTO TaiKhoan (Username, Password, VaiTro, TrangThai) VALUES
('admin',        '$2b$10$testhashadmin', 'admin', 1),
('manager',      '$2b$10$testhashmanager', 'ban_quan_ly', 1),
('cudan_hk0001', '$2b$10$testhashcudan', 'cu_dan', 1),
('cudan_hk0002', '$2b$10$testhashcudan', 'cu_dan', 1),
('cudan_hk0003', '$2b$10$testhashcudan', 'cu_dan', 1);

/* =========================================================
   LIÊN KẾT NHÂN KHẨU VỚI TÀI KHOẢN
========================================================= */
SET SQL_SAFE_UPDATES = 0;

UPDATE NhanKhau nk
JOIN HoKhau hk ON nk.MaHoKhau = hk.MaHoKhau
JOIN TaiKhoan tk ON tk.Username = CONCAT('cudan_', LOWER(hk.MaHoKhau))
SET nk.MaTaiKhoan = tk.MaTaiKhoan
WHERE nk.QuanHe = 'chu ho'
  AND tk.VaiTro = 'cu_dan';

SET SQL_SAFE_UPDATES = 1;