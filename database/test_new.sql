-- ⚠️ Dữ liệu test đã được cập nhật phù hợp với schema mới
-- Bao gồm: TaiKhoan, HoaDon, TongTienHoKhau

-- Thiết lập charset cho kết nối
SET NAMES 'utf8mb4';
SET CHARACTER_SET_CLIENT = utf8mb4;
SET CHARACTER_SET_CONNECTION = utf8mb4;
SET CHARACTER_SET_RESULTS = utf8mb4;

USE bluemoon;

-- Tắt safe update mode
SET SQL_SAFE_UPDATES = 0;

-- Xóa dữ liệu cũ nếu có (theo thứ tự ngược lại với foreign key)
DELETE FROM HoaDon;
DELETE FROM TongTienHoKhau;
DELETE FROM KhoanThuTheoHo;
DELETE FROM TamVang;
DELETE FROM TamTru;
DELETE FROM NhanKhau;
DELETE FROM KhoanThu;
DELETE FROM HoKhau;
DELETE FROM CanHo;
DELETE FROM TaiKhoan;

-- Reset auto_increment
ALTER TABLE CanHo AUTO_INCREMENT = 1;
ALTER TABLE NhanKhau AUTO_INCREMENT = 1;
ALTER TABLE TamTru AUTO_INCREMENT = 1;
ALTER TABLE TamVang AUTO_INCREMENT = 1;
ALTER TABLE KhoanThu AUTO_INCREMENT = 1;
ALTER TABLE KhoanThuTheoHo AUTO_INCREMENT = 1;
ALTER TABLE HoaDon AUTO_INCREMENT = 1;
ALTER TABLE TaiKhoan AUTO_INCREMENT = 1;

-- ============================================
-- 1. THÊM TÀI KHOẢN
-- ============================================
-- Password mặc định cho tất cả: "123456" (đã hash bằng bcrypt)
-- Hash: $2b$10$abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJK

INSERT INTO TaiKhoan (Username, Password, VaiTro, TrangThai) VALUES
-- Admin
('admin', '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJK', 'admin', 1),

-- Ban quản lý
('quanly01', '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJK', 'ban_quan_ly', 1),
('quanly02', '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJK', 'ban_quan_ly', 1),

-- Cư dân (mỗi hộ khẩu có 1 tài khoản)
('cudan_hk001', '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJK', 'cu_dan', 1),
('cudan_hk002', '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJK', 'cu_dan', 1),
('cudan_hk003', '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJK', 'cu_dan', 1),
('cudan_hk004', '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJK', 'cu_dan', 1),
('cudan_hk005', '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJK', 'cu_dan', 1),
('cudan_hk006', '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJK', 'cu_dan', 1),
('cudan_hk007', '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJK', 'cu_dan', 1),
('cudan_hk008', '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJK', 'cu_dan', 1);

-- ============================================
-- 2. THÊM CĂN HỘ
-- ============================================
INSERT INTO CanHo (TenCanHo, Tang, DienTich, TrangThai, MoTa) VALUES
('Căn hộ A101', 'Tầng 1', 65.5, 'chu_o', 'Căn hộ 2 phòng ngủ, view công viên'),
('Căn hộ A102', 'Tầng 1', 75.0, 'chu_o', 'Căn hộ 3 phòng ngủ, có ban công'),
('Căn hộ A201', 'Tầng 2', 65.5, 'chu_o', 'Căn hộ 2 phòng ngủ'),
('Căn hộ A202', 'Tầng 2', 80.0, 'chu_o', 'Căn hộ 3 phòng ngủ, view thành phố'),
('Căn hộ B101', 'Tầng 1', 55.0, 'chu_o', 'Căn hộ 1 phòng ngủ'),
('Căn hộ B102', 'Tầng 1', 70.0, 'cho_thue', 'Căn hộ 2 phòng ngủ, đang cho thuê'),
('Căn hộ B201', 'Tầng 2', 65.5, 'trong', 'Căn hộ trống, sẵn sàng bán'),
('Căn hộ B202', 'Tầng 2', 75.0, 'trong', 'Căn hộ trống'),
('Căn hộ C101', 'Tầng 1', 90.0, 'chu_o', 'Căn hộ 4 phòng ngủ, cao cấp'),
('Căn hộ C201', 'Tầng 2', 85.0, 'chu_o', 'Căn hộ 3 phòng ngủ, view đẹp');

