use bluemoon;

INSERT INTO can_ho 
(ma_can_ho, ten_can_ho, tang, dien_tich, trang_thai, ngay_bat_dau_thue, ngay_ket_thuc_thue, mo_ta)
VALUES
('A1-01', 'Căn hộ A1-01', '1', 75, 'chu_o', NULL, NULL, 'Căn hộ 2 phòng ngủ'),
('A1-02', 'Căn hộ A1-02', '1', 60, 'trong', NULL, NULL, 'Căn hộ 1 phòng ngủ'),
('A1-12', 'Căn hộ A1-12', '12', 80, 'cho_thue', '2024-01-01', '2024-12-31', 'Đang cho thuê'),
('B2-05', 'Căn hộ B2-05', '5', 95, 'chu_o', NULL, NULL, 'Căn hộ 3 phòng ngủ'),
('C3-10', 'Căn hộ C3-10', '10', 65, 'trong', NULL, NULL, 'View hồ bơi');

INSERT INTO ho_khau 
(ma_ho_khau, id_can_ho, id_chu_ho, dia_chi_thuong_tru, noi_cap, ngay_cap)
VALUES
('HK001', 1, NULL, 'A1-01', 'Hà Nội', '2020-02-01'),
('HK002', 2, NULL, 'A1-02', 'Hà Nội', '2021-03-11'),
('HK003', 3, NULL, 'A1-12', 'Hà Nội', '2022-05-20'),
('HK004', 4, NULL, 'B2-05', 'Hà Nội', '2023-01-15'),
('HK005', 5, NULL, 'C3-10', 'HCM', '2024-03-01');

INSERT INTO nhan_khau 
(id_ho_khau, ma_ho_khau, ho_ten, can_cuoc_cong_dan, ngay_sinh, noi_sinh, dan_toc, nghe_nghiep, quan_he, ghi_chu)
VALUES
(1, 'HK001', 'Nguyễn Văn A', '012345678901', '1985-01-10', 'Hà Nội', 'Kinh', 'Kỹ sư', 'Chu ho', ''),
(1, 'HK001', 'Trần Thị B', '012345678902', '1987-03-15', 'Nam Định', 'Kinh', 'Giáo viên', 'Vo', ''),

(2, 'HK002', 'Lê Văn C', '012345678903', '1990-05-20', 'Hà Nội', 'Kinh', 'Tài xế', 'Chu ho', ''),
(2, 'HK002', 'Lê Thị D', '012345678904', '1995-07-25', 'Hải Dương', 'Kinh', 'Kế toán', 'Vo', ''),

(3, 'HK003', 'Phạm Văn E', '012345678905', '1998-02-14', 'Hà Nội', 'Kinh', 'Sinh viên', 'Nguoi thue', ''),
(3, 'HK003', 'Vũ Văn F', '012345678906', '1996-11-30', 'Nghệ An', 'Kinh', 'IT Support', 'Ban be', ''),

(4, 'HK004', 'Hoàng Thị G', '012345678907', '1980-10-12', 'Thái Bình', 'Kinh', 'Nội trợ', 'Chu ho', ''),
(5, 'HK005', 'Đỗ Văn H', '012345678908', '1984-08-09', 'HCM', 'Kinh', 'Kinh doanh', 'Chu ho', '');

UPDATE ho_khau SET id_chu_ho = 1 WHERE id = 1;
UPDATE ho_khau SET id_chu_ho = 3 WHERE id = 2;
UPDATE ho_khau SET id_chu_ho = 5 WHERE id = 3;
UPDATE ho_khau SET id_chu_ho = 7 WHERE id = 4;

INSERT INTO loai_xe (ma_loai_xe, ten_loai_xe)
VALUES
('LX01', 'Xe máy'),
('LX02', 'Ô tô'),
('LX03', 'Xe đạp');

INSERT INTO xe (id_ho_khau, id_loai_xe, ten_xe, bien_kiem_soat)
VALUES
(1, 1, 'Honda AirBlade', '29A1-12345'),
(1, 2, 'Toyota Vios', '30G-56789'),
(2, 1, 'Vision', '29B1-88888'),
(3, 3, 'Xe đạp Martin 107', 'N/A'),
(4, 2, 'Mazda CX5', '30F-22222');

INSERT INTO khoan_thu 
(ma_khoan_thu, ten_khoan_thu, loai_khoan_thu, chi_tiet, ghi_chu, thoi_gian_bat_dau, thoi_gian_ket_thuc)
VALUES
('KT01', 'Phí quản lý', 'dinh_ky', 'Thu hằng tháng', '', '2024-01-01', '2030-12-31'),
('KT02', 'Phí gửi xe', 'dinh_ky', 'Tính theo loại xe', '', '2024-01-01', '2030-12-31'),
('KT03', 'Phí vệ sinh chung cư', 'dinh_ky', 'Tất cả căn hộ phải nộp', '', '2024-01-01', '2030-12-31');

INSERT INTO khoan_thu_ho_khau (id_khoan_thu, id_ho_khau, so_tien)
VALUES
(1, 1, 250000),
(1, 2, 250000),
(1, 3, 250000),
(2, 1, 120000),
(2, 4, 150000);

INSERT INTO hoa_don 
(ma_hoa_don, id_khoan_thu_ho_khau, so_tien_da_nop, ngay_nop)
VALUES
('HD2024-001', 1, 250000, '2024-03-01'),
('HD2024-002', 2, 250000, '2024-03-05'),
('HD2024-003', 3, 250000, '2024-03-02'),
('HD2024-004', 4, 120000, '2024-03-03'),
('HD2024-005', 5, 150000, '2024-03-06');



