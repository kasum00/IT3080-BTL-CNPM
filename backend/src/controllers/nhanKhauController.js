let nhanKhauList = [];
const API_URL = "http://localhost:3000/api/nhan-khau";
let currentNhanKhauId = null;

/* ===============================
   DOM READY
================================ */
document.addEventListener("DOMContentLoaded", () => {
  loadNhanKhau();

  // ADD
  document.querySelector(".btn-add").onclick = () => {
    document.querySelectorAll("#addModal input").forEach((i) => (i.value = ""));
    document.getElementById("addModal").classList.add("show");
  };

  document.getElementById("save-add").onclick = addNhanKhau;
  document.getElementById("cancel-add").onclick = closeAdd;
  document.getElementById("close-add").onclick = closeAdd;

  // EDIT
  document.getElementById("btn-save-edit").onclick = updateNhanKhau;
  document.getElementById("btn-close-edit").onclick = () =>
    document.getElementById("editModal").classList.remove("show");

  // DETAIL
  document.getElementById("btn-open-edit").onclick = () => {
    document.getElementById("resident-modal").classList.remove("show");
    document.getElementById("editModal").classList.add("show");
  };

  ["close-modal", "btn-close-detail"].forEach((id) => {
    document.getElementById(id).onclick = () =>
      document.getElementById("resident-modal").classList.remove("show");
  });

  // DELETE
  document.getElementById("confirm-delete").onclick = deleteNhanKhau;
  document.getElementById("cancel-delete").onclick = closeDelete;
  document.getElementById("close-delete").onclick = closeDelete;

  // NOTIFY
  ["notify-ok", "close-notify"].forEach((id) => {
    document.getElementById(id).onclick = () =>
      document.getElementById("notifyModal").classList.remove("show");
  });
  //search
  document
    .getElementById("searchInput")
    ?.addEventListener("input", searchNhanKhau);
});

/* ===============================
   LOAD + RENDER
================================ */
async function loadNhanKhau() {
  const res = await fetch(API_URL);
  nhanKhauList = await res.json();
  renderTable(nhanKhauList);
}

function renderTable(data) {
  const tbody = document.querySelector(".resident-table tbody");
  tbody.innerHTML = "";

  data.forEach((nk) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${nk.MaHoKhau || ""}</td>
      <td>${nk.HoTen || ""}</td>
      <td>${nk.CanCuocCongDan || ""}</td>
      <td>${nk.NgaySinh ? nk.NgaySinh.slice(0, 10) : ""}</td>
      <td>${nk.QuanHe || ""}</td>
      <td>${nk.NgheNghiep || ""}</td>
      <td>${nk.TrangThai == 1 ? "Hoạt động" : "Không hoạt động"}</td>
      <td class="action">
        <span class="btn-detail" data-id="${nk.MaNhanKhau}"></span>
        <span class="btn-remove" data-id="${nk.MaNhanKhau}"></span>
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
      currentNhanKhauId = btn.dataset.id;
      document.getElementById("deleteModal").classList.add("show");
    };
  });
}

/* ===============================
   DETAIL
================================ */
async function openDetail(id) {
  const res = await fetch(`${API_URL}/${id}`);
  const nk = await res.json();
  currentNhanKhauId = id;

  document.getElementById("modal-ma").value = nk.MaHoKhau || "";
  document.getElementById("modal-hoTen").value = nk.HoTen || "";
  document.getElementById("modal-cccd").value = nk.CanCuocCongDan || "";
  document.getElementById("modal-ngaySinh").value =
    nk.NgaySinh?.slice(0, 10) || "";
  document.getElementById("modal-noiSinh").value = nk.NoiSinh || "";
  document.getElementById("modal-danToc").value = nk.DanToc || "";
  document.getElementById("modal-ngheNghiep").value = nk.NgheNghiep || "";
  document.getElementById("modal-quanHe").value = nk.QuanHe || "";
  document.getElementById("modal-ghiChu").value = nk.GhiChu || "";
  document.getElementById("modal-trangThai").value =
    nk.TrangThai == 1 ? "Hoạt động" : "Không hoạt động";

  // fill edit form
  document.getElementById("edit-ma").value = nk.MaHoKhau || "";
  document.getElementById("edit-hoTen").value = nk.HoTen || "";
  document.getElementById("edit-cccd").value = nk.CanCuocCongDan || "";
  document.getElementById("edit-ngaySinh").value =
    nk.NgaySinh?.slice(0, 10) || "";
  document.getElementById("edit-noiSinh").value = nk.NoiSinh || "";
  document.getElementById("edit-danToc").value = nk.DanToc || "";
  document.getElementById("edit-ngheNghiep").value = nk.NgheNghiep || "";
  document.getElementById("edit-quanHe").value = nk.QuanHe || "";
  document.getElementById("edit-ghiChu").value = nk.GhiChu || "";

  document.getElementById("resident-modal").classList.add("show");
}

