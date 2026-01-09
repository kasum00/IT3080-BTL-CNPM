document.addEventListener("DOMContentLoaded", () => {
  let allHouseholds = [];

  /* ===============================
     LOAD THỐNG KÊ TỔNG QUAN
     =============================== */
  async function loadOverview() {
    try {
      const res = await fetch("http://localhost:3000/api/thong-ke/tong-quan");
      const response = await res.json();

      if (response.success) {
        const data = response.data;

        // Cập nhật các card
        document.getElementById("stat-so-khoan-thu").textContent =
          data.soKhoanThu;
        document.getElementById("stat-tong-tien").textContent = formatMoney(
          data.tongTien
        );
        document.getElementById("stat-da-thu").textContent = formatMoney(
          data.daThu
        );
        document.getElementById("stat-can-thu").textContent = formatMoney(
          data.canThu
        );
        document.getElementById("stat-ty-le").textContent = data.tyLeThu + "%";

        // Progress bar
        document.getElementById("progress-fill").style.width =
          data.tyLeThu + "%";

        // Số hộ
        document.getElementById("stat-ho-da-dong").textContent =
          data.soHoDaDongDu;
        document.getElementById("stat-tong-ho").textContent =
          data.soHoDaDongDu + data.soHoChuaDongDu;

        // Render theo loại
        renderTypeCards(data.theoLoai);
      }
    } catch (err) {
      console.error("Lỗi khi load thống kê tổng quan:", err);
      showNotify("Không thể tải dữ liệu thống kê!");
    }
  }

  /* ===============================
     RENDER THỐNG KÊ THEO LOẠI
     =============================== */
  function renderTypeCards(theoLoai) {
    const container = document.getElementById("type-cards");
    container.innerHTML = "";

    theoLoai.forEach((item) => {
      // Xác định class dựa vào đơn vị tính
      let cardClass = "type-khac";
      if (item.donViTinh === "nhan_khau") {
        cardClass = "type-nhan-khau";
      } else if (item.donViTinh === "ho_khau") {
        cardClass = "type-ho-khau";
      } else if (item.donViTinh === "dien_tich") {
        cardClass = "type-dien-tich";
      }

      const card = document.createElement("div");
      card.className = `type-card ${cardClass}`;
      card.innerHTML = `
        <h3>${item.loai}</h3>
        <div class="type-stats">
          <div class="type-stat">
            <span class="type-stat-label">Số khoản thu</span>
            <span class="type-stat-value">${item.soKhoanThu}</span>
          </div>
          <div class="type-stat">
            <span class="type-stat-label">Tổng tiền</span>
            <span class="type-stat-value">${formatMoney(item.tongTien)}</span>
          </div>
          <div class="type-stat">
            <span class="type-stat-label">Đã thu</span>
            <span class="type-stat-value">${formatMoney(item.daThu)}</span>
          </div>
          <div class="type-stat">
            <span class="type-stat-label">Cần thu</span>
            <span class="type-stat-value">${formatMoney(item.canThu)}</span>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  /* ===============================
     LOAD CHI TIẾT TỪNG KHOẢN THU
     =============================== */
  async function loadDetail() {
    try {
      const res = await fetch("http://localhost:3000/api/thong-ke/chi-tiet");
      const response = await res.json();

      if (response.success) {
        renderDetailTable(response.data);
      }
    } catch (err) {
      console.error("Lỗi khi load chi tiết:", err);
    }
  }

  function renderDetailTable(data) {
    const tbody = document.getElementById("detail-tbody");
    tbody.innerHTML = "";

    data.forEach((item) => {
      const tyLe = parseFloat(item.tyLeThu);
      const progressClass = tyLe >= 70 ? "high" : tyLe >= 40 ? "medium" : "low";

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${item.MaKhoanThu}</td>
        <td>${item.TenKhoanThu}</td>
        <td>${item.loaiKhoanThu}</td>
        <td>${item.soHoApDung}</td>
        <td>${formatMoney(item.tongTien)}</td>
        <td>${formatMoney(item.daThu)}</td>
        <td>${formatMoney(item.canThu)}</td>
        <td>
          <div class="table-progress">
            <span>${item.tyLeThu}%</span>
            <div class="table-progress-bar">
              <div class="table-progress-fill ${progressClass}" style="width: ${tyLe}%"></div>
            </div>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  /* ===============================
     LOAD THỐNG KÊ THEO HỘ
     =============================== */
  async function loadHouseholds() {
    try {
      const res = await fetch("http://localhost:3000/api/thong-ke/theo-ho");
      const response = await res.json();

      if (response.success) {
        allHouseholds = response.data;
        renderHouseholdTable(allHouseholds);
      }
    } catch (err) {
      console.error("Lỗi khi load thống kê theo hộ:", err);
    }
  }

  function renderHouseholdTable(data) {
    const tbody = document.getElementById("household-tbody");
    tbody.innerHTML = "";

    data.forEach((item) => {
      let statusClass, statusText;

      if (item.soKhoanThu === 0) {
        statusClass = "";
        statusText = "Chưa có khoản thu";
      } else if (item.soChuaDong === 0) {
        statusClass = "status-paid";
        statusText = "Đã đóng đủ";
      } else if (item.soDaDong > 0) {
        statusClass = "status-partial";
        statusText = `Đóng một phần (${item.soDaDong}/${item.soKhoanThu})`;
      } else {
        statusClass = "status-unpaid";
        statusText = "Chưa đóng";
      }

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${item.MaHoKhau}</td>
        <td>${item.TenCanHo || "N/A"}</td>
        <td>${item.ChuHo || "Chưa có"}</td>
        <td>${item.soKhoanThu}</td>
        <td>${formatMoney(item.tongTien)}</td>
        <td>${formatMoney(item.daThu)}</td>
        <td>${formatMoney(item.canThu)}</td>
        <td><span class="${statusClass}">${statusText}</span></td>
      `;
      tbody.appendChild(tr);
    });
  }

  /* ===============================
     LỌC THỐNG KÊ THEO HỘ
     =============================== */
  const searchInput = document.getElementById("search-household");
  const filterStatus = document.getElementById("filter-status");

  function filterHouseholds() {
    const keyword = searchInput.value.toLowerCase().trim();
    const status = filterStatus.value;

    let filtered = allHouseholds.filter((item) => {
      const matchKeyword =
        (item.MaHoKhau || "").toLowerCase().includes(keyword) ||
        (item.TenCanHo || "").toLowerCase().includes(keyword) ||
        (item.ChuHo || "").toLowerCase().includes(keyword);

      let matchStatus = true;
      if (status === "paid") {
        matchStatus = item.soKhoanThu > 0 && item.soChuaDong === 0;
      } else if (status === "partial") {
        matchStatus = item.soDaDong > 0 && item.soChuaDong > 0;
      } else if (status === "unpaid") {
        matchStatus = item.soKhoanThu > 0 && item.soDaDong === 0;
      }

      return matchKeyword && matchStatus;
    });

    renderHouseholdTable(filtered);
  }

  searchInput?.addEventListener("input", filterHouseholds);
  filterStatus?.addEventListener("change", filterHouseholds);

  /* ===============================
     LÀM MỚI DỮ LIỆU
     =============================== */
  document.getElementById("btn-refresh")?.addEventListener("click", () => {
    loadAllData();
    showNotify("Đã làm mới dữ liệu!");
  });

  /* ===============================
     HELPER FUNCTIONS
     =============================== */
  function formatMoney(amount) {
    if (!amount) return "0 đ";
    return parseInt(amount).toLocaleString("vi-VN") + " đ";
  }

  /* ===============================
     MODAL THÔNG BÁO
     =============================== */
  const notifyModal = document.getElementById("notifyModal");
  const notifyText = document.getElementById("notify-text");
  const notifyOk = document.getElementById("notify-ok");
  const closeNotify = document.getElementById("close-notify");

  function showNotify(msg) {
    notifyText.innerText = msg;
    notifyModal.classList.add("show");
  }

  [notifyOk, closeNotify].forEach((btn) =>
    btn?.addEventListener("click", () => notifyModal.classList.remove("show"))
  );

  /* ===============================
     LOAD ALL DATA
     =============================== */
  function loadAllData() {
    loadOverview();
    loadDetail();
    loadHouseholds();
  }

  // Load dữ liệu khi trang load
  loadAllData();
});