-- ============================================
-- 3. THÊM HỘ KHẨU
-- ============================================
INSERT INTO HoKhau (MaHoKhau, MaCanHo, DiaChiThuongTru, NoiCap, NgayCap) 
SELECT 'HK001', MaCanHo, 'Căn hộ A101, Chung cư Sunrise, Quận 1, TP.HCM', 'Công an Quận 1', '2020-03-15'
FROM CanHo WHERE TenCanHo = 'Căn hộ A101';

INSERT INTO HoKhau (MaHoKhau, MaCanHo, DiaChiThuongTru, NoiCap, NgayCap) 
SELECT 'HK002', MaCanHo, 'Căn hộ A102, Chung cư Sunrise, Quận 1, TP.HCM', 'Công an Quận 1', '2020-06-20'
FROM CanHo WHERE TenCanHo = 'Căn hộ A102';

INSERT INTO HoKhau (MaHoKhau, MaCanHo, DiaChiThuongTru, NoiCap, NgayCap) 
SELECT 'HK003', MaCanHo, 'Căn hộ A201, Chung cư Sunrise, Quận 1, TP.HCM', 'Công an Quận 1', '2021-01-10'
FROM CanHo WHERE TenCanHo = 'Căn hộ A201';

INSERT INTO HoKhau (MaHoKhau, MaCanHo, DiaChiThuongTru, NoiCap, NgayCap) 
SELECT 'HK004', MaCanHo, 'Căn hộ A202, Chung cư Sunrise, Quận 1, TP.HCM', 'Công an Quận 1', '2021-05-08'
FROM CanHo WHERE TenCanHo = 'Căn hộ A202';

INSERT INTO HoKhau (MaHoKhau, MaCanHo, DiaChiThuongTru, NoiCap, NgayCap) 
SELECT 'HK005', MaCanHo, 'Căn hộ B101, Chung cư Sunrise, Quận 1, TP.HCM', 'Công an Quận 1', '2021-09-25'
FROM CanHo WHERE TenCanHo = 'Căn hộ B101';

INSERT INTO HoKhau (MaHoKhau, MaCanHo, DiaChiThuongTru, NoiCap, NgayCap) 
SELECT 'HK006', MaCanHo, 'Căn hộ B102, Chung cư Sunrise, Quận 1, TP.HCM', 'Công an Quận 1', '2022-02-14'
FROM CanHo WHERE TenCanHo = 'Căn hộ B102';

INSERT INTO HoKhau (MaHoKhau, MaCanHo, DiaChiThuongTru, NoiCap, NgayCap) 
SELECT 'HK007', MaCanHo, 'Căn hộ C101, Chung cư Sunrise, Quận 1, TP.HCM', 'Công an Quận 1', '2022-07-30'
FROM CanHo WHERE TenCanHo = 'Căn hộ C101';

INSERT INTO HoKhau (MaHoKhau, MaCanHo, DiaChiThuongTru, NoiCap, NgayCap) 
SELECT 'HK008', MaCanHo, 'Căn hộ C201, Chung cư Sunrise, Quận 1, TP.HCM', 'Công an Quận 1', '2023-01-12'
FROM CanHo WHERE TenCanHo = 'Căn hộ C201';

-- Update MaHoKhau cho bảng CanHo
UPDATE CanHo c 
JOIN HoKhau h ON c.MaCanHo = h.MaCanHo 
SET c.MaHoKhau = h.MaHoKhau;

-- ============================================
-- 4. THÊM NHÂN KHẨU
-- ============================================
INSERT INTO NhanKhau (MaHoKhau, HoTen, CanCuocCongDan, NgaySinh, NoiSinh, DanToc, NgheNghiep, QuanHe, GhiChu, TrangThai) VALUES
-- HK001 (4 người)
('HK001', 'Nguyễn Văn An', '001088001234', '1988-05-15', 'Hà Nội', 'Kinh', 'Kỹ sư', 'chu ho', NULL, 1),
('HK001', 'Trần Thị Bích', '001090002345', '1990-08-20', 'TP.HCM', 'Kinh', 'Giáo viên', 'vo', NULL, 1),
('HK001', 'Nguyễn Văn Minh', '001012003456', '2012-03-10', 'TP.HCM', 'Kinh', 'Học sinh', 'con', NULL, 1),
('HK001', 'Nguyễn Thị Hoa', '001015004567', '2015-11-25', 'TP.HCM', 'Kinh', 'Học sinh', 'con', NULL, 1),

