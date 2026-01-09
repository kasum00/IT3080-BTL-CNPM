require("dotenv").config();
const express = require("express");
const cors = require("cors");

const canHoRoutes = require("./routes/canHoRoutes");
const hoKhauRoutes = require("./routes/hokhauRoutes");
const khoanThuRoutes = require("./routes/khoanthuRoutes");
const khoanThuHoKhauRoutes = require("./routes/khoanThuHoKhauRoutes");
const hoaDonRoutes = require("./routes/hoaDonRoutes");
const nhanKhauRoutes = require("./routes/nhanKhauRoutes");
const tamTruRoutes = require("./routes/tamTruRoutes");
const tamVangRoutes = require("./routes/tamVangRoutes");

const authRoutes = require("./routes/authRoutes");
const thongKeRoutes = require("./routes/thongkeRoutes");

const app = express();

app.use(cors({
  origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
  credentials: true
}));

app.use(express.json());

// health check
app.get("/api/health", (req, res) => res.json({ ok: true }));

console.log("AUTH ROUTES:", authRoutes.stack?.map(l => ({
  path: l.route?.path,
  methods: l.route ? Object.keys(l.route.methods) : []
})).filter(x => x.path));

app.use("/api/can-ho", canHoRoutes);
app.use("/api/ho-khau", hoKhauRoutes);

app.use("/api", khoanThuRoutes);
app.use("/api", khoanThuHoKhauRoutes);
app.use("/api", hoaDonRoutes);

app.use("/api", nhanKhauRoutes);
app.use("/api", tamTruRoutes);
app.use("/api", tamVangRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/thong-ke", thongKeRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
