


-- ⚠️⚠️⚠️ WARNING: AI generated data
-- có thể chưa cập nhật với các thay đổi trong schema  + chắp vá => CẨN THẬN KHI INSERT

-- Thiết lập charset cho kết nối
SET NAMES 'utf8mb4';
SET CHARACTER_SET_CLIENT = utf8mb4;
SET CHARACTER_SET_CONNECTION = utf8mb4;
SET CHARACTER_SET_RESULTS = utf8mb4;

CREATE DATABASE IF NOT EXISTS bluemoon
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE bluemoon;

-- Tắt safe update mode
SET SQL_SAFE_UPDATES = 0;

-- Xóa dữ liệu cũ nếu có (theo thứ tự ngược lại với foreign key)
DELETE FROM KhoanThuTheoHo;
DELETE FROM KhoanThu;
DELETE FROM HoKhau;
DELETE FROM CanHo;

-- Reset auto_increment
ALTER TABLE CanHo AUTO_INCREMENT = 1;
ALTER TABLE KhoanThu AUTO_INCREMENT = 1;
ALTER TABLE KhoanThuTheoHo AUTO_INCREMENT = 1;

-- 1. Thêm dữ liệu vào bảng CanHo (KHÔNG có MaHoKhau)
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

-- 2. Kiểm tra MaCanHo và thêm HoKhau với MaCanHo chính xác
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

-- 3. Update MaHoKhau cho bảng CanHo
UPDATE CanHo c 
JOIN HoKhau h ON c.MaCanHo = h.MaCanHo 
SET c.MaHoKhau = h.MaHoKhau;

-- 4. Thêm dữ liệu vào bảng KhoanThu
INSERT INTO KhoanThu (TenKhoanThu, LoaiKhoanThu, ThoiGianBatDau, ThoiGianKetThuc, DonViTinh, DonGia, ChiTiet, GhiChu) VALUES
('Phí quản lý chung cư', 1, '2024-01-01', '2024-12-31', 'ho_khau', 15000, 'Phí quản lý 15,000đ/m2/tháng', 'Thu hàng tháng'),
('Phí dịch vụ', 1, '2024-01-01', '2024-12-31', 'nhan_khau', 50000, 'Phí dịch vụ 50,000đ/người/tháng', 'Thu hàng tháng'),
('Tiền điện', 1, '2024-01-01', '2024-12-31', 'ho_khau', 3500, 'Giá điện 3,500đ/kWh', 'Tính theo số điện tiêu thụ'),
('Tiền nước', 1, '2024-01-01', '2024-12-31', 'ho_khau', 25000, 'Giá nước 25,000đ/m3', 'Tính theo số nước tiêu thụ'),
('Phí gửi xe máy', 1, '2024-01-01', '2024-12-31', 'ho_khau', 100000, 'Phí gửi xe 100,000đ/xe/tháng', 'Thu hàng tháng'),
('Phí gửi xe ô tô', 1, '2024-01-01', '2024-12-31', 'ho_khau', 1200000, 'Phí gửi xe 1,200,000đ/xe/tháng', 'Thu hàng tháng'),
('Quỹ bảo trì', 2, '2024-03-01', '2024-03-31', 'ho_khau', 500000, 'Đóng góp quỹ bảo trì năm 2024', 'Thu một lần trong năm'),
('Tết Trung Thu', 2, '2024-09-01', '2024-09-15', 'nhan_khau', 50000, 'Quỹ tổ chức Tết Trung Thu cho trẻ em', 'Thu một lần'),
('Phí vệ sinh', 1, '2024-01-01', '2024-12-31', 'ho_khau', 30000, 'Phí vệ sinh 30,000đ/hộ/tháng', 'Thu hàng tháng'),
('Internet', 1, '2024-01-01', '2024-12-31', 'ho_khau', 200000, 'Phí Internet 200,000đ/hộ/tháng', 'Tùy chọn đăng ký');

-- 5. Thêm dữ liệu vào bảng KhoanThuTheoHo
-- Phí quản lý chung cư
INSERT INTO KhoanThuTheoHo (MaKhoanThu, MaHoKhau, SoLuong, ThanhTien, TrangThai) VALUES
(1, 'HK001', 66, 990000, 'ĐÃ ĐÓNG'),
(1, 'HK002', 75, 1125000, 'ĐÃ ĐÓNG'),
(1, 'HK003', 66, 990000, 'ĐÃ ĐÓNG'),
(1, 'HK004', 80, 1200000, 'CHƯA ĐÓNG'),
(1, 'HK005', 55, 825000, 'ĐÃ ĐÓNG'),
(1, 'HK006', 70, 1050000, 'CHƯA ĐÓNG'),
(1, 'HK007', 90, 1350000, 'ĐÃ ĐÓNG'),
(1, 'HK008', 85, 1275000, 'ĐÃ ĐÓNG');

