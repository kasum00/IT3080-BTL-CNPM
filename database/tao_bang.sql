-- tạo database
CREATE DATABASE IF NOT EXISTS bluemoon
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

use bluemoon;
 
-- căn hộ
create table CanHo(
	MaCanHo INT auto_increment primary key,
    MaHoKhau VARCHAR(10) unique null,
    TenCanHo nvarchar(100),
    Tang nvarchar(50),
    DienTich float,
    TrangThai nvarchar(20) default 'trong', -- trong/ chu_o/ cho_thue
    MoTa NVARCHAR(500)
);

-- hộ khẩu
create table HoKhau(
	MaHoKhau varchar(10) primary key, -- hk001, hk002,..
    MaCanHo INT UNIQUE,
    DiaChiThuongTru nvarchar(200),
    NoiCap nvarchar(200),
	NgayCap DATE,
    FOREIGN KEY(MaCanHo) references CanHo(MaCanHo) on delete cascade on update cascade
);

ALTER TABLE CanHo
ADD CONSTRAINT fk_canho_hokhau
FOREIGN KEY (MaHoKhau) REFERENCES HoKhau(MaHoKhau)
ON DELETE SET NULL ON UPDATE CASCADE;

-- nhân khẩu
create table NhanKhau(
	MaNhanKhau INT auto_increment primary key,
    MaHoKhau varchar(10),
    HoTen nvarchar(100),
    CanCuocCongDan varchar(12) UNIQUE,
    NgaySinh DATE,
    NoiSinh nvarchar(100),
    DanToc nvarchar(20),
    NgheNghiep nvarchar(50),
    QuanHe nvarchar(30), -- chu ho/vo/con/nguoi thue
    GhiChu nvarchar(200),
    TrangThai INT default 1,
    FOREIGN KEY (MaHoKhau) REFERENCES HoKhau(MaHoKhau)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- TẠM TRÚ
create table TamTru(
	MaTamTru INT auto_increment primary key,
    MaNhanKhau int,
    DiaChiThuongTru nvarchar(200),
    DiaChiTamTru nvarchar(200),
    CanCuocCongDan varchar(20),
    
    FOREIGN KEY (MaNhanKhau) REFERENCES NhanKhau(MaNhanKhau)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tạm vắng
create table TamVang(
	MaTamVang int auto_increment primary key,
    MaNhanKhau int,
    ThoiHan Date,
    LyDo nvarchar(200),
    FOREIGN KEY (MaNhanKhau) REFERENCES NhanKhau(MaNhanKhau)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- Khoản thu
create table KhoanThu(
	MaKhoanThu int auto_increment primary key,
    TenKhoanThu nvarchar(100),
    LoaiKhoanThu INT, -- 1: định kỳ, 2: một lần
    ThoiGianBatDau DATE,
    ThoiGianKetThuc DATE,
    DonViTinh nvarchar(50), -- nhan_khau, ho_khau
    DonGia INT,
    ChiTiet NVARCHAR(500),
    GhiChu NVARCHAR(200)
);

-- Khoản thu theo hộ
CREATE TABLE KhoanThuTheoHo(
    MaKhoanThuTheoHo INT AUTO_INCREMENT PRIMARY KEY,
    MaKhoanThu INT,
    MaHoKhau VARCHAR(10),
    SoLuong INT DEFAULT 0,              -- Số nhân khẩu trong hộ
    ThanhTien INT DEFAULT 0,            -- = SoLuong * DonGia (tính qua trigger)
    TrangThai VARCHAR(20) DEFAULT 'Chưa đóng', -- 'Đã đóng', 'Chưa đóng'
    FOREIGN KEY (MaKhoanThu) REFERENCES KhoanThu(MaKhoanThu)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (MaHoKhau) REFERENCES HoKhau(MaHoKhau)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- Bảng tổng hợp tổng tiền theo hộ khẩu
CREATE TABLE TongTienHoKhau(
    MaHoKhau VARCHAR(10) PRIMARY KEY,
    TongTien INT DEFAULT 0,             -- Tổng tiền tất cả khoản thu của hộ
    TongDaNop INT DEFAULT 0,            -- Tổng tiền đã nộp
    TongConThieu INT DEFAULT 0,         -- Tổng tiền còn thiếu
    FOREIGN KEY (MaHoKhau) REFERENCES HoKhau(MaHoKhau)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- Hóa đơn
CREATE TABLE HoaDon (
    MaHoaDon INT AUTO_INCREMENT PRIMARY KEY,
    MaHoKhau VARCHAR(10),  
    MaKhoanThuTheoHo INT NULL, 
    TenHoaDon NVARCHAR(100),
    TongSoTien INT DEFAULT 0,  
    DaNop BOOLEAN DEFAULT FALSE,
    NgayNop DATE NULL,
    NgayXuatHoaDon DATE DEFAULT (CURRENT_DATE),

    FOREIGN KEY (MaHoKhau) REFERENCES HoKhau(MaHoKhau)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (MaKhoanThuTheoHo) REFERENCES KhoanThuTheoHo(MaKhoanThuTheoHo)
        ON DELETE SET NULL ON UPDATE CASCADE
);

-- tài khoản

CREATE TABLE TaiKhoan (
    MaTaiKhoan INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,   -- bcrypt hash
    VaiTro NVARCHAR(20) NOT NULL,      -- admin | ban_quan_ly | cu_dan
    TrangThai INT DEFAULT 1,           -- 1: active, 0: khóa
    LanDangNhapCuoi DATETIME NULL,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE NhanKhau
ADD MaTaiKhoan INT NULL;

ALTER TABLE NhanKhau
ADD CONSTRAINT fk_nhankhau_taikhoan
FOREIGN KEY (MaTaiKhoan) REFERENCES TaiKhoan(MaTaiKhoan)
ON DELETE SET NULL
ON UPDATE CASCADE;


SET SQL_SAFE_UPDATES = 0;

UPDATE NhanKhau nk
JOIN HoKhau hk ON nk.MaHoKhau = hk.MaHoKhau
JOIN TaiKhoan tk ON tk.Username = CONCAT('cudan_', LOWER(hk.MaHoKhau))
SET nk.MaTaiKhoan = tk.MaTaiKhoan
WHERE nk.QuanHe = 'chu ho'
  AND tk.VaiTro = 'cu_dan';

SET SQL_SAFE_UPDATES = 1;