-- HK002 (3 người)
('HK002', 'Phạm Đức Thắng', '001085005678', '1985-02-12', 'Đà Nẵng', 'Kinh', 'Bác sĩ', 'chu ho', NULL, 1),
('HK002', 'Lê Thị Mai', '001087006789', '1987-06-18', 'Huế', 'Kinh', 'Y tá', 'vo', NULL, 1),
('HK002', 'Phạm Thị Lan', '001010007890', '2010-09-05', 'TP.HCM', 'Kinh', 'Học sinh', 'con', NULL, 1),

-- HK003 (5 người)
('HK003', 'Hoàng Văn Hùng', '001082008901', '1982-12-30', 'Hải Phòng', 'Kinh', 'Kinh doanh', 'chu ho', NULL, 1),
('HK003', 'Nguyễn Thị Thu', '001084009012', '1984-04-22', 'Hà Nội', 'Kinh', 'Kế toán', 'vo', NULL, 1),
('HK003', 'Hoàng Văn Nam', '001008001123', '2008-07-14', 'TP.HCM', 'Kinh', 'Học sinh', 'con', NULL, 1),
('HK003', 'Hoàng Thị Ngọc', '001011002234', '2011-01-08', 'TP.HCM', 'Kinh', 'Học sinh', 'con', NULL, 1),
('HK003', 'Hoàng Văn Tuấn', '001014003345', '2014-05-19', 'TP.HCM', 'Kinh', 'Học sinh', 'con', NULL, 1),

-- HK004 (2 người)
('HK004', 'Trần Quốc Toàn', '001078004456', '1978-11-11', 'Cần Thơ', 'Kinh', 'Luật sư', 'chu ho', NULL, 1),
('HK004', 'Vũ Thị Hằng', '001080005567', '1980-03-25', 'Vũng Tàu', 'Kinh', 'Kiến trúc sư', 'vo', NULL, 1),

-- HK005 (4 người)
('HK005', 'Đặng Minh Tuấn', '001092006678', '1992-09-07', 'Nha Trang', 'Kinh', 'Lập trình viên', 'chu ho', NULL, 1),
('HK005', 'Phạm Thị Linh', '001093007789', '1993-12-14', 'TP.HCM', 'Kinh', 'Designer', 'vo', NULL, 1),
('HK005', 'Đặng Minh Châu', '001018008890', '2018-06-30', 'TP.HCM', 'Kinh', 'Mẫu giáo', 'con', NULL, 1),
('HK005', 'Nguyễn Văn Hải', '001095009901', '1995-02-28', 'Hà Nội', 'Kinh', 'Sinh viên', 'nguoi thue', NULL, 1),

-- HK006 (5 người)
('HK006', 'Lý Thanh Sơn', '001086000012', '1986-07-03', 'Quy Nhơn', 'Kinh', 'Nhà báo', 'chu ho', NULL, 1),
('HK006', 'Ngô Thị Tuyết', '001088001123', '1988-10-16', 'Đà Lạt', 'Kinh', 'Biên tập viên', 'vo', NULL, 1),
('HK006', 'Lý Thanh Long', '001009002534', '2009-04-21', 'TP.HCM', 'Kinh', 'Học sinh', 'con', NULL, 1),
('HK006', 'Lý Thị Hương', '001013003345', '2013-08-12', 'TP.HCM', 'Kinh', 'Học sinh', 'con', NULL, 1),
('HK006', 'Lý Thanh Tùng', '001016004456', '2016-12-05', 'TP.HCM', 'Kinh', 'Học sinh', 'con', NULL, 1),

