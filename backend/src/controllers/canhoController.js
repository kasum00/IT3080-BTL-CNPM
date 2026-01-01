const { DataTypes, where } = require("sequelize")
const sequelize = require('../config/db')

const CanHo = sequelize.define(
    "CanHo", {
    MaCanHo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    MaHoKhau: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    TenCanHo: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    Tang: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    DienTich: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    TrangThai: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "trong"
    },
    MoTa: {
        type: DataTypes.STRING(500),
        allowNull: true
    }
},
    {
        tableName: "CanHo",
        timestamps: false
    }
)

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

// Assign hộ khẩu cho căn hộ
const assignHoKhauForCanHo = async (req, res) => {
    const { ma_ho_khau, ma_can_ho_moi } = req.body
    const trans = await sequelize.transaction()

    try {
        const hoKhau = await HoKhau.findByPk(ma_ho_khau, { transaction: trans })
        if (!hoKhau) {
            await trans.rollback()
            return res.status(404).json({
                message: "Không tìm thấy hộ khẩu!"
            })
        }

        if (hoKhau.MaCanHo === ma_can_ho_moi) {
            await trans.rollback()
            return res.status(400).json({
                message: "Hộ khẩu đang ở căn hộ này rồi!"
            })
        }

        const canHoMoi = await HoKhau.findByPk(ma_can_ho_moi, { transaction: trans })
        if (!canHoMoi) {
            await trans.rollback()
            return res.status(404).json({
                message: "Không tìm thấy căn hộ mới!"
            })
        }

        if (canHoMoi.TrangThai === "cho_thue") {
            await trans.rollback()
            return res.status(400).json({
                message: "Căn hộ đang cho thuê, không thể gán hộ khẩu cư trú!"
            })
        }

        const isOccupied = await CanHo.findOne({
            where: { MaCanHo: ma_can_ho_moi },
            transaction: trans
        })

        if (isOccupied) {
            await trans.rollback()
            return res.status(400).json({
                message: "Căn hộ mới đã có hộ khác ở rồi!"
            })
        }

        const ma_can_ho_cu = hoKhau.MaCanHo

        await hoKhau.update({ MaCanHo: ma_can_ho_moi }, { transaction: trans })

        await canHoMoi.update({ TrangThai: "chu_o" }, { transaction: trans })

        if (ma_can_ho_cu) {
            await CanHo.update(
                { TrangThai: "trong" },
                { where: { MaCanHo: ma_can_ho_cu }, transaction: trans }
            )
        }

        await trans.commit()

        res.json({
            message: "Chuyển hộ khẩu sang căn hộ mới thành công",
            can_ho_cu: ma_can_ho_cu,
            can_ho_moi: ma_can_ho_moi
        })
    } catch (err) {
        await trans.rollback()
        res.status(500).json({ error: err.message })
    }
}

// CREATE
const createCanHo = async (req, res) => {
    try {
        const data = await CanHo.create(req.body)
        res.json(data)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// GET ALL
const getAllCanHo = async (req, res) => {
    try {
        const data = await CanHo.findAll({
            order: [["MaCanHo", "ASC"]]
        })
        res.json(data)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// GET BY ID
const getCanHoByID = async (req, res) => {
    try {
        const data = await CanHo.findByPk(req.params.id)
        if (!data) {
            return res.status(404).json({
                message: "Không tìm thấy căn hộ!"
            })
        }
        res.json(data)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// UPDATE
const updateCanHo = async (req, res) => {
    try {
        const data = await CanHo.findByPk(req.params.id)
        if (!data) {
            return res.status(404).json({
                message: "Không tìm thấy căn hộ!"
            })
        }

        await data.update({
            TenCanHo: req.body.TenCanHo,
            Tang: req.body.Tang,
            DienTich: req.body.DienTich,
            MoTa: req.body.MoTa
        })

        const updatedCanHo = await CanHo.findByPk(req.params.id)
        res.json(updatedCanHo)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// GAN CHU HO
const ganChuHo = async (req, res) => {
    const { ma_ho_khau, ma_nhan_khau } = req.body

    const trans = await sequelize.transaction()

    try {
        const nhanKhau = await NhanKhau.findByPk(ma_nhan_khau, { transaction: trans })
        if (!nhanKhau || nhanKhau.MaHoKhau !== ma_ho_khau) {
            await trans.rollback()
            return res.status(400).json({
                message: "Nhân khẩu không thuộc hộ khẩu này!"
            })
        }

        const chuHo = await NhanKhau.findOne({
            where: {
                MaHoKhau: ma_ho_khau,
                QuanHe: "chu ho",
            },
            transaction: trans
        })

        if (chuHo) {
            await trans.rollback()
            return res.status(400).json({
                message: "Hộ khẩu này đã có chủ hộ rồi!"
            })
        }

        await nhanKhau.update({ QuanHe: "chu ho" }, { transaction: trans })
        await trans.commit()
        res.json({
            message: "Gán chủ hộ thành công!"
        })
    } catch (err) {
        await trans.rollback()
        res.status(500).json({ error: err.message })
    }
}

module.exports = {
    CanHo,
    createCanHo,
    getAllCanHo,
    getCanHoByID,
    updateCanHo,
    findHouseholdInAparment,
    findOwnerByApartment,
    assignHoKhauForCanHo,
    ganChuHo
}