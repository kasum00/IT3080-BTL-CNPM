const { DataTypes, Op } = require("sequelize")
const sequelize = require("../config/db")
const HoKhau = require("./hoKhauController").HoKhau

const LoaiPhuongTien = sequelize.define(
    "LoaiPhuongTien",
    {
        MaLoaiPT: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        TenLoai: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        PhiGuiXe: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        MoTa: {
            type: DataTypes.STRING(200)
        }
    },
    {
        tableName: "LoaiPhuongTien",
        timestamps: false
    }
)

const PhuongTien = sequelize.define(
    "PhuongTien",
    {
        MaPhuongTien: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        BienSo: {
            type: DataTypes.STRING(20),
            unique: true,
            allowNull: true
        },
        MaLoaiPT: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        MaHoKhau: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        ChuSoHuu: {
            type: DataTypes.STRING(100)
        },
        GhiChu: {
            type: DataTypes.STRING(200)
        }
    },
    {
        tableName: "PhuongTien",
        timestamps: false
    }
)

PhuongTien.belongsTo(LoaiPhuongTien, { foreignKey: "MaLoaiPT" })
LoaiPhuongTien.hasMany(PhuongTien, { foreignKey: "MaLoaiPT" })

const validatePhuongTienInput = (data, isCreate = true) => {
    const miss = []

    if (isCreate && !data.MaHoKhau?.trim()) miss.push("Mã hộ khẩu")
    if (isCreate && !data.MaLoaiPT) miss.push("Loại phương tiện")

    if (miss.length > 0) {
        return `Thiếu thông tin: ${miss.join(", ")}`
    }

    if (data.MaHoKhau) {
        const regexHK = /^HK\d{3}$/
        if (!regexHK.test(data.MaHoKhau.trim())) {
            return "Mã hộ khẩu không hợp lệ! (VD: HK001)"
        }
    }

    if (![1, 2, 3].includes(Number(data.MaLoaiPT))) {
        return "Loại phương tiện không hợp lệ!"
    }

    if (data.BienSo !== undefined && data.BienSo !== null) {
        const bienSo = data.BienSo.trim()

        if (bienSo === "") {
            data.BienSo = null
        } else {
            if (bienSo.length > 20) {
                return "Biển số không được vượt quá 20 ký tự!"
            }

            const regexBienSo = /^[0-9A-Z\-\.]+$/i
            if (!regexBienSo.test(bienSo)) {
                return "Biển số không hợp lệ!"
            }
        }
    }

    if (data.ChuSoHuu && data.ChuSoHuu.length > 100) {
        return "Tên chủ sở hữu không được vượt quá 100 ký tự!"
    }

    return null
}

const createPhuongTien = async (req, res) => {
    try {
        const errMsg = validatePhuongTienInput(req.body, true)
        if (errMsg) {
            return res.status(400).json({ message: errMsg })
        }

        const {
            BienSo,
            MaLoaiPT,
            MaHoKhau,
            ChuSoHuu,
            GhiChu
        } = req.body

        const hoKhau = await HoKhau.findByPk(MaHoKhau)
        if (!hoKhau) {
            return res.status(400).json({
                message: "Hộ khẩu không tồn tại!"
            })
        }

        if (BienSo && BienSo.trim() !== "") {
            const existBienSo = await PhuongTien.findOne({
                where: { BienSo: BienSo.trim() }
            })
            if (existBienSo) {
                return res.status(400).json({
                    message: "Biển số đã tồn tại!"
                })
            }
        }

        const loai = await LoaiPhuongTien.findByPk(MaLoaiPT)
        if (!loai) {
            return res.status(400).json({
                message: "Loại phương tiện không tồn tại!"
            })
        }

        const pt = await PhuongTien.create({
            BienSo: BienSo?.trim() || null,
            MaLoaiPT,
            MaHoKhau,
            ChuSoHuu: ChuSoHuu?.trim() || null,
            GhiChu: GhiChu?.trim() || null
        })

        res.json(pt)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

const getAllPhuongTien = async (req, res) => {
    try {
        const data = await PhuongTien.findAll({
            include: [{
                model: LoaiPhuongTien,
                attributes: ["TenLoai"]
            }],
            order: [["MaHoKhau", "ASC"]]
        })

        const result = data.map(pt => ({
            MaPhuongTien: pt.MaPhuongTien,
            MaHoKhau: pt.MaHoKhau,
            TenPhuongTien: pt.LoaiPhuongTien.TenLoai,
            BienSo: pt.BienSo,
            MaLoaiPT: pt.MaLoaiPT,
            ChuSoHuu: pt.ChuSoHuu
        }))

        res.json(result)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

const getPhuongTienByID = async (req, res) => {
    try {
        const pt = await PhuongTien.findByPk(req.params.id, {
            include: [{
                model: LoaiPhuongTien,
                attributes: ["TenLoai", "PhiGuiXe"]
            }]
        })

        if (!pt) {
            return res.status(404).json({
                message: "Không tìm thấy phương tiện!"
            })
        }

        res.json({
            MaPhuongTien: pt.MaPhuongTien,
            MaHoKhau: pt.MaHoKhau,
            TenPhuongTien: pt.LoaiPhuongTien.TenLoai,
            BienSo: pt.BienSo,
            MaLoaiPT: pt.MaLoaiPT,
            ChuSoHuu: pt.ChuSoHuu,
            PhiGuiXe: pt.LoaiPhuongTien.PhiGuiXe
        })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

const deletePhuongTien = async (req, res) => {
    try {
        const pt = await PhuongTien.findByPk(req.params.id)
        if (!pt) {
            return res.status(404).json({
                message: "Không tìm thấy phương tiện!"
            })
        }

        await pt.destroy()
        res.json({
            message: "Xóa phương tiện thành công!"
        })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

module.exports = {
    PhuongTien,
    LoaiPhuongTien,
    createPhuongTien,
    getAllPhuongTien,
    getPhuongTienByID,
    deletePhuongTien,
}