-- HK007 (4 người)
('HK007', 'Bùi Văn Đức', '001083005567', '1983-01-19', 'Vinh', 'Kinh', 'Doanh nhân', 'chu ho', NULL, 1),
('HK007', 'Đỗ Thị Hạnh', '001085006678', '1985-05-27', 'Hà Nội', 'Kinh', 'Quản lý', 'vo', NULL, 1),
('HK007', 'Bùi Văn Khoa', '001007007789', '2007-11-09', 'TP.HCM', 'Kinh', 'Học sinh', 'con', NULL, 1),
('HK007', 'Trần Thị Lan', '001096008890', '1996-03-15', 'Hải Dương', 'Kinh', 'Nhân viên văn phòng', 'nguoi thue', NULL, 1),

-- HK008 (4 người)
('HK008', 'Võ Minh Quân', '001081009901', '1981-08-08', 'Biên Hòa', 'Kinh', 'Giám đốc', 'chu ho', NULL, 1),
('HK008', 'Trương Thị Ánh', '001083000012', '1983-02-14', 'TP.HCM', 'Kinh', 'Dược sĩ', 'vo', NULL, 1),
('HK008', 'Võ Minh Anh', '001006001123', '2006-10-20', 'TP.HCM', 'Kinh', 'Học sinh', 'con', NULL, 1),
('HK008', 'Võ Minh Đức', '001009002239', '2009-04-30', 'TP.HCM', 'Kinh', 'Học sinh', 'con', NULL, 1);

-- Liên kết tài khoản cho chủ hộ
-- UPDATE NhanKhau nk
-- JOIN HoKhau hk ON nk.MaHoKhau = hk.MaHoKhau
-- JOIN TaiKhoan tk ON tk.Username = CONCAT('cudan_', LOWER(hk.MaHoKhau))
-- SET nk.MaTaiKhoan = tk.MaTaiKhoan
-- WHERE nk.QuanHe = 'chu ho' AND tk.VaiTro = 'cu_dan';

-- ============================================
-- 5. THÊM KHOẢN THU
-- ============================================
INSERT INTO KhoanThu (TenKhoanThu, LoaiKhoanThu, ThoiGianBatDau, ThoiGianKetThuc, DonViTinh, DonGia, ChiTiet, GhiChu) VALUES
('Phí quản lý chung cư', 'Định kỳ', '2024-01-01', '2024-12-31', 'ho_khau', 15000, 'Phí quản lý 15,000đ/m2/tháng', 'Thu hàng tháng'),
('Phí dịch vụ', 'Định kỳ', '2024-01-01', '2024-12-31', 'nhan_khau', 50000, 'Phí dịch vụ 50,000đ/người/tháng', 'Thu hàng tháng'),
('Tiền điện', 'Định kỳ', '2024-01-01', '2024-12-31', 'ho_khau', 3500, 'Giá điện 3,500đ/kWh', 'Tính theo số điện tiêu thụ'),
('Tiền nước', 'Định kỳ', '2024-01-01', '2024-12-31', 'ho_khau', 25000, 'Giá nước 25,000đ/m3', 'Tính theo số nước tiêu thụ'),
('Phí gửi xe máy', 'Định kỳ', '2024-01-01', '2024-12-31', 'ho_khau', 100000, 'Phí gửi xe 100,000đ/xe/tháng', 'Thu hàng tháng'),
('Phí gửi xe ô tô', 'Định kỳ', '2024-01-01', '2024-12-31', 'ho_khau', 1200000, 'Phí gửi xe 1,200,000đ/xe/tháng', 'Thu hàng tháng'),
('Quỹ bảo trì', 'Một lần', '2024-03-01', '2024-03-31', 'ho_khau', 500000, 'Đóng góp quỹ bảo trì năm 2024', 'Thu một lần trong năm'),
('Tết Trung Thu', 'Một lần', '2024-09-01', '2024-09-15', 'nhan_khau', 50000, 'Quỹ tổ chức Tết Trung Thu cho trẻ em', 'Thu một lần'),
('Phí vệ sinh', 'Định kỳ', '2024-01-01', '2024-12-31', 'ho_khau', 30000, 'Phí vệ sinh 30,000đ/hộ/tháng', 'Thu hàng tháng'),
('Internet', 'Định kỳ', '2024-01-01', '2024-12-31', 'ho_khau', 200000, 'Phí Internet 200,000đ/hộ/tháng', 'Tùy chọn đăng ký');

