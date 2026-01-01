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

// CREATE
const createHoKhau = async (req, res) => {
    try {
        const data = await HoKhau.create(req.body)
        res.json(data)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// GET ALL
const getAllHoKhau = async (req, res) => {
    try {
        const data = await HoKhau.findAll({
            order: [["MaHoKhau", "ASC"]]
        })

        const result = []
        for(const hk of data) {
            const chuHo = await NhanKhau.findOne({
                where: {
                    MaHoKhau: hk.MaHoKhau,
                    QuanHe: "chu ho"
                }
            })
            result.push({
                ...hk.toJSON(),
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
        const data = await HoKhau.findByPk(req.params.id)
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

        await hoKhau.update({
            DiaChiThuongTru: req.body.DiaChiThuongTru,
            NoiCap: req.body.NoiCap,
            NgayCap: req.body.NgayCap
        })

        const chuHo = await NhanKhau.findOne({
            where: {
                MaHoKhau: hoKhau.MaHoKhau,
                QuanHe: "chu ho"
            }
        })

        const updatedHoKhau = await HoKhau.findByPk(req.params.id)
        res.json({
            ...updateHoKhau.toJSON(),
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
        const hoKhau = await HoKhau.findByPk(id, {transaction: trans})
        if (!hoKhau) {
            return res.status(404).json({
                message: "Không tìm thấy hộ khẩu!"
            })
        }  

        const ma_can_ho = hoKhau.MaCanHo
        await NhanKhau.destroy({
            where: {MaHoKhau: id},
            transaction: trans
        })

        await hoKhau.destroy({transaction: trans})

        if(ma_can_ho) {
            await sequelize.query(`
                UPDATE CanHo
                SET TrangThai = 'trong'
                WHERE MaCanHo = :ma_can_ho`,
            {
                replacements: {ma_can_ho},
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