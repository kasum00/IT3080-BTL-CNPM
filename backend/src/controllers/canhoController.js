const { DataTypes, Op } = require("sequelize");
const sequelize = require("../config/db");

const CanHo = sequelize.define(
  "CanHo",
  {
    MaCanHo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    MaHoKhau: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    TenCanHo: {
      type: DataTypes.STRING(100),
    },
    Tang: {
      type: DataTypes.STRING(50),
    },
    DienTich: {
      type: DataTypes.FLOAT,
    },
    TrangThai: {
      type: DataTypes.STRING(20),
      defaultValue: "trong",
    },
    ngay_bat_dau_thue: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    ngay_ket_thuc_thue: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    MoTa: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    tableName: "CanHo",
    timestamps: false,
  }
);

const HoKhau = sequelize.define(
  "HoKhau",
  {
    MaHoKhau: {
      type: DataTypes.STRING(10),
      primaryKey: true,
      allowNull: false,
    },
    MaCanHo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
    },
    DiaChiThuongTru: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    NoiCap: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    NgayCap: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    tableName: "HoKhau",
    timestamps: false,
  }
);

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
    },
    HoTen: {
      type: DataTypes.STRING(100),
    },
    QuanHe: {
      type: DataTypes.STRING(30),
    },
  },
  {
    tableName: "NhanKhau",
    timestamps: false,
  }
);

// Tìm hộ khẩu đang ở căn hộ (nếu không trống)
const findHouseholdInAparment = async (req, res) => {
  try {
    const data = await CanHo.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({
        message: "Không tìm thấy căn hộ!",
      });
    }

    // nếu trống thì ??  - temporary
    if (data.TrangThai === "trong") {
      return res.status(200).json({
        message: "Căn hộ đang trống, không có gia đình nào đang sống ",
        canHo: data,
        hoKhau: null,
      });
    }

    const hoKhau = await HoKhau.findOne({
      where: { MaCanHo: req.params.id },
    });

    if (!hoKhau) {
      return res.status(404).json({
        message: "Không tìm thấy hộ khẩu cho căn hộ này",
        canHo: data,
      });
    }

    res.status(200).json({
      message: "Tìm thấy hộ khẩu thành công",
      canHo: data,
      hoKhau: hoKhau,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
      message: "Lỗi khi tìm hộ khẩu",
    });
  }
};

// Tìm chủ hộ từ căn hộ
const findOwnerByApartment = async (req, res) => {
  try {
    const canHo = await CanHo.findByPk(req.params.id);

    if (!canHo) {
      return res.status(404).json({
        message: "Không tìm thấy căn hộ!",
      });
    }

    if (canHo.TrangThai === "trong") {
      return res.status(200).json({
        message: "Căn hộ đang trống, không có chủ hộ",
        canHo: canHo,
        chuHo: null,
      });
    }

    const hoKhau = await HoKhau.findOne({
      where: { MaCanHo: req.params.id },
    });

    if (!hoKhau) {
      return res.status(404).json({
        message: "Không tìm thấy hộ khẩu cho căn hộ này",
        canHo: canHo,
      });
    }

    const chuHo = await NhanKhau.findOne({
      where: {
        MaHoKhau: hoKhau.MaHoKhau,
        QuanHe: "chu ho",
      },
    });

    if (!chuHo) {
      return res.status(404).json({
        message: "Không tìm thấy chủ hộ cho căn hộ này",
        canHo: canHo,
        hoKhau: hoKhau,
      });
    }

    res.status(200).json({
      message: "Tìm thấy chủ hộ thành công",
      canHo: canHo,
      hoKhau: hoKhau,
      chuHo: chuHo,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
      message: "Lỗi khi tìm chủ hộ",
    });
  }
};

const getCanHoTrong = async (req, res) => {
  try {
    const { currentMaCanHo } = req.query;

    const whereCondition = {
      [Op.or]: [{ MaHoKhau: { [Op.is]: null } }],
    };

    if (currentMaCanHo) {
      whereCondition[Op.or].push({
        MaCanHo: currentMaCanHo,
      });
    }

    const data = await CanHo.findAll({
      where: whereCondition,
      attributes: ["MaCanHo", "TenCanHo"],
      order: [["TenCanHo", "ASC"]],
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: err.message,
      message: "Lỗi server!",
    });
  }
};