-- ============================================
-- 6. THÊM KHOẢN THU THEO HỘ
-- ============================================
-- Phí quản lý chung cư (tính theo diện tích)
INSERT INTO KhoanThuTheoHo (MaKhoanThu, MaHoKhau, SoLuong, ThanhTien, TrangThai) VALUES
(1, 'HK001', 66, 990000, 'ĐÃ ĐÓNG'),
(1, 'HK002', 75, 1125000, 'ĐÃ ĐÓNG'),
(1, 'HK003', 66, 990000, 'ĐÃ ĐÓNG'),
(1, 'HK004', 80, 1200000, 'CHƯA ĐÓNG'),
(1, 'HK005', 55, 825000, 'ĐÃ ĐÓNG'),
(1, 'HK006', 70, 1050000, 'CHƯA ĐÓNG'),
(1, 'HK007', 90, 1350000, 'ĐÃ ĐÓNG'),
(1, 'HK008', 85, 1275000, 'ĐÃ ĐÓNG');

-- Phí dịch vụ (tính theo số nhân khẩu)
INSERT INTO KhoanThuTheoHo (MaKhoanThu, MaHoKhau, SoLuong, ThanhTien, TrangThai) VALUES
(2, 'HK001', 4, 200000, 'ĐÃ ĐÓNG'),
(2, 'HK002', 3, 150000, 'ĐÃ ĐÓNG'),
(2, 'HK003', 5, 250000, 'ĐÃ ĐÓNG'),
(2, 'HK004', 2, 100000, 'CHƯA ĐÓNG'),
(2, 'HK005', 4, 200000, 'ĐÃ ĐÓNG'),
(2, 'HK006', 5, 250000, 'CHƯA ĐÓNG'),
(2, 'HK007', 4, 200000, 'ĐÃ ĐÓNG'),
(2, 'HK008', 4, 200000, 'ĐÃ ĐÓNG');

-- Tiền điện (tính theo số kWh)
INSERT INTO KhoanThuTheoHo (MaKhoanThu, MaHoKhau, SoLuong, ThanhTien, TrangThai) VALUES
(3, 'HK001', 150, 525000, 'ĐÃ ĐÓNG'),
(3, 'HK002', 200, 700000, 'ĐÃ ĐÓNG'),
(3, 'HK003', 120, 420000, 'ĐÃ ĐÓNG'),
(3, 'HK004', 180, 630000, 'CHƯA ĐÓNG'),
(3, 'HK005', 100, 350000, 'ĐÃ ĐÓNG'),
(3, 'HK006', 140, 490000, 'CHƯA ĐÓNG'),
(3, 'HK007', 250, 875000, 'ĐÃ ĐÓNG'),
(3, 'HK008', 190, 665000, 'ĐÃ ĐÓNG');

-- Tiền nước (tính theo m3)
INSERT INTO KhoanThuTheoHo (MaKhoanThu, MaHoKhau, SoLuong, ThanhTien, TrangThai) VALUES
(4, 'HK001', 12, 300000, 'ĐÃ ĐÓNG'),
(4, 'HK002', 15, 375000, 'ĐÃ ĐÓNG'),
(4, 'HK003', 10, 250000, 'ĐÃ ĐÓNG'),
(4, 'HK004', 14, 350000, 'CHƯA ĐÓNG'),
(4, 'HK005', 8, 200000, 'ĐÃ ĐÓNG'),
(4, 'HK006', 11, 275000, 'CHƯA ĐÓNG'),
(4, 'HK007', 18, 450000, 'ĐÃ ĐÓNG'),
(4, 'HK008', 13, 325000, 'ĐÃ ĐÓNG');

-- Phí gửi xe máy
INSERT INTO KhoanThuTheoHo (MaKhoanThu, MaHoKhau, SoLuong, ThanhTien, TrangThai) VALUES
(5, 'HK001', 2, 200000, 'ĐÃ ĐÓNG'),
(5, 'HK002', 2, 200000, 'ĐÃ ĐÓNG'),
(5, 'HK003', 2, 200000, 'ĐÃ ĐÓNG'),
(5, 'HK004', 2, 200000, 'CHƯA ĐÓNG'),
(5, 'HK005', 1, 100000, 'ĐÃ ĐÓNG'),
(5, 'HK006', 2, 200000, 'CHƯA ĐÓNG'),
(5, 'HK007', 3, 300000, 'ĐÃ ĐÓNG'),
(5, 'HK008', 2, 200000, 'ĐÃ ĐÓNG');

