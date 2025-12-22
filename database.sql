

CREATE DATABASE IF NOT EXISTS bluemoon
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE bluemoon;

CREATE TABLE can_ho (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ma_can_ho VARCHAR(20) UNIQUE,
    ten_can_ho VARCHAR(100),
    tang VARCHAR(50),
    dien_tich FLOAT,

    trang_thai ENUM('trong','chu_o','cho_thue') DEFAULT 'trong',

    ngay_bat_dau_thue DATE NULL,
    ngay_ket_thuc_thue DATE NULL,

    mo_ta VARCHAR(500)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE ho_khau (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ma_ho_khau VARCHAR(20) UNIQUE,

    id_can_ho INT,
    id_chu_ho INT NULL,

    dia_chi_thuong_tru VARCHAR(200),
    noi_cap VARCHAR(200),
    ngay_cap DATE,

    FOREIGN KEY (id_can_ho) REFERENCES can_ho(id)
        ON UPDATE CASCADE ON DELETE SET NULL
);


CREATE TABLE nhan_khau (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_ho_khau INT,
    ma_ho_khau VARCHAR(20),

    ho_ten VARCHAR(100),
    can_cuoc_cong_dan VARCHAR(12),
    ngay_sinh DATE,
    noi_sinh VARCHAR(100),
    dan_toc VARCHAR(20),
    nghe_nghiep VARCHAR(50),
    quan_he VARCHAR(30),        -- Chu ho / Vo / Con / Nguoi thue...
    ghi_chu VARCHAR(200),
    trang_thai INT DEFAULT 1,

    FOREIGN KEY (id_ho_khau) REFERENCES ho_khau(id)
        ON UPDATE CASCADE ON DELETE SET NULL
);

ALTER TABLE ho_khau
ADD CONSTRAINT fk_chu_ho FOREIGN KEY (id_chu_ho)
    REFERENCES nhan_khau(id)
    ON UPDATE CASCADE ON DELETE SET NULL;


CREATE TABLE tam_tru (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_nhan_khau INT,
    dia_chi_tam_tru VARCHAR(200),
    can_cuoc_cong_dan VARCHAR(20),
    ngay_bat_dau DATE,
    ngay_ket_thuc DATE,
    FOREIGN KEY (id_nhan_khau) REFERENCES nhan_khau(id)
        ON UPDATE CASCADE ON DELETE CASCADE
);


CREATE TABLE tam_vang (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_nhan_khau INT,
    thoi_han DATE,
    ly_do VARCHAR(200),

    FOREIGN KEY (id_nhan_khau) REFERENCES nhan_khau(id)
        ON UPDATE CASCADE ON DELETE CASCADE
);


CREATE TABLE loai_xe (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ma_loai_xe VARCHAR(20) UNIQUE,
    ten_loai_xe VARCHAR(100)
);


CREATE TABLE xe (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_ho_khau INT,
    id_loai_xe INT,
    ten_xe VARCHAR(100),
    bien_kiem_soat VARCHAR(50),
    mo_ta VARCHAR(500),

    FOREIGN KEY (id_ho_khau) REFERENCES ho_khau(id)
        ON UPDATE CASCADE ON DELETE CASCADE,

    FOREIGN KEY (id_loai_xe) REFERENCES loai_xe(id)
        ON UPDATE CASCADE ON DELETE SET NULL
);


CREATE TABLE khoan_thu (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ma_khoan_thu VARCHAR(20) UNIQUE,
    ten_khoan_thu VARCHAR(100),

    loai_khoan_thu ENUM('dinh_ky','mot_lan'),

    chi_tiet VARCHAR(500),
    ghi_chu VARCHAR(200),

    thoi_gian_bat_dau DATE,
    thoi_gian_ket_thuc DATE
);


CREATE TABLE khoan_thu_ho_khau (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_khoan_thu INT,
    id_ho_khau INT,
    so_tien INT,

    FOREIGN KEY (id_khoan_thu) REFERENCES khoan_thu(id)
        ON UPDATE CASCADE ON DELETE CASCADE,

    FOREIGN KEY (id_ho_khau) REFERENCES ho_khau(id)
        ON UPDATE CASCADE ON DELETE CASCADE
);


CREATE TABLE hoa_don (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ma_hoa_don VARCHAR(30) UNIQUE,
    id_khoan_thu_ho_khau INT,

    so_tien_da_nop INT,
    ngay_nop DATE,
    da_nop TINYINT(1) DEFAULT 0,

    FOREIGN KEY (id_khoan_thu_ho_khau) REFERENCES khoan_thu_ho_khau(id)
        ON UPDATE CASCADE ON DELETE CASCADE
);

-- Trigger 1: Khi thêm nhân khẩu là Chủ hộ thì tự động gán người ta là chủ hộ
DELIMITER $$

CREATE TRIGGER trg_set_chu_ho
AFTER INSERT ON nhan_khau
FOR EACH ROW
BEGIN
    IF NEW.quan_he = 'Chu ho' THEN
        -- gán chủ hộ
        UPDATE ho_khau
        SET id_chu_ho = NEW.id
        WHERE id = NEW.id_ho_khau;

        -- đổi trạng thái căn hộ thành 'chu_o'
        UPDATE can_ho
        SET trang_thai = 'chu_o'
        WHERE id = (
            SELECT id_can_ho FROM ho_khau WHERE id = NEW.id_ho_khau
        );
    END IF;
END$$

DELIMITER ;

-- Trigger 2: Khi thêm nhân khẩu là Người thuê chuyển trạng thái căn hộ sang cho thuê
DELIMITER $$

CREATE TRIGGER trg_set_cho_thue
AFTER INSERT ON nhan_khau
FOR EACH ROW
BEGIN
    IF NEW.quan_he = 'Nguoi thue' THEN
        UPDATE can_ho
        SET trang_thai = 'cho_thue'
        WHERE id = (
            SELECT id_can_ho FROM ho_khau WHERE id = NEW.id_ho_khau
        );
    END IF;
END$$

DELIMITER ;

-- TRIGGER: Xóa chủ hộ khi chủ hộ bị xóa
DELIMITER $$

CREATE TRIGGER trg_delete_chu_ho
AFTER DELETE ON nhan_khau
FOR EACH ROW
BEGIN
    DECLARE total_renters INT DEFAULT 0;

    -- Nếu người bị xóa là chủ hộ
    IF OLD.quan_he = 'Chu ho' THEN

        -- Xóa chủ hộ trong bảng ho_khau
        UPDATE ho_khau
        SET id_chu_ho = NULL
        WHERE id = OLD.id_ho_khau;

        -- Kiểm tra xem hộ còn người thuê không
        SELECT COUNT(*) INTO total_renters
        FROM nhan_khau
        WHERE id_ho_khau = OLD.id_ho_khau AND quan_he = 'Nguoi thue';

        -- Nếu còn người thuê → trạng thái cho thuê
        IF total_renters > 0 THEN
            UPDATE can_ho
            SET trang_thai = 'cho_thue'
            WHERE id = (SELECT id_can_ho FROM ho_khau WHERE id = OLD.id_ho_khau);
        ELSE
            -- Không còn chủ hộ & không còn người thuê → căn hộ trống
            UPDATE can_ho
            SET trang_thai = 'trong'
            WHERE id = (SELECT id_can_ho FROM ho_khau WHERE id = OLD.id_ho_khau);
        END IF;

    END IF;
END$$

DELIMITER ;

-- Trigger reset trạng thái căn hộ khi xoá người thuê cuối cùng
DELIMITER $$

CREATE TRIGGER trg_delete_renter
AFTER DELETE ON nhan_khau
FOR EACH ROW
BEGIN
    DECLARE renter_count INT DEFAULT 0;
    DECLARE has_owner INT DEFAULT 0;
    DECLARE canho_id INT DEFAULT 0;

    IF OLD.quan_he = 'Nguoi thue' THEN

        -- Lấy id căn hộ
        SELECT id_can_ho INTO canho_id
        FROM ho_khau
        WHERE id = OLD.id_ho_khau;

        -- Đếm người thuê còn lại
        SELECT COUNT(*) INTO renter_count
        FROM nhan_khau
        WHERE id_ho_khau = OLD.id_ho_khau AND quan_he = 'Nguoi thue';

        -- Kiểm tra chủ hộ còn không
        SELECT COUNT(*) INTO has_owner
        FROM nhan_khau
        WHERE id_ho_khau = OLD.id_ho_khau AND quan_he = 'Chu ho';

        -- Nếu vẫn còn người thuê khác → vẫn 'cho_thue'
        IF renter_count > 0 THEN
            UPDATE can_ho SET trang_thai = 'cho_thue' WHERE id = canho_id;

        ELSE
            -- Không còn ai thuê
            IF has_owner > 0 THEN
                UPDATE can_ho SET trang_thai = 'chu_o' WHERE id = canho_id;
            ELSE
                UPDATE can_ho SET trang_thai = 'trong' WHERE id = canho_id;
            END IF;

        END IF;

    END IF;
END$$

DELIMITER ;
