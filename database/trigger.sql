DELIMITER $$

-- Thêm CHỦ HỘ
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

-- Thêm NGƯỜI THUÊ
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

-- Xóa NHÂN KHẨU → cập nhật lại trạng thái
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

DELIMITER $$
-- tự động set là cư dân khi gắn tài khoản cho nhân 
CREATE TRIGGER trg_link_account
AFTER UPDATE ON NhanKhau
FOR EACH ROW
BEGIN
    IF OLD.MaTaiKhoan IS NULL AND NEW.MaTaiKhoan IS NOT NULL THEN
        UPDATE TaiKhoan
        SET VaiTro = 'cu_dan'
        WHERE MaTaiKhoan = NEW.MaTaiKhoan;
    END IF;
END$$

DELIMITER ;