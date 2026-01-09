const { DataTypes } = require("sequelize")
const sequelize = require("../config/db")

const HoKhau = sequelize.define(
    "HoKhau", {
    MaHoKhau: {
        type: DataTypes.STRING(10),
        primaryKey: true,
        allowNull: false
    },
    MaCanHo: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: true
    },
    DiaChiThuongTru: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    NoiCap: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    NgayCap: {
        type: DataTypes.DATEONLY,
        allowNull: true
    }
},
    {
        tableName: "HoKhau",
        timestamps: false
    }
)

const NhanKhau = sequelize.define(
    "NhanKhau", {
    MaNhanKhau: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    MaHoKhau: {
        type: DataTypes.STRING(10),
    },
    HoTen: {
        type: DataTypes.STRING(100)
    },
    QuanHe: {
        type: DataTypes.STRING(30)
    }
},
    {
        tableName: "NhanKhau",
        timestamps: false
    }
)

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
    TrangThai: {
        type: DataTypes.ENUM("trong", "chu_o", "cho_thue"),
        allowNull: false,
        defaultValue: "trong"
    }
},
    {
        tableName: "CanHo",
        timestamps: false
    }
)

HoKhau.belongsTo(CanHo, { foreignKey: "MaCanHo" })
CanHo.hasOne(HoKhau, { foreignKey: "MaCanHo" })
HoKhau.hasMany(NhanKhau, { foreignKey: "MaHoKhau" })
NhanKhau.belongsTo(HoKhau, { foreignKey: "MaHoKhau" })

const validateHoKhauInput = (data, isCreate = true) => {
    const missInput = []

    if (isCreate && !data.MaHoKhau?.trim()) {
        missInput.push("Mã hộ khẩu")
    }
    if (isCreate && !data.MaCanHo) {
        missInput.push("Mã căn hộ")
    }

    if (missInput.length > 0) {
        return `Thiếu thông tin: ${missInput.join(", ")}`
    }

    if(isCreate && data.MaHoKhau) {
        const maHoKhau = data.MaHoKhau.trim()
        const regex = /^HK\d{3}$/

        if(!regex.test(maHoKhau)) {
            return "Mã hộ khẩu không hợp lệ!"
        }
    }

    if (data.DiaChiThuongTru) {
        if (data.DiaChiThuongTru.length > 200) {
            return "Địa chỉ thường trú không được vượt quá 200 ký tự!"
        }
    }

    if (data.NoiCap) {
        if (data.NoiCap.length > 200) {
            return "Nơi cấp không được vượt quá 200 ký tự!"
        }
    }

    if (data.NgayCap) {
        const ngayCap = new Date(data.NgayCap)
        const today = new Date()

        if (isNaN(ngayCap.getTime())) {
            return "Ngày cấp không hợp lệ!"
        }

        ngayCap.setHours(0, 0, 0, 0)
        today.setHours(0, 0, 0, 0)

        if (ngayCap > today) {
            return "Ngày cấp không được lớn hơn ngày hiện tại!"
        }
    }
    return null
}