/* ===============================
   ADD
================================ */
async function addNhanKhau() {
  const maHoKhau = document.getElementById("add-ma").value.trim();
  const hoTen = document.getElementById("add-hoTen").value.trim();
  const cccd = document.getElementById("add-cccd").value.trim();

  // VALIDATE BẮT BUỘC
  if (!maHoKhau || !hoTen || !cccd) {
    //showNotify("Vui lòng nhập đầy đủ: Mã hộ khẩu, Họ tên và CCCD!");
    alert("Vui lòng nhập đầy đủ Mã hộ khẩu, Họ tên và CCCD!");
    return;
  }

  const payload = {
    MaHoKhau: maHoKhau,
    HoTen: hoTen,
    CanCuocCongDan: cccd,
    NgaySinh: document.getElementById("add-ngaySinh").value,
    NoiSinh: document.getElementById("add-noiSinh").value,
    DanToc: document.getElementById("add-danToc").value,
    NgheNghiep: document.getElementById("add-ngheNghiep").value,
    QuanHe: document.getElementById("add-quanHe").value,
    GhiChu: document.getElementById("add-ghiChu").value,
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      let message = "Thêm nhân khẩu thất bại!";

      try {
        const err = await res.json();
        message = err.message || message;
      } catch {}

      if (message.toLowerCase().includes("cccd")) {
        alert("Căn cước công dân đã tồn tại! Vui lòng nhập lại!");
      } else {
        alert(message);
      }
      return;
    }

    closeAdd();
    showNotify("Thêm nhân khẩu thành công!");
    loadNhanKhau();
  } catch (error) {
    showNotify("Không thể kết nối tới server!");
  }
}

/* ===============================
   UPDATE
================================ */

async function updateNhanKhau() {
  const maHoKhau = document.getElementById("edit-ma").value.trim();
  const hoTen = document.getElementById("edit-hoTen").value.trim();
  const cccd = document.getElementById("edit-cccd").value.trim();

  // VALIDATE BẮT BUỘC
  if (!maHoKhau || !hoTen || !cccd) {
    alert("Dữ liệu không hợp lệ, vui lòng nhập lại!");
    return;
  }

  const payload = {
    MaHoKhau: maHoKhau,
    HoTen: hoTen,
    CanCuocCongDan: cccd,
    NgaySinh: document.getElementById("edit-ngaySinh").value,
    NoiSinh: document.getElementById("edit-noiSinh").value,
    DanToc: document.getElementById("edit-danToc").value,
    NgheNghiep: document.getElementById("edit-ngheNghiep").value,
    QuanHe: document.getElementById("edit-quanHe").value,
    GhiChu: document.getElementById("edit-ghiChu").value,
  };

  try {
    const res = await fetch(`${API_URL}/${currentNhanKhauId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.message || "Cập nhật thất bại!");
      return;
    }

    document.getElementById("editModal").classList.remove("show");
    showNotify("Cập nhật nhân khẩu thành công!");
    loadNhanKhau();
  } catch (e) {
    alert("Không thể kết nối server!");
  }
}

/* ===============================
   DELETE
================================ */
async function deleteNhanKhau() {
  try {
    const res = await fetch(`${API_URL}/${currentNhanKhauId}`, {
      method: "DELETE",
    });

    const data = await res.json();

    //Backend báo lỗi 
    if (!res.ok) {
      alert(data.message || "Không thể xóa nhân khẩu!");
      closeDelete();
      return;
    }
    // khi xóa thành công
    closeDelete();
    showNotify("Xóa nhân khẩu thành công!");
    loadNhanKhau();
  } catch (error) {
    alert("Không thể kết nối tới server!");
  }
}

/* ===============================
   SEARCH
================================ */
function searchNhanKhau() {
  const keyword = document
    .getElementById("searchInput")
    .value.toLowerCase()
    .trim();

  const filtered = nhanKhauList.filter(
    (nk) =>
      nk.HoTen?.toLowerCase().includes(keyword) ||
      String(nk.MaHoKhau || "")
        .toLowerCase()
        .includes(keyword) ||
      String(nk.CanCuocCongDan || "").includes(keyword) ||
      nk.QuanHe?.toLowerCase().includes(keyword)
  );

  renderTable(filtered);
}

/* ===============================
   UTILS
================================ */
function closeAdd() {
  document.getElementById("addModal").classList.remove("show");
}

function closeDelete() {
  document.getElementById("deleteModal").classList.remove("show");
}

function showNotify(msg) {
  document.getElementById("notify-text").innerText = msg;
  document.getElementById("notifyModal").classList.add("show");
}
