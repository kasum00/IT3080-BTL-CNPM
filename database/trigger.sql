DELIMITER $$

-- ================================================================
-- TRIGGER TÍNH THÀNH TIỀN KHI THÊM KHOẢN THU THEO HỘ
-- Nếu DonViTinh = 'nhan_khau' thì ThanhTien = SoNhanKhau * DonGia
-- Nếu DonViTinh = 'ho_khau' thì ThanhTien = 1 * DonGia
-- ================================================================
CREATE TRIGGER trg_tinh_thanh_tien_insert
BEFORE INSERT ON KhoanThuTheoHo
FOR EACH ROW
BEGIN
    DECLARE v_so_nhan_khau INT DEFAULT 0;
    DECLARE v_don_gia INT DEFAULT 0;
    DECLARE v_don_vi_tinh NVARCHAR(50);
    
    -- Đếm số nhân khẩu đang hoạt động trong hộ
    SELECT COUNT(*) INTO v_so_nhan_khau
    FROM NhanKhau
    WHERE MaHoKhau = NEW.MaHoKhau AND TrangThai = 1;
    
    -- Lấy đơn giá và đơn vị tính từ khoản thu
    SELECT IFNULL(DonGia, 0), IFNULL(DonViTinh, 'nhan_khau') 
    INTO v_don_gia, v_don_vi_tinh
    FROM KhoanThu
    WHERE MaKhoanThu = NEW.MaKhoanThu;
    
    -- Gán giá trị số lượng
    SET NEW.SoLuong = v_so_nhan_khau;
    
    -- Tính thành tiền dựa vào đơn vị tính
    IF v_don_vi_tinh = 'ho_khau' THEN
        SET NEW.ThanhTien = v_don_gia;
    ELSE
        SET NEW.ThanhTien = v_so_nhan_khau * v_don_gia;
    END IF;
END$$

-- ================================================================
-- TRIGGER CẬP NHẬT TỔNG TIỀN HỘ KHẨU KHI THÊM KHOẢN THU THEO HỘ
-- ================================================================
CREATE TRIGGER trg_cap_nhat_tong_tien_insert
AFTER INSERT ON KhoanThuTheoHo
FOR EACH ROW
BEGIN
    -- Kiểm tra nếu chưa có record thì tạo mới
    INSERT INTO TongTienHoKhau (MaHoKhau, TongTien, TongDaNop, TongConThieu)
    VALUES (NEW.MaHoKhau, NEW.ThanhTien, 0, NEW.ThanhTien)
    ON DUPLICATE KEY UPDATE
        TongTien = TongTien + NEW.ThanhTien,
        TongConThieu = TongConThieu + NEW.ThanhTien;
END$$

-- ================================================================
-- TRIGGER CẬP NHẬT TỔNG TIỀN KHI XÓA KHOẢN THU THEO HỘ
-- ================================================================
CREATE TRIGGER trg_cap_nhat_tong_tien_delete
AFTER DELETE ON KhoanThuTheoHo
FOR EACH ROW
BEGIN
    UPDATE TongTienHoKhau
    SET TongTien = TongTien - OLD.ThanhTien,
        TongConThieu = TongConThieu - OLD.ThanhTien
    WHERE MaHoKhau = OLD.MaHoKhau;
END$$

-- ================================================================
-- TRIGGER CẬP NHẬT TỔNG TIỀN KHI SỬA KHOẢN THU THEO HỘ
-- ================================================================
CREATE TRIGGER trg_cap_nhat_tong_tien_update
AFTER UPDATE ON KhoanThuTheoHo
FOR EACH ROW
BEGIN
    DECLARE v_chenh_lech INT;
    SET v_chenh_lech = NEW.ThanhTien - OLD.ThanhTien;
    
    UPDATE TongTienHoKhau
    SET TongTien = TongTien + v_chenh_lech,
        TongConThieu = TongConThieu + v_chenh_lech
    WHERE MaHoKhau = NEW.MaHoKhau;
END$$

DELIMITER ;

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


DELIMITER //

CREATE TRIGGER trg_check_thoigian
BEFORE INSERT ON KhoanThu
FOR EACH ROW
BEGIN
    IF NEW.ThoiGianKetThuc <= NEW.ThoiGianBatDau THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'ThoiGianKetThuc phải lớn hơn ThoiGianBatDau';
    END IF;
END;
//

DELIMITER ;