-- Phí gửi xe ô tô
INSERT INTO KhoanThuTheoHo (MaKhoanThu, MaHoKhau, SoLuong, ThanhTien, TrangThai) VALUES
(6, 'HK002', 1, 1200000, 'ĐÃ ĐÓNG'),
(6, 'HK004', 1, 1200000, 'CHƯA ĐÓNG'),
(6, 'HK007', 2, 2400000, 'ĐÃ ĐÓNG'),
(6, 'HK008', 1, 1200000, 'ĐÃ ĐÓNG');

-- Quỹ bảo trì
INSERT INTO KhoanThuTheoHo (MaKhoanThu, MaHoKhau, SoLuong, ThanhTien, TrangThai) VALUES
(7, 'HK001', 1, 500000, 'ĐÃ ĐÓNG'),
(7, 'HK002', 1, 500000, 'ĐÃ ĐÓNG'),
(7, 'HK003', 1, 500000, 'ĐÃ ĐÓNG'),
(7, 'HK004', 1, 500000, 'CHƯA ĐÓNG'),
(7, 'HK005', 1, 500000, 'CHƯA ĐÓNG'),
(7, 'HK006', 1, 500000, 'CHƯA ĐÓNG'),
(7, 'HK007', 1, 500000, 'ĐÃ ĐÓNG'),
(7, 'HK008', 1, 500000, 'ĐÃ ĐÓNG');

-- Phí vệ sinh
INSERT INTO KhoanThuTheoHo (MaKhoanThu, MaHoKhau, SoLuong, ThanhTien, TrangThai) VALUES
(9, 'HK001', 1, 30000, 'ĐÃ ĐÓNG'),
(9, 'HK002', 1, 30000, 'ĐÃ ĐÓNG'),
(9, 'HK003', 1, 30000, 'ĐÃ ĐÓNG'),
(9, 'HK004', 1, 30000, 'CHƯA ĐÓNG'),
(9, 'HK005', 1, 30000, 'ĐÃ ĐÓNG'),
(9, 'HK006', 1, 30000, 'CHƯA ĐÓNG'),
(9, 'HK007', 1, 30000, 'ĐÃ ĐÓNG'),
(9, 'HK008', 1, 30000, 'ĐÃ ĐÓNG');

-- Internet
INSERT INTO KhoanThuTheoHo (MaKhoanThu, MaHoKhau, SoLuong, ThanhTien, TrangThai) VALUES
(10, 'HK001', 1, 200000, 'ĐÃ ĐÓNG'),
(10, 'HK002', 1, 200000, 'ĐÃ ĐÓNG'),
(10, 'HK004', 1, 200000, 'CHƯA ĐÓNG'),
(10, 'HK005', 1, 200000, 'ĐÃ ĐÓNG'),
(10, 'HK007', 1, 200000, 'ĐÃ ĐÓNG'),
(10, 'HK008', 1, 200000, 'ĐÃ ĐÓNG');

