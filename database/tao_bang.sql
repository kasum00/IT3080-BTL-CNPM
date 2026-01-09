drop database bluemoon;


-- tạo database
CREATE DATABASE IF NOT EXISTS bluemoon
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

use bluemoon;
 
-- căn hộ
create table CanHo(
	MaCanHo INT auto_increment primary key,
    MaHoKhau VARCHAR(10) unique null,
    TenCanHo varchar(100),
    Tang varchar(50),
    DienTich float,
    TrangThai ENUM('trong','chu_o','cho_thue') DEFAULT 'trong',
    ngay_bat_dau_thue DATE NULL, 
	ngay_ket_thuc_thue DATE NULL,
    MoTa varchar(500)
);

-- hộ khẩu
create table HoKhau(
	MaHoKhau varchar(10) primary key, -- hk001, hk002,..
    MaCanHo INT UNIQUE,
    DiaChiThuongTru varchar(200),
    NoiCap varchar(200),
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
    HoTen varchar(100),
    CanCuocCongDan varchar(12) UNIQUE,
    NgaySinh DATE,
    NoiSinh varchar(100),
    DanToc varchar(20),
    NgheNghiep varchar(50),
    QuanHe varchar(30), -- chu ho/vo/con/nguoi thue
    GhiChu varchar(200),
    TrangThai INT default 1,
    FOREIGN KEY (MaHoKhau) REFERENCES HoKhau(MaHoKhau)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- TẠM TRÚ
create table TamTru(
	MaTamTru INT auto_increment primary key,
    DiaChiThuongTru varchar(200),
    DiaChiTamTru varchar(200),
    CanCuocCongDan varchar(20),
    ngayBatDau DATE, 
	ngayKetThuc DATE,
    FOREIGN KEY (CanCuocCongDan) REFERENCES NhanKhau(CanCuocCongDan)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tạm vắng
create table TamVang(
	MaTamVang int auto_increment primary key,
    CanCuocCongDan varchar(20),
    NgayBatDau DATE, 
    NgayKetThuc DATE,
    LyDo varchar(200),
    FOREIGN KEY (CanCuocCongDan) REFERENCES NhanKhau(CanCuocCongDan)
        ON DELETE CASCADE ON UPDATE CASCADE
);


-- Khoản thu
create table KhoanThu(
	MaKhoanThu int auto_increment primary key,
    TenKhoanThu varchar(100),
    LoaiKhoanThu varchar(100), -- 1: định kỳ, 2: một lần
    ThoiGianBatDau DATE,
    ThoiGianKetThuc DATE,
    DonViTinh varchar(50), -- nhan_khau, ho_khau
    DonGia INT,
    ChiTiet varchar(500),
    GhiChu varchar(200)
);

-- Khoản thu theo hộ
CREATE TABLE KhoanThuTheoHo(
    MaKhoanThuTheoHo INT AUTO_INCREMENT PRIMARY KEY,
    MaKhoanThu INT,
    MaHoKhau VARCHAR(10),
    SoLuong INT DEFAULT 0,              -- Số nhân khẩu trong hộ
    ThanhTien INT DEFAULT 0,            -- = SoLuong * DonGia (tính trigger)
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
    TenHoaDon varchar(100),
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
    VaiTro varchar(20) NOT NULL,      -- admin | ban_quan_ly | cu_dan
    TrangThai INT DEFAULT 1,           -- 1: active, 0: khóa
    LanDangNhapCuoi DATETIME NULL,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE LoaiPhuongTien (
    MaLoaiPT INT PRIMARY KEY,          -- 1: Xe đạp | 2: Xe máy | 3: Ô tô
    TenLoai varchar(50) NOT NULL,
    PhiGuiXe INT DEFAULT 0,
    MoTa varchar(200)
);

INSERT INTO LoaiPhuongTien (MaLoaiPT, TenLoai, PhiGuiXe)
VALUES
(1, N'Xe đạp', 30000),
(2, N'Xe máy', 100000),
(3, N'Ô tô', 1500000);

DROP TABLE IF EXISTS PhuongTien;

CREATE TABLE PhuongTien (
    MaPhuongTien INT AUTO_INCREMENT PRIMARY KEY,
    BienSo VARCHAR(20) UNIQUE NULL,
    MaLoaiPT INT NOT NULL,
    MaHoKhau VARCHAR(10) NOT NULL,
    ChuSoHuu varchar(100),
    GhiChu varchar(200),

    FOREIGN KEY (MaLoaiPT) REFERENCES LoaiPhuongTien(MaLoaiPT)
        ON DELETE RESTRICT ON UPDATE RESTRICT,

    FOREIGN KEY (MaHoKhau) REFERENCES HoKhau(MaHoKhau)
        ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS ThongKePhuongTien;

CREATE TABLE ThongKePhuongTien (
    MaHoKhau VARCHAR(10) PRIMARY KEY,
    SoXeDap INT DEFAULT 0,
    SoXeMay INT DEFAULT 0,
    SoOTo INT DEFAULT 0,
    TongPhuongTien INT DEFAULT 0,

    FOREIGN KEY (MaHoKhau) REFERENCES HoKhau(MaHoKhau)
        ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS TienGuiXeTheoHoKhau;

CREATE TABLE TienGuiXeTheoHoKhau (
    MaHoKhau VARCHAR(10) PRIMARY KEY,
    TienXeDap INT DEFAULT 0,
    TienXeMay INT DEFAULT 0,
    TienOTo INT DEFAULT 0,
    TongTienGuiXe INT DEFAULT 0,
    CapNhatLuc DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (MaHoKhau) REFERENCES HoKhau(MaHoKhau)
        ON DELETE CASCADE ON UPDATE CASCADE
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
