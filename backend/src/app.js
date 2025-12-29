const express = require("express");
const app = express();
const khoanThuRoutes = require("./routes/khoanthuRoutes");
const khoanThuHoKhauRoutes = require("./routes/khoanThuHoKhauRoutes");
const hoaDonRoutes = require("./routes/hoaDonRoutes");
const nhanKhauRoutes = require("./routes/nhanKhauRoutes");
const tamTruRoutes = require("./routes/tamTruRoutes");
const tamVangRoutes = require("./routes/tamVangRoutes");

app.use(express.json());
app.use("/api", khoanThuRoutes);
app.use("/api", khoanThuHoKhauRoutes);
app.use("/api", hoaDonRoutes);
app.use("/api", nhanKhauRoutes);
app.use("/api", tamTruRoutes);
app.use("/api", tamVangRoutes);

app.listen(3000, () => console.log("Server running on port 3000"));