INSERT INTO TamTru
(MaNhanKhau, DiaChiThuongTru, DiaChiTamTru, CanCuocCongDan, ngayBatDau, ngayKetThuc)
VALUES
(1, 'Nam Định', 'Căn hộ A101, Chung cư Bluemoon', '001200000101', '2023-01-01', '2023-12-31'),
(2, 'Thái Bình', 'Căn hộ A101, Chung cư Bluemoon', '001200000102', '2023-02-01', '2023-11-30'),
(3, 'Hà Nội', 'Căn hộ A101, Chung cư Bluemoon', '001200000103', '2023-03-01', '2023-09-30'),
(4, 'Hải Phòng', 'Căn hộ A101, Chung cư Sunrise', '001200000104', '2023-04-01', '2023-10-31'),
(5, 'Thanh Hóa', 'Căn hộ A102, Chung cư Sunrise', '001200000105', '2023-01-15', '2023-12-15'),
(6, 'Nghệ An', 'Căn hộ A102, Chung cư Bluemoon', '001200000106', '2023-02-10', '2023-08-10'),
(7, 'Hà Tĩnh', 'Căn hộ A102, Chung cư Sunrise', '001200000107', '2023-03-05', '2023-09-05'),
(8, 'Quảng Bình', 'Căn hộ A201, Chung cư Sunrise', '001200000108', '2023-01-01', '2023-06-30'),
(9, 'Huế', 'Căn hộ A201, Chung cư Sunrise', '001200000109', '2023-02-01', '2023-07-31'),
(10, 'Đà Nẵng', 'Căn hộ A201, Chung cư Sunrise', '001200000110', '2023-03-01', '2023-12-31'),
(11, 'Quảng Nam', 'Căn hộ A202, Chung cư Sunrise', '001200000111', '2023-01-20', '2023-10-20'),
(12, 'Quảng Ngãi', 'Căn hộ A202, Chung cư Sunrise', '001200000112', '2023-02-15', '2023-08-15'),
(13, 'Bình Định', 'Căn hộ B101, Chung cư Sunrise', '001200000113', '2023-01-01', '2023-12-31'),
(14, 'Phú Yên', 'Căn hộ B101, Chung cư Sunrise', '001200000114', '2023-03-01', '2023-09-01'),
(15, 'Khánh Hòa', 'Căn hộ B101, Chung cư Sunrise', '001200000115', '2023-04-01', '2023-10-01'),
(16, 'Ninh Thuận', 'Căn hộ B102, Chung cư Sunrise', '001200000116', '2023-01-10', '2023-07-10'),
(17, 'Bình Thuận', 'Căn hộ B102, Chung cư Sunrise', '001200000117', '2023-02-10', '2023-08-10'),
(18, 'Đồng Nai', 'Căn hộ C101, Chung cư Sunrise', '001200000118', '2023-01-01', '2023-12-31'),
(19, 'Bình Dương', 'Căn hộ C101, Chung cư Sunrise', '001200000119', '2023-03-01', '2023-09-30'),
(20, 'Tây Ninh', 'Căn hộ C201, Chung cư Sunrise', '001200000120', '2023-02-01', '2023-08-31');

INSERT INTO TamVang (MaNhanKhau, NgayBatDau, NgayKetThuc, LyDo) VALUES
(1, '2025-01-02', '2025-04-03', 'Đi công tác dài ngày'),
(2, '2025-03-15', '2025-04-10', 'Chăm sóc người thân'),
(3, '2025-06-01', '2025-06-15', 'Về quê nghỉ hè'),
(4, '2025-06-05', '2025-06-20', 'Nghỉ hè cùng gia đình'),
(5, '2025-04-01', '2025-05-05', 'Đi công tác tỉnh khác'),
(6, '2025-04-05', '2025-04-18', 'Dự đám cưới người thân'),
(7, '2025-06-10', '2025-06-30', 'Nghỉ hè'),
(8, '2025-03-10', '2025-03-25', 'Khám chữa bệnh'),
(9, '2025-03-20', '2025-04-02', 'Đi công tác ngắn hạn'),
(10, '2025-05-01', '2025-05-20', 'Thực tập công ty'),
(11, '2025-06-01', '2025-06-10', 'Về quê nghỉ hè'),
(13, '2025-04-01', '2025-04-30', 'Đi công tác nước ngoài'),
(14, '2025-04-20', '2025-05-12', 'Chăm sóc cha mẹ'),
(15, '2025-03-10', '2025-03-28', 'Giải quyết công việc cá nhân'),
(16, '2025-03-25', '2025-04-15', 'Về quê thăm gia đình'),
(18, '2025-03-15', '2025-04-01', 'Chuyển nơi thuê mới'),
(19, '2025-04-01', '2025-05-10', 'Hội họp công tác dài ngày'),
(21, '2025-04-05', '2025-04-25', 'Du lịch nước ngoài'),
(23, '2025-06-01', '2025-06-05', 'Nghỉ hè'),
(27, '2025-03-20', '2025-04-08', 'Về quê giải quyết việc cá nhân');

-- Bật lại safe update mode
SET SQL_SAFE_UPDATES = 1;
