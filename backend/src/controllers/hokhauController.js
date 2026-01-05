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
    }
},
    {
        tableName: "CanHo",
        timestamps: false
    }
)

HoKhau.belongsTo(CanHo, { foreignKey: "MaCanHo" })
CanHo.hasOne(HoKhau, { foreignKey: "MaCanHo" })

// CREATE
const createHoKhau = async (req, res) => {
    try {
        let { MaHoKhau, MaCanHo } = req.body

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
        const data = await HoKhau.create({
            MaHoKhau,
            MaCanHo,
            DiaChiThuongTru: req.body.DiaChiThuongTru,
            NoiCap: req.body.NoiCap,
            NgayCap: req.body.NgayCap
        })
        if (MaCanHo) {
            await CanHo.update({ MaHoKhau }, { where: { MaCanHo } })
        }
        res.json(data)
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
            ...data.toJSON(),
            TenCanHo: data.CanHo ? data.CanHo.TenCanHo : null,
            ChuHo: chuHo ? chuHo.HoTen : null
        })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// UPDATE
const updateHoKhau = async (req, res) => {
    try {
        const hoKhau = await HoKhau.findByPk(req.params.id)
        if (!hoKhau) {
            return res.status(404).json({
                message: "Không tìm thấy hộ khẩu!"
            })
        }

        const { DiaChiThuongTru, NoiCap, NgayCap } = req.body

        await hoKhau.update({
            DiaChiThuongTru: DiaChiThuongTru?.trim() || null,
            NoiCap: NoiCap?.trim() || null,
            NgayCap: NgayCap?.trim() || null
        })

        const chuHo = await NhanKhau.findOne({
            where: {
                MaHoKhau: hoKhau.MaHoKhau,
                QuanHe: "chu ho"
            }
        })

        res.json({
            ...hoKhau.toJSON(),
            ChuHo: chuHo ? chuHo.HoTen : null
        })
    } catch (err) {
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