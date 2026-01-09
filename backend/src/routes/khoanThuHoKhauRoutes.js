const express = require("express");
const router = express.Router();
const khoanThuHoKhauController = require("../controllers/khoanThuHoKhauController");

<<<<<<< HEAD
// gán khoản thu cho hộ khẩu
=======
// gán khoản thu cho hộ khẩu - route mới (không có /assign)
router.post(
  "/khoan-thu-ho-khau",
  khoanThuHoKhauController.assignKhoanThuToHoKhau
);

// gán khoản thu cho hộ khẩu - route cũ (giữ lại để tương thích)
>>>>>>> main
router.post(
  "/khoan-thu-ho-khau/assign",
  khoanThuHoKhauController.assignKhoanThuToHoKhau
);

// get dsach khoản thu của hộ khẩu
router.get(
<<<<<<< HEAD
  "/khoan-thu-ho-khau/ho-khau/:id_ho_khau",
  khoanThuHoKhauController.getKhoanThuByHoKhau
);

=======
  "/khoan-thu-ho-khau/:id",
  khoanThuHoKhauController.getKhoanThuByHoKhau
);

// cập nhật trạng thái thanh toán
router.put(
  "/khoan-thu-ho-khau/:maHoKhau/:maKhoanThu",
  khoanThuHoKhauController.updateTrangThaiKhoanThu
);

// xóa khoản thu khỏi hộ khẩu (bỏ gán)
router.delete(
  "/khoan-thu-ho-khau/:maHoKhau/:maKhoanThu",
  khoanThuHoKhauController.deleteKhoanThuFromHoKhau
);

>>>>>>> main
module.exports = router;