// CREATE
const createHoKhau = async (req, res) => {
    try {
        const data = req.body

        const errMsg = validateHoKhauInput(data, true)
        if (errMsg) {
            return res.status(400).json({ message: errMsg })
        }

        let { MaHoKhau, MaCanHo, DiaChiThuongTru, NoiCap, NgayCap } = data

        if (MaCanHo === "" || MaCanHo === undefined) {
            MaCanHo = null
        }

        const checkExist = await HoKhau.findByPk(MaHoKhau)
        if (checkExist) {
            return res.status(400).json({
                message: "Mã hộ khẩu đã tồn tại!"
            })
        }
        if (MaCanHo) {
            const canHo = await CanHo.findByPk(MaCanHo)
            if (!canHo) {
                return res.status(400).json({
                    message: "Căn hộ không tồn tại!"
                })
            }
            if (canHo.MaHoKhau) {
                return res.status(400).json({
                    message: "Căn hộ này đã có hộ khẩu!"
                })
            }
        }
        const hoKhau = await HoKhau.create({
            MaHoKhau,
            MaCanHo,
            DiaChiThuongTru: DiaChiThuongTru?.trim() || null,
            NoiCap: NoiCap?.trim() || null,
            NgayCap: NgayCap?.trim() || null
        })
        if (MaCanHo) {
            await CanHo.update({ MaHoKhau }, { where: { MaCanHo } })
        }
        res.json(hoKhau)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// GET ALL
const getAllHoKhau = async (req, res) => {
    try {
        const data = await HoKhau.findAll({
            include: [{
                model: CanHo,
                attributes: ["TenCanHo"]
            }],
            order: [["MaHoKhau", "ASC"]]
        })

        const result = []
        for (const hk of data) {
            const chuHo = await NhanKhau.findOne({
                where: {
                    MaHoKhau: hk.MaHoKhau,
                    QuanHe: "chu ho"
                }
            })
            result.push({
                ...hk.toJSON(),
                TenCanHo: hk.CanHo ? hk.CanHo.TenCanHo : null,
                ChuHo: chuHo ? chuHo.HoTen : null
            })
        }
        res.json(result)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// GET BY ID
const getHoKhauByID = async (req, res) => {
    try {
        const data = await HoKhau.findByPk(req.params.id, {
            include: [{
                model: CanHo,
                attributes: ["TenCanHo"]
            }]
        })
        if (!data) {
            return res.status(404).json({
                message: "Không tìm thấy hộ khẩu!"
            })
        }
        const chuHo = await NhanKhau.findOne({
            where: {
                MaHoKhau: data.MaHoKhau,
                QuanHe: "chu ho"
            }
        })

        res.json({
            MaHoKhau: data.MaHoKhau,
            MaCanHo: data.MaCanHo,
            TenCanHo: data.CanHo ? data.CanHo.TenCanHo : null,
            DiaChiThuongTru: data.DiaChiThuongTru,
            NoiCap: data.NoiCap,
            NgayCap: data.NgayCap,
            ChuHo: chuHo?.HoTen || null
        })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// UPDATE
const updateHoKhau = async (req, res) => {
    const trans = await sequelize.transaction()
    try {
        const hoKhau = await HoKhau.findByPk(req.params.id, { transaction: trans })
        if (!hoKhau) {
            await trans.rollback()
            return res.status(404).json({
                message: "Không tìm thấy hộ khẩu!"
            })
        }

        const errMsg = validateHoKhauInput(req.body, false)
        if (errMsg) {
            await trans.rollback()
            return res.status(400).json({ message: errMsg })
        }

        let { MaCanHo, DiaChiThuongTru, NoiCap, NgayCap } = req.body

        if (MaCanHo === "" || MaCanHo === undefined) {
            MaCanHo = null
        }

        if (MaCanHo !== hoKhau.MaCanHo) {
            if (hoKhau.MaCanHo) {
                const canHoCu = await CanHo.findByPk(hoKhau.MaCanHo, { transaction: trans })
                if (canHoCu) {
                    if (canHoCu.TrangThai === "cho_thue") {
                        await trans.rollback()
                        return res.status(400).json({
                            message: "Không thể chuyển hộ khẩu khỏi căn hộ đang cho thuê!"
                        })
                    }
                }

                await CanHo.update(
                    { MaHoKhau: null, TrangThai: "trong" },
                    { where: { MaCanHo: hoKhau.MaCanHo }, transaction: trans }
                )
            }
            if (MaCanHo) {
                const canHoMoi = await CanHo.findByPk(MaCanHo, { transaction: trans })
                if (!canHoMoi) {
                    await trans.rollback()
                    return res.status(400).json({
                        message: "Căn hộ không tồn tại!"
                    })
                }
                await canHoMoi.update(
                    { MaHoKhau: hoKhau.MaHoKhau, TrangThai: "chu_o" },
                    { transaction: trans }
                )
            }

            await hoKhau.update({ MaCanHo }, { transaction: trans })
        }

        await hoKhau.update({
            DiaChiThuongTru: DiaChiThuongTru?.trim() || null,
            NoiCap: NoiCap?.trim() || null,
            NgayCap: NgayCap || null
        }, { transaction: trans })

        const chuHo = await NhanKhau.findOne({
            where: {
                MaHoKhau: hoKhau.MaHoKhau,
                QuanHe: "chu ho"
            },
            transaction: trans
        })
        await trans.commit()

        res.json({
            ...hoKhau.toJSON(),
            ChuHo: chuHo?.HoTen || null
        })
    } catch (err) {
        await trans.rollback()
        res.status(500).json({ error: err.message })
    }
}

// DELETE
const deleteHoKhau = async (req, res) => {
    const id = req.params.id
    const trans = await sequelize.transaction()

    try {
        const hoKhau = await HoKhau.findByPk(id, { transaction: trans })
        if (!hoKhau) {
            return res.status(404).json({
                message: "Không tìm thấy hộ khẩu!"
            })
        }

        const ma_can_ho = hoKhau.MaCanHo
        await NhanKhau.destroy({
            where: { MaHoKhau: id },
            transaction: trans
        })

        await hoKhau.destroy({ transaction: trans })

        if (ma_can_ho) {
            await sequelize.query(`
                UPDATE CanHo
                SET TrangThai = 'trong'
                WHERE MaCanHo = :ma_can_ho`,
                {
                    replacements: { ma_can_ho },
                    transaction: trans
                })
        }
        await trans.commit()
        res.json({
            message: "Xóa hộ khẩu thành công!"
        })
    } catch (err) {
        await trans.rollback()
        res.status(500).json({ error: err.message })
    }
}

module.exports = {
    HoKhau,
    createHoKhau,
    getAllHoKhau,
    getHoKhauByID,
    updateHoKhau,
    deleteHoKhau,
}