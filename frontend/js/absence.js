document.addEventListener("DOMContentLoaded", () => {
  /* ===============================
       BIẾN DÙNG CHUNG
    =============================== */
  let currentRow = null;
  let currentTamVangId = null;

  /* ===============================
       HÀM TÍNH SỐ NGÀY TẠM VẮNG
       (tính cả ngày bắt đầu)
    =============================== */
  function tinhSoNgay(start, end) {
    if (!start || !end) return 0;

    const d1 = new Date(start);
    const d2 = new Date(end);

    const diff = d2 - d1;
    if (diff < 0) return 0;

    return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
  }
  /* ===============================
   LOAD DANH SÁCH TẠM VẮNG
=============================== */
  async function loadTamVang() {
    try {
      const res = await fetch("http://localhost:3000/api/tam-vang");
      const data = await res.json();

      if (!res.ok) {
        showNotify(data.message || "Không tải được danh sách tạm vắng!");
        return;
      }

      const tbody = document.querySelector(".absence-table tbody");
      tbody.innerHTML = "";

      data.forEach((tv) => {
        const soNgay = tinhSoNgay(tv.NgayBatDau, tv.NgayKetThuc);
        const tr = document.createElement("tr");

        tr.innerHTML = `
        <td>${tv.CCCD || ""}</td>
        <td>${tv.HoTen || ""}</td>
        <td>${soNgay}</td>
        <td>${tv.LyDo || ""}</td>
        <td class="action">
          <span class="btn-detail"
            data-id="${tv.MaTamVang}">
          </span>
          <span class="btn-remove"></span>
        </td>
      `;

        // click chi tiết
        tr.querySelector(".btn-detail").addEventListener("click", function () {
          currentTamVangId = tv.MaTamVang;
          openDetail(this);
        });

        // click xóa
        tr.querySelector(".btn-remove").addEventListener("click", () => {
          currentRow = tr;
          currentTamVangId = tv.MaTamVang;
          deleteModal.classList.add("show");
        });

        tbody.appendChild(tr);
      });
    } catch (err) {
      showNotify("Lỗi kết nối server!");
    }
  }

  /* ===============================
       MODAL CHI TIẾT
    =============================== */
  const detailModal = document.getElementById("absence-modal");
  const closeDetailBtn = document.getElementById("close-modal");
  const btnCloseDetail = document.getElementById("btn-close-detail");
  const btnOpenEdit = document.getElementById("btn-open-edit");

  /* ===============================
       MODAL CHỈNH SỬA
    =============================== */
  const editModal = document.getElementById("editModal");
  const closeEditBtn = document.getElementById("btn-close-edit");
  const btnSaveEdit = document.getElementById("btn-save-edit");

  /* ===============================
       MODAL THÔNG BÁO
    =============================== */
  const notifyModal = document.getElementById("notifyModal");
  const notifyText = document.getElementById("notify-text");
  const notifyOk = document.getElementById("notify-ok");
  const closeNotify = document.getElementById("close-notify");

  const showNotify = (msg) => {
    notifyText.innerText = msg;
    notifyModal.classList.add("show");
  };

  [notifyOk, closeNotify].forEach((btn) =>
    btn?.addEventListener("click", () => notifyModal.classList.remove("show"))
  );

  /* ===============================
       HÀM MỞ MODAL CHI TIẾT (DÙNG CHUNG)
    =============================== */
  async function openDetail(btn) {
    currentRow = btn.closest("tr");
    const maTamVang = btn.dataset.id; // MaTamVang

    if (!maTamVang) {
      showNotify("Không xác định được mã tạm vắng!");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3000/api/tam-vang/${maTamVang}`
      );
      const data = await res.json();

      if (!res.ok) {
        showNotify(data.message || "Không tải được chi tiết tạm vắng!");
        return;
      }

      document.getElementById("modal-hoTen").value = data.HoTen || "";
      document.getElementById("modal-cccd").value = data.CCCD || "";
      document.getElementById("modal-ngayBatDau").value = data.NgayBatDau
        ? data.NgayBatDau.split("T")[0]
        : "";
      document.getElementById("modal-ngayKetThuc").value = data.NgayKetThuc
        ? data.NgayKetThuc.split("T")[0]
        : "";
      document.getElementById("modal-lyDo").value = data.LyDo || "";

      detailModal.classList.add("show");
    } catch (err) {
      showNotify("Lỗi kết nối server!");
    }
  }

  /* ===============================
       CLICK CHI TIẾT (DÒNG CÓ SẴN)
    =============================== */
  document.querySelectorAll(".btn-detail").forEach((btn) => {
    btn.addEventListener("click", function () {
      openDetail(this);
    });
  });

  /* ===============================
       ĐÓNG MODAL CHI TIẾT
    =============================== */
  [closeDetailBtn, btnCloseDetail].forEach((btn) =>
    btn?.addEventListener("click", () => detailModal.classList.remove("show"))
  );

  detailModal.addEventListener("click", (e) => {
    if (e.target === detailModal) {
      detailModal.classList.remove("show");
    }
  });

  /* ===============================
       CHI TIẾT → CHỈNH SỬA
    =============================== */
  btnOpenEdit.addEventListener("click", () => {
    detailModal.classList.remove("show");

    document.getElementById("edit-hoTen").value =
      document.getElementById("modal-hoTen").value;

    document.getElementById("edit-cccd").value =
      document.getElementById("modal-cccd").value;

    document.getElementById("edit-ngayBatDau").value =
      document.getElementById("modal-ngayBatDau").value;

    document.getElementById("edit-ngayKetThuc").value =
      document.getElementById("modal-ngayKetThuc").value;

    document.getElementById("edit-lyDo").value =
      document.getElementById("modal-lyDo").value;

    editModal.classList.add("show");
  });

  /* ===============================
       LƯU CHỈNH SỬA
    =============================== */
  btnSaveEdit.addEventListener("click", async () => {
    if (!currentRow || !currentTamVangId) return;

    const hoTen = document.getElementById("edit-hoTen").value;
    const cccd = document.getElementById("edit-cccd").value;
    const ngayBatDau = document.getElementById("edit-ngayBatDau").value;
    const ngayKetThuc = document.getElementById("edit-ngayKetThuc").value;
    const lyDo = document.getElementById("edit-lyDo").value;

    try {
      const res = await fetch(
        `http://localhost:3000/api/tam-vang/${currentTamVangId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            HoTen: hoTen,
            CCCD: cccd,
            NgayBatDau: ngayBatDau,
            NgayKetThuc: ngayKetThuc,
            LyDo: lyDo,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        showNotify(data.message || "Cập nhật tạm vắng thất bại!");
        return;
      }

      // cập nhật lại UI như cũ (KHÔNG ĐỔI LOGIC)
      const soNgay = tinhSoNgay(ngayBatDau, ngayKetThuc);
      currentRow.children[0].innerText = cccd;
      currentRow.children[1].innerText = hoTen;
      currentRow.children[2].innerText = soNgay;
      currentRow.children[3].innerText = lyDo;

      editModal.classList.remove("show");
      showNotify("Cập nhật tạm vắng thành công!");
    } catch (err) {
      showNotify("Lỗi kết nối server!");
    }
  });

  /* ===============================
       THÊM TẠM VẮNG
    =============================== */
  const addHoTen = document.getElementById("add-hoTen");
  const addCCCD = document.getElementById("add-cccd");
  const addNgayBatDau = document.getElementById("add-ngayBatDau");
  const addNgayKetThuc = document.getElementById("add-ngayKetThuc");
  const addLyDo = document.getElementById("add-lyDo");

  const btnAdd = document.querySelector(".btn-add");
  const addModal = document.getElementById("addModal");
  const closeAddBtn = document.getElementById("close-add");
  const cancelAddBtn = document.getElementById("cancel-add");
  const saveAddBtn = document.getElementById("save-add");

  btnAdd.addEventListener("click", () => {
    document.querySelectorAll("#addModal input").forEach((i) => (i.value = ""));
    addModal.classList.add("show");
  });

  [closeAddBtn, cancelAddBtn].forEach((btn) =>
    btn.addEventListener("click", () => addModal.classList.remove("show"))
  );

  saveAddBtn.addEventListener("click", async () => {
    try {
      const CanCuocCongDan = document.getElementById("add-cccd").value.trim();
      const ngayBatDau = document.getElementById("add-ngayBatDau").value;
      const ngayKetThuc = document.getElementById("add-ngayKetThuc").value;
      const lyDo = document.getElementById("add-lyDo").value.trim();

      if (!CanCuocCongDan || !ngayBatDau || !ngayKetThuc) {
        showNotify("Vui lòng nhập đầy đủ thông tin!");
        return;
      }

      const res = await fetch("http://localhost:3000/api/tam-vang", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          CanCuocCongDan: CanCuocCongDan,
          NgayBatDau: ngayBatDau,
          NgayKetThuc: ngayKetThuc,
          LyDo: lyDo,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showNotify(data.message || "Đăng ký thất bại!");
        return;
      }

      addModal.classList.remove("show");
      showNotify("Đăng ký tạm vắng thành công!");
      loadTamVang();
    } catch (err) {
      console.error(err);
      showNotify("Lỗi kết nối server!");
    }
  });

  /* ===============================
       XÓA TẠM VẮNG
    =============================== */
  const deleteModal = document.getElementById("deleteModal");
  const confirmDelete = document.getElementById("confirm-delete");
  const cancelDelete = document.getElementById("cancel-delete");
  const closeDelete = document.getElementById("close-delete");

  document.querySelectorAll(".btn-remove").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentRow = btn.closest("tr");
      deleteModal.classList.add("show");
    });
  });

  [cancelDelete, closeDelete].forEach((btn) =>
    btn?.addEventListener("click", () => deleteModal.classList.remove("show"))
  );

  confirmDelete.addEventListener("click", async () => {
    if (!currentRow) return;

    const btnDetail = currentRow.querySelector(".btn-detail");
    const tamVangId = btnDetail?.dataset.id;

    if (!tamVangId) {
      showNotify("Không xác định được mã tạm vắng!");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3000/api/tam-vang/${tamVangId}`,
        { method: "DELETE" }
      );

      const data = await res.json();

      if (!res.ok) {
        showNotify(data.message || "Xóa tạm vắng thất bại!");
        return;
      }

      // ===== GIỮ NGUYÊN UI =====
      currentRow.remove();
      deleteModal.classList.remove("show");
      showNotify("Xóa tạm vắng thành công!");
    } catch (err) {
      showNotify("Lỗi kết nối server!");
    }
  });
  /* ===============================
     SEARCH TẠM VẮNG
=============================== */
  const searchInput = document.getElementById("search-input-tamvang");

  searchInput?.addEventListener("input", async function () {
    const keyword = this.value.trim().toLowerCase();

    try {
      const res = await fetch("http://localhost:3000/api/tam-vang");
      const data = await res.json();

      if (!res.ok) {
        showNotify("Không tải được dữ liệu tìm kiếm!");
        return;
      }

      const tbody = document.querySelector(".absence-table tbody");
      tbody.innerHTML = "";

      const filtered = data.filter((tv) => {
        const soNgay = tinhSoNgay(tv.NgayBatDau, tv.NgayKetThuc);

        // nếu keyword là số → tìm theo số ngày
        if (!isNaN(keyword) && keyword !== "") {
          return soNgay === Number(keyword);
        }

        return (
          tv.HoTen?.toLowerCase().includes(keyword) ||
          tv.CCCD?.toLowerCase().includes(keyword) ||
          tv.LyDo?.toLowerCase().includes(keyword)
        );
      });

      filtered.forEach((tv) => {
        const soNgay = tinhSoNgay(tv.NgayBatDau, tv.NgayKetThuc);
        const tr = document.createElement("tr");

        tr.innerHTML = `
        <td>${tv.CCCD || ""}</td>
        <td>${tv.HoTen || ""}</td>
        <td>${soNgay}</td>
        <td>${tv.LyDo || ""}</td>
        <td class="action">
          <span class="btn-detail" data-id="${tv.MaTamVang}"></span>
          <span class="btn-remove"></span>
        </td>
      `;

        // chi tiết
        tr.querySelector(".btn-detail").addEventListener("click", function () {
          currentTamVangId = tv.MaTamVang;
          openDetail(this);
        });

        // xóa
        tr.querySelector(".btn-remove").addEventListener("click", () => {
          currentRow = tr;
          currentTamVangId = tv.MaTamVang;
          deleteModal.classList.add("show");
        });

        tbody.appendChild(tr);
      });
    } catch (err) {
      showNotify("Lỗi kết nối server!");
    }
  });

  // INIT
  loadTamVang();
});
