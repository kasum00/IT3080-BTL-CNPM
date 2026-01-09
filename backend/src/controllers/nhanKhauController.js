const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const NhanKhau = sequelize.define(
  "NhanKhau",
  {
    MaNhanKhau: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    MaHoKhau: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    HoTen: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    CanCuocCongDan: {
      type: DataTypes.STRING(12),
      allowNull: false,
      unique: true,
    },
    NgaySinh: DataTypes.DATE,
    NoiSinh: DataTypes.STRING(100),
    DanToc: DataTypes.STRING(20),
    NgheNghiep: DataTypes.STRING(50),
    QuanHe: {
      type: DataTypes.ENUM("chu ho", "vo", "con", "nguoi thue", "thanh vien"),
      allowNull: false,
    },
    GhiChu: DataTypes.STRING(200),
    TrangThai: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  },
  {
    tableName: "NhanKhau",
    timestamps: false,
  }
);
//create
const createNhanKhau = async (req, res) => {
  try {
    const { MaHoKhau, QuanHe } = req.body;

    // Nếu thêm chủ hộ → kiểm tra hộ đã có chủ hộ chưa
    if (QuanHe === "chu ho") {
      const existedChuHo = await NhanKhau.findOne({
        where: {
          MaHoKhau,
          QuanHe: "chu ho",
        },
      });

      if (existedChuHo) {
        return res.status(400).json({
          message: "Mỗi hộ khẩu chỉ được có một chủ hộ!",
        });
      }
    }

    const data = await NhanKhau.create(req.body);
    res.json(data);
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        message: "CCCD đã tồn tại, vui lòng nhập CCCD khác!",
      });
    }

    res.status(500).json({ err: err.message });
  }
};

// get all
const getAllNhanKhau = async (req, res) => {
  try {
    const data = await NhanKhau.findAll({
      order: [
        ["MaHoKhau", "ASC"],
        ["QuanHe", "ASC"], // chủ hộ
      ],
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

//get by id
const getNhanKhauByID = async (req, res) => {
  try {
    const data = await NhanKhau.findByPk(req.params.id);
    if (!data) {
      return res.status(404).json({
        message: "Không tìm thấy nhân khẩu!",
      });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//update
const { Op } = require("sequelize");

const updateNhanKhau = async (req, res) => {
  try {
    const nhanKhau = await NhanKhau.findByPk(req.params.id);
    if (!nhanKhau) {
      return res.status(404).json({ message: "Không tìm thấy nhân khẩu!" });
    }

    const newQuanHe = req.body.QuanHe ?? nhanKhau.QuanHe;
    const newMaHoKhau = req.body.MaHoKhau ?? nhanKhau.MaHoKhau;

    // 🔎 Đếm số chủ hộ trong hộ
    const chuHoCount = await NhanKhau.count({
      where: {
        MaHoKhau: nhanKhau.MaHoKhau,
        QuanHe: "chu ho",
      },
    });

    // Không cho hộ khẩu không có chủ hộ
    if (
      nhanKhau.QuanHe === "chu ho" &&
      chuHoCount === 1 &&
      newQuanHe !== "chu ho"
    ) {
      return res.status(400).json({
        message: "Hộ khẩu phải có ít nhất một chủ hộ!",
      });
    }

    // Đổi chủ hộ
    if (newQuanHe === "chu ho") {
      const oldChuHo = await NhanKhau.findOne({
        where: {
          MaHoKhau: newMaHoKhau,
          QuanHe: "chu ho",
          MaNhanKhau: { [Op.ne]: nhanKhau.MaNhanKhau },
        },
      });

      if (oldChuHo) {
        await oldChuHo.update({ QuanHe: "thanh vien" });
      }
    }

    const { MaHoKhau, HoTen, CanCuocCongDan } = req.body;

    // Validate null
    if (!MaHoKhau || !HoTen || !CanCuocCongDan) {
      return res.status(400).json({
        message: "Dữ liệu không hợp lệ, vui lòng nhập lại!",
      });
    }
    if (!nhanKhau) {
      return res.status(404).json({
        message: "Không tìm thấy nhân khẩu!",
      });
    }

    // KIỂM TRA CCCD TRÙNG (trừ chính nó)
    const cccdExist = await NhanKhau.findOne({
      where: {
        CanCuocCongDan,
        MaNhanKhau: { [require("sequelize").Op.ne]: req.params.id },
      },
    });

    if (cccdExist) {
      return res.status(400).json({
        message: "Căn cước công dân đã tồn tại! Vui lòng kiểm tra lại!",
      });
    }

    await nhanKhau.update(req.body);

    res.json({
      message: "Cập nhật nhân khẩu thành công!",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//delete

const deleteNhanKhau = async (req, res) => {
  try {
    const nhanKhau = await NhanKhau.findByPk(req.params.id);

    if (!nhanKhau) {
      return res.status(404).json({
        message: "Không tìm thấy nhân khẩu!",
      });
    }

    // Không cho xóa chủ hộ
    if (nhanKhau.QuanHe === "chu ho") {
      return res.status(400).json({
        message:
          "Không thể xóa chủ hộ. Vui lòng chuyển chủ hộ cho người khác trước!",
      });
    }

    await nhanKhau.destroy();

    res.json({ message: "Xóa nhân khẩu thành công!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//lấy tổng
const getTotalNhanKhau = async (req, res) => {
  try {
    const total = await NhanKhau.count();
    res.json({
      success: true,
      total: total,
    });
  } catch (error) {
    console.error("Lỗi lấy tổng nhân khẩu:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
    });
  }
};

module.exports = {
  NhanKhau,
  createNhanKhau,
  getAllNhanKhau,
  getNhanKhauByID,
  updateNhanKhau,
  deleteNhanKhau,
  getTotalNhanKhau,
};