-- Phí dịch vụ
INSERT INTO KhoanThuTheoHo (MaKhoanThu, MaHoKhau, SoLuong, ThanhTien, TrangThai) VALUES
(2, 'HK001', 4, 200000, 'ĐÃ ĐÓNG'),
(2, 'HK002', 5, 250000, 'ĐÃ ĐÓNG'),
(2, 'HK003', 3, 150000, 'ĐÃ ĐÓNG'),
(2, 'HK004', 4, 200000, 'CHƯA ĐÓNG'),
(2, 'HK005', 2, 100000, 'ĐÃ ĐÓNG'),
(2, 'HK006', 3, 150000, 'CHƯA ĐÓNG'),
(2, 'HK007', 6, 300000, 'ĐÃ ĐÓNG'),
(2, 'HK008', 4, 200000, 'ĐÃ ĐÓNG');

-- Tiền điện
INSERT INTO KhoanThuTheoHo (MaKhoanThu, MaHoKhau, SoLuong, ThanhTien, TrangThai) VALUES
(3, 'HK001', 150, 525000, 'ĐÃ ĐÓNG'),
(3, 'HK002', 200, 700000, 'ĐÃ ĐÓNG'),
(3, 'HK003', 120, 420000, 'ĐÃ ĐÓNG'),
(3, 'HK004', 180, 630000, 'CHƯA ĐÓNG'),
(3, 'HK005', 100, 350000, 'ĐÃ ĐÓNG'),
(3, 'HK006', 140, 490000, 'CHƯA ĐÓNG'),
(3, 'HK007', 250, 875000, 'ĐÃ ĐÓNG'),
(3, 'HK008', 190, 665000, 'ĐÃ ĐÓNG');

-- Tiền nước
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
(5, 'HK002', 3, 300000, 'ĐÃ ĐÓNG'),
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


INSERT INTO NhanKhau (MaHoKhau, HoTen, QuanHe) VALUES
-- HK001
('HK001', 'Nguyễn Văn An', 'chu ho'),
('HK001', 'Trần Thị Bích', 'vo'),
('HK001', 'Nguyễn Văn Minh', 'con'),
('HK001', 'Nguyễn Thị Hoa', 'con'),

-- HK002
('HK002', 'Phạm Đức Thắng', 'chu ho'),
('HK002', 'Lê Thị Mai', 'vo'),
('HK002', 'Phạm Thị Lan', 'con'),

-- HK003
('HK003', 'Hoàng Văn Hùng', 'chu ho'),
('HK003', 'Nguyễn Thị Thu', 'vo'),
('HK003', 'Hoàng Văn Nam', 'con'),
('HK003', 'Hoàng Thị Ngọc', 'con'),
('HK003', 'Hoàng Văn Tuấn', 'con'),

-- HK004
('HK004', 'Trần Quốc Toàn', 'chu ho'),
('HK004', 'Vũ Thị Hằng', 'vo'),

-- HK005
('HK005', 'Đặng Minh Tuấn', 'chu ho'),
('HK005', 'Phạm Thị Linh', 'vo'),
('HK005', 'Đặng Minh Châu', 'con'),
('HK005', 'Nguyễn Văn Hải', 'nguoi thue'),

-- HK006
('HK006', 'Lý Thanh Sơn', 'chu ho'),
('HK006', 'Ngô Thị Tuyết', 'vo'),
('HK006', 'Lý Thanh Long', 'con'),
('HK006', 'Lý Thị Hương', 'con'),
('HK006', 'Lý Thanh Tùng', 'con'),

-- HK007
('HK007', 'Bùi Văn Đức', 'chu ho'),
('HK007', 'Đỗ Thị Hạnh', 'vo'),
('HK007', 'Bùi Văn Khoa', 'con'),
('HK007', 'Trần Thị Lan', 'nguoi thue'),

-- HK008
('HK008', 'Võ Minh Quân', 'chu ho'),
('HK008', 'Trương Thị Ánh', 'vo'),
('HK008', 'Võ Minh Anh', 'con'),
('HK008', 'Võ Minh Đức', 'con');



-- Bật lại safe update mode
SET SQL_SAFE_UPDATES = 1;