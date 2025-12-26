const {DataTypes} = require("sequelize")
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
        res.status(500).json({error: err.message})
    }
}

// GET ALL
const getAllHoKhau = async (req, res) => {
    try {
        const data = await HoKhau.findAll({
            order: [["MaHoKhau", "ASC"]]
        })
        res.json(data)
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

// GET BY ID
const getHoKhauByID = async (req, res) => {
    try {
        const data = await HoKhau.findByPk(req.params.id)
        if(!data) {
            return res.status(404).json({
                message: "Không tìm thấy hộ khẩu!"
            })
        }
        res.json(data)
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

// UPDATE
const updateHoKhau = async (req, res) => {
    try {
        const hoKhau = await HoKhau.findByPk(req.params.id)
        if(!hoKhau) {
            return res.status(404).json({
                message: "Không tìm thấy hộ khẩu!"
            })
        }

        await hoKhau.update(req.body)
        res.json({
            message: "Cập nhật hộ khẩu thành công!"
        })
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

// DELETE
const deleteHoKhau = async (req, res) => {
    try {
        const id = req.params.id
        const hoKhau = await HoKhau.findByPk(id)
        if(!hoKhau) {
            return res.status(404).json({
                message: "Không tìm thấy hộ khẩu!"
            })
        }

        await hoKhau.destroy()
        res.json({
            message: "Xóa hộ khẩu thành công!"
        })
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

// GAN CHU HO
const ganChuHo = async (req, res) => {
    const {ma_ho_khau, ma_nhan_khau} = req.body

    const trans = await sequelize.transaction()

    try {
        const nhanKhau = await NhanKhau.findByPk(ma_nhan_khau, {transaction: trans})
        if(!nhanKhau || nhanKhau.MaHoKhau !== ma_ho_khau) {
            await trans.rollback()
            return res.status(400).json({
                message: "Nhân khẩu không thuộc hộ khẩu này!"
            })
        }

        const chuHo = await NhanKhau.findOne({
            where: {
                MaHoKhau: ma_ho_khau,
                QuanHe: "chu_ho",
            },
            transaction: trans
        })

        if(chuHo) {
            await trans.rollback()
            return res.status(400).json({
                message: "Hộ khẩu này đã có chủ hộ rồi!"
            })
        }

        await nhanKhau.update({QuanHe: "chu_ho"}, {transaction: trans})
        await trans.commit()
        res.json({
            message: "Gán chủ hộ thành công!"
        })
    } catch (err) {
        await trans.rollback()
        res.status(500).json({error: err.message})
    }
}

module.exports = {
    HoKhau,
    createHoKhau,
    getAllHoKhau,
    getHoKhauByID,
    updateHoKhau,
    deleteHoKhau,
    ganChuHo
}