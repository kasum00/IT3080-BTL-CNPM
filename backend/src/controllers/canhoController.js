const {DataTypes} = require("sequelize")
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

// CREATE
const createCanHo = async (req, res) => {
    try {
        const data = await CanHo.create(req.body)
        res.json(data)
    } catch (err) {
        res.status(500).json({error: err.message})
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
        res.status(500).json({error: err.message})
    }
}

// GET BY ID
const getCanHoByID = async (req, res) => {
    try {
        const data = await CanHo.findByPk(req.params.id)
        if(!data) {
            return res.status(404).json({
                message: "Không tìm thấy căn hộ!"
            })
        }
        res.json(data)
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

// UPDATE
const updateCanHo = async (req, res) => {
    try {
        const data = await CanHo.findByPk(req.params.id)
        if(!data) {
            return res.status(404).json({
                message: "Không tìm thấy căn hộ!"
            })
        }

        await data.update(req.body)
        res.json({
            message: "Cập nhật căn hộ thành công!"
        })
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

module.exports = {
    CanHo,
    createCanHo,
    getAllCanHo,
    getCanHoByID,
    updateCanHo
}