// VALIDATE
const validateCanHoInput = (data) => {
  const missInput = [];

  if (!data.TenCanHo?.trim()) {
    missInput.push("Tên căn hộ");
  }
  if (!data.Tang?.trim()) {
    missInput.push("Tầng");
  }
  if (data.DienTich === undefined || data.DienTich === "") {
    missInput.push("Diện tích");
  } else if (isNaN(Number(data.DienTich)) || Number(data.DienTich) <= 0) {
    return "Diện tích không hợp lệ!";
  }
  if (missInput.length > 0) {
    return `Thiếu thông tin: ${missInput.join(", ")}`;
  }
  const hasStart = !!data.ngay_bat_dau_thue;
  const hasEnd = !!data.ngay_ket_thuc_thue;

  if (hasStart || hasEnd) {
    if (!hasStart || !hasEnd) {
      return "Phải nhập đầy đủ ngày bắt đầu và kết thúc cho thuê!";
    }
    const start = new Date(data.ngay_bat_dau_thue);
    const end = new Date(data.ngay_ket_thuc_thue);

    if (end <= start) {
      return "Ngày kết thúc cho thuê không hợp lệ!";
    }
  }

  return null;
};

// CREATE
const createCanHo = async (req, res) => {
  try {
    const errMsg = validateCanHoInput(req.body);
    if (errMsg) {
      return res.status(400).json({
        message: errMsg,
      });
    }
    const data = await CanHo.create({
      TenCanHo: req.body.TenCanHo,
      Tang: req.body.Tang,
      DienTich: req.body.DienTich,
      MoTa: req.body.MoTa || null,
      ngay_bat_dau_thue: req.body.ngay_bat_dau_thue || null,
      ngay_ket_thuc_thue: req.body.ngay_ket_thuc_thue || null,
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL
const getAllCanHo = async (req, res) => {
  try {
    const data = await CanHo.findAll({
      order: [["MaCanHo", "ASC"]],
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET BY ID
const getCanHoByID = async (req, res) => {
  try {
    const data = await CanHo.findByPk(req.params.id);
    if (!data) {
      return res.status(404).json({
        message: "Không tìm thấy căn hộ!",
      });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
const updateCanHo = async (req, res) => {
  try {
    const canHo = await CanHo.findByPk(req.params.id);
    if (!canHo) {
      return res.status(404).json({
        message: "Không tìm thấy căn hộ!",
      });
    }

    const errMsg = validateCanHoInput(req.body);
    if (errMsg) {
      return res.status(400).json({
        message: errMsg,
      });
    }

    await canHo.update({
      TenCanHo: req.body.TenCanHo,
      Tang: req.body.Tang,
      DienTich: req.body.DienTich,
      MoTa: req.body.MoTa,
      ngay_bat_dau_thue: req.body.ngay_bat_dau_thue || null,
      ngay_ket_thuc_thue: req.body.ngay_ket_thuc_thue || null,
    });

    res.json(canHo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GAN CHU HO
const ganChuHo = async (req, res) => {
  const { ma_ho_khau, ma_nhan_khau } = req.body;

  const trans = await sequelize.transaction();

  try {
    const nhanKhau = await NhanKhau.findByPk(ma_nhan_khau, {
      transaction: trans,
    });
    if (!nhanKhau || nhanKhau.MaHoKhau !== ma_ho_khau) {
      await trans.rollback();
      return res.status(400).json({
        message: "Nhân khẩu không thuộc hộ khẩu này!",
      });
    }

    const chuHo = await NhanKhau.findOne({
      where: {
        MaHoKhau: ma_ho_khau,
        QuanHe: "chu ho",
      },
      transaction: trans,
    });

    if (chuHo) {
      await trans.rollback();
      return res.status(400).json({
        message: "Hộ khẩu này đã có chủ hộ rồi!",
      });
    }

    await nhanKhau.update({ QuanHe: "chu ho" }, { transaction: trans });
    await trans.commit();
    res.json({
      message: "Gán chủ hộ thành công!",
    });
  } catch (err) {
    await trans.rollback();
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  CanHo,
  createCanHo,
  getAllCanHo,
  getCanHoByID,
  updateCanHo,
  findHouseholdInAparment,
  findOwnerByApartment,
  ganChuHo,
  getCanHoTrong,
};
