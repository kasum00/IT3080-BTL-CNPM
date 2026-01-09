let tamTruList = [];
const API_URL = "http://localhost:3000/api/tam-tru";
let currentTamTruId = null;

document.addEventListener("DOMContentLoaded", () => {
  loadTamTru();

  /* ===============================
     MODALS
  =============================== */
  const detailModal = document.getElementById("temporary-modal");
  const editModal = document.getElementById("editModal");
  const addModal = document.getElementById("addModal");
  const deleteModal = document.getElementById("deleteModal");
  const notifyModal = document.getElementById("notifyModal");

  const notifyText = document.getElementById("notify-text");

  function showNotify(msg) {
    notifyText.innerText = msg;
    notifyModal.classList.add("show");
  }

  ["notify-ok", "close-notify"].forEach((id) => {
    document.getElementById(id)?.addEventListener("click", () => {
      notifyModal.classList.remove("show");
    });
  });

  /* ===============================
     ADD
  =============================== */
  document.querySelector(".btn-add").onclick = () => {
    document.querySelectorAll("#addModal input").forEach((i) => (i.value = ""));
    addModal.classList.add("show");
  };

  document.getElementById("save-add").onclick = addTamTru;
  ["close-add", "cancel-add"].forEach((id) => {
    document.getElementById(id).onclick = () =>
      addModal.classList.remove("show");
  });

  /* ===============================
     EDIT
  =============================== */
  document.getElementById("btn-save-edit").onclick = updateTamTru;
  document.getElementById("btn-close-edit").onclick = () =>
    editModal.classList.remove("show");

  document.getElementById("btn-open-edit").onclick = () => {
    detailModal.classList.remove("show");
    editModal.classList.add("show");
  };

  /* ===============================
     DELETE
  =============================== */
  document.getElementById("confirm-delete").onclick = deleteTamTru;
  ["close-delete", "cancel-delete"].forEach((id) => {
    document.getElementById(id).onclick = () =>
      deleteModal.classList.remove("show");
  });

  /* ===============================
     CLOSE DETAIL
  =============================== */
  ["close-modal", "btn-close-detail"].forEach((id) => {
    document.getElementById(id).onclick = () =>
      detailModal.classList.remove("show");
  });
});
//search
const searchInput = document.getElementById("search-input-tamtru");

searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.trim().toLowerCase();

  const filtered = tamTruList.filter((tt) => {
    return (
      (tt.CanCuocCongDan || "").toLowerCase().includes(keyword) ||
      (tt.HoTen || "").toLowerCase().includes(keyword) ||
      (tt.DiaChiTamTru || "").toLowerCase().includes(keyword)
    );
  });

  renderTable(filtered);
});

/* ===============================
   LOAD + RENDER
================================ */
async function loadTamTru() {
  const res = await fetch(API_URL);
  tamTruList = await res.json();
  renderTable(tamTruList);
}

function renderTable(data) {
  const tbody = document.querySelector(".temporary-table tbody");
  tbody.innerHTML = "";

  data.forEach((tt) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${tt.CanCuocCongDan || ""}</td>
      <td>${tt.HoTen || ""}</td>
      <td>${tt.DiaChiTamTru || ""}</td>
      <td>${tt.NgayBatDau?.slice(0, 10) || ""}</td>
      <td>${tt.NgayKetThuc?.slice(0, 10) || ""}</td>
      <td class="action">
        <span class="btn-detail" data-id="${tt.MaTamTru}"></span>
        <span class="btn-remove" data-id="${tt.MaTamTru}"></span>
      </td>
    `;
    tbody.appendChild(tr);
  });

  bindEvents();
}

function bindEvents() {
  document.querySelectorAll(".btn-detail").forEach((btn) => {
    btn.onclick = () => openDetail(btn.dataset.id);
  });

  document.querySelectorAll(".btn-remove").forEach((btn) => {
    btn.onclick = () => {
      currentTamTruId = btn.dataset.id;
      document.getElementById("deleteModal").classList.add("show");
    };
  });
}

/* ===============================
   DETAIL
================================ */
async function openDetail(id) {
  const res = await fetch(`${API_URL}/${id}`);
  const tt = await res.json();
  currentTamTruId = id;

  document.getElementById("modal-hoTen").value = tt.HoTen || "";
  document.getElementById("modal-cccd").value = tt.CanCuocCongDan || "";
  document.getElementById("modal-diaChi").value = tt.DiaChiTamTru || "";
  document.getElementById("modal-ngayBatDau").value =
    tt.NgayBatDau?.slice(0, 10) || "";
  document.getElementById("modal-ngayKetThuc").value =
    tt.NgayKetThuc?.slice(0, 10) || "";

  // fill edit
  document.getElementById("edit-cccd").value = tt.CanCuocCongDan || "";
  document.getElementById("edit-hoTen").value = tt.HoTen || "";

  document.getElementById("edit-diaChi").value = tt.DiaChiTamTru || "";
  document.getElementById("edit-ngayBatDau").value =
    tt.NgayBatDau?.slice(0, 10) || "";
  document.getElementById("edit-ngayKetThuc").value =
    tt.NgayKetThuc?.slice(0, 10) || "";

  document.getElementById("temporary-modal").classList.add("show");
}

//add
async function addTamTru() {
  const payload = {
    MaNhanKhau: document.getElementById("add-maNhanKhau").value.trim(),
    CanCuocCongDan: document.getElementById("add-cccd").value.trim(),
    DiaChiTamTru: document.getElementById("add-diaChi").value.trim(),
    NgayBatDau: document.getElementById("add-ngayBatDau").value,
    NgayKetThuc: document.getElementById("add-ngayKetThuc").value,
  };

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  await loadTamTru();
  document.getElementById("addModal").classList.remove("show");
  showNotify("Đăng ký tạm trú thành công!");
  loadTamTru();
}

//update
async function updateTamTru() {
  const payload = {
    DiaChiTamTru: document.getElementById("edit-diaChi").value,
    NgayBatDau: document.getElementById("edit-ngayBatDau").value,
    NgayKetThuc: document.getElementById("edit-ngayKetThuc").value,
  };

  await fetch(`${API_URL}/${currentTamTruId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  await loadTamTru();

  document.getElementById("editModal").classList.remove("show");
  showNotify("Cập nhật tạm trú thành công!");
}

//delete
async function deleteTamTru() {
  await fetch(`${API_URL}/${currentTamTruId}`, { method: "DELETE" });
  await loadTamTru();
  document.getElementById("deleteModal").classList.remove("show");
  showNotify("Xóa tạm trú thành công!");
}
