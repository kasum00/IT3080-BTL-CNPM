require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const TaiKhoan = require("../models/TaiKhoan");

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate
    if (!username || !password) {
      return res.status(400).json({ message: "Vui lòng nhập username và mật khẩu" });
    }

    // Find user
    const tk = await TaiKhoan.findOne({ where: { Username: username } });
    if (!tk) return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });

    // Status check
    if (Number(tk.TrangThai) !== 1) {
      return res.status(403).json({ message: "Tài khoản đã bị khóa" });
    }

    // Compare bcrypt
    const ok = await bcrypt.compare(password, tk.Password);
    if (!ok) return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });

    // Update last login
    await TaiKhoan.update(
      { LanDangNhapCuoi: new Date() },
      { where: { MaTaiKhoan: tk.MaTaiKhoan } }
    );

    // JWT
    const token = jwt.sign(
      { id: tk.MaTaiKhoan, username: tk.Username, role: tk.VaiTro },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "7d" }
    );

    return res.json({
      accessToken: token,
      user: {
        id: tk.MaTaiKhoan,
        username: tk.Username,
        role: tk.VaiTro,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Lỗi server" });
  }
};
