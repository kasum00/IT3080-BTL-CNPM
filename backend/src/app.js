const express = require("express");
const app = express();

const canHoRoutes = require('./routes/canHoRoutes');
const hoKhauRoutes = require("./routes/hokhauRoutes");
const khoanThuRoutes = require("./routes/khoanthuRoutes");
const khoanThuHoKhauRoutes = require("./routes/khoanThuHoKhauRoutes");
const hoaDonRoutes = require("./routes/hoaDonRoutes");

app.use(express.json());

app.use("/api/can-ho", canHoRoutes);
app.use("/api/ho-khau", hoKhauRoutes)

app.use("/api", khoanThuRoutes);
app.use("/api", khoanThuHoKhauRoutes);
app.use("/api", hoaDonRoutes);

app.listen(3000, () => console.log("Server running on port 3000"));
