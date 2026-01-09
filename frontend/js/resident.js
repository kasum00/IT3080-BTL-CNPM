<<<<<<< HEAD
document.addEventListener("DOMContentLoaded", () => {

    let currentRow = null;

    /* ===============================
       MODALS
    =============================== */
    const detailModal = document.getElementById("resident-modal");
    const editModal = document.getElementById("editModal");
    const addModal = document.getElementById("addModal");
    const deleteModal = document.getElementById("deleteModal");
    const notifyModal = document.getElementById("notifyModal");

    const notifyText = document.getElementById("notify-text");
    const notifyOk = document.getElementById("notify-ok");
    const closeNotify = document.getElementById("close-notify");

    function showNotify(msg) {
        notifyText.innerText = msg;
        notifyModal.classList.add("show");
    }

    [notifyOk, closeNotify].forEach(btn =>
        btn?.addEventListener("click", () =>
            notifyModal.classList.remove("show")
        )
    );

    /* ===============================
       OPEN DETAIL
    =============================== */
    function openDetail(btn) {
        currentRow = btn.closest("tr");

        document.getElementById("modal-ma").value = btn.dataset.ma || "";
        document.getElementById("modal-hoTen").value = btn.dataset.hoTen || "";
        document.getElementById("modal-cccd").value = btn.dataset.cccd || "";
        document.getElementById("modal-ngaySinh").value = btn.dataset.ngaySinh || "";
        document.getElementById("modal-noiSinh").value = btn.dataset.noiSinh || "";
        document.getElementById("modal-danToc").value = btn.dataset.danToc || "";
        document.getElementById("modal-ngheNghiep").value = btn.dataset.ngheNghiep || "";
        document.getElementById("modal-quanHe").value = btn.dataset.quanHe || "";
        document.getElementById("modal-ghiChu").value = btn.dataset.ghiChu || "";
        document.getElementById("modal-trangThai").value = btn.dataset.trangThai || "";

        detailModal.classList.add("show");
    }

    /* ===============================
       ICON DETAIL (DÒNG CŨ)
    =============================== */
    document.querySelectorAll(".btn-detail").forEach(btn => {
        btn.addEventListener("click", function () {
            openDetail(this);
        });
    });

    /* ===============================
       CLOSE DETAIL
    =============================== */
    ["close-modal", "btn-close-detail"].forEach(id => {
        document.getElementById(id)?.addEventListener("click", () => {
            detailModal.classList.remove("show");
        });
    });

    detailModal.addEventListener("click", e => {
        if (e.target === detailModal) {
            detailModal.classList.remove("show");
        }
    });

    /* ===============================
       DETAIL → EDIT
    =============================== */
    document.getElementById("btn-open-edit").addEventListener("click", () => {
        detailModal.classList.remove("show");

        document.getElementById("edit-ma").value =
            document.getElementById("modal-ma").value;
        document.getElementById("edit-hoTen").value =
            document.getElementById("modal-hoTen").value;
        document.getElementById("edit-cccd").value =
            document.getElementById("modal-cccd").value;
        document.getElementById("edit-ngaySinh").value =
            document.getElementById("modal-ngaySinh").value;
        document.getElementById("edit-noiSinh").value =
            document.getElementById("modal-noiSinh").value;
        document.getElementById("edit-danToc").value =
            document.getElementById("modal-danToc").value;
        document.getElementById("edit-ngheNghiep").value =
            document.getElementById("modal-ngheNghiep").value;
        document.getElementById("edit-quanHe").value =
            document.getElementById("modal-quanHe").value;
        document.getElementById("edit-ghiChu").value =
            document.getElementById("modal-ghiChu").value;
        document.getElementById("edit-trangThai").value =
            document.getElementById("modal-trangThai").value;

        editModal.classList.add("show");
    });

    /* ===============================
       SAVE EDIT (1 LẦN DUY NHẤT)
    =============================== */
    document.getElementById("btn-save-edit").addEventListener("click", () => {

        if (!currentRow) return;

        const ma = document.getElementById("edit-ma").value;
        const hoTen = document.getElementById("edit-hoTen").value;
        const cccd = document.getElementById("edit-cccd").value;

        currentRow.children[0].innerText = ma;
        currentRow.children[1].innerText = hoTen;
        currentRow.children[2].innerText = cccd;

        const btn = currentRow.querySelector(".btn-detail");
        btn.dataset.ma = ma;
        btn.dataset.hoTen = hoTen;
        btn.dataset.cccd = cccd;
        btn.dataset.ngaySinh = document.getElementById("edit-ngaySinh").value;
        btn.dataset.noiSinh = document.getElementById("edit-noiSinh").value;
        btn.dataset.danToc = document.getElementById("edit-danToc").value;
        btn.dataset.ngheNghiep = document.getElementById("edit-ngheNghiep").value;
        btn.dataset.quanHe = document.getElementById("edit-quanHe").value;
        btn.dataset.ghiChu = document.getElementById("edit-ghiChu").value;
        btn.dataset.trangThai = document.getElementById("edit-trangThai").value;

        editModal.classList.remove("show");
        showNotify("Cập nhật nhân khẩu thành công!");
    });

    document.getElementById("close-edit").addEventListener("click", () => {
        editModal.classList.remove("show");
    });

    /* ===============================
       ADD RESIDENT
    =============================== */
    document.querySelector(".btn-add").addEventListener("click", () => {
        document.querySelectorAll("#addModal input").forEach(i => i.value = "");
        addModal.classList.add("show");
    });

    ["close-add", "cancel-add"].forEach(id => {
        document.getElementById(id)?.addEventListener("click", () => {
            addModal.classList.remove("show");
        });
    });

    document.getElementById("save-add").addEventListener("click", () => {

        const ma = document.getElementById("add-ma").value;
        const hoTen = document.getElementById("add-hoTen").value;
        const cccd = document.getElementById("add-cccd").value;
        const ngaySinh = document.getElementById("add-ngaySinh").value;
        const noiSinh = document.getElementById("add-noiSinh").value;
        const danToc = document.getElementById("add-danToc").value;
        const ngheNghiep = document.getElementById("add-ngheNghiep").value;
        const quanHe = document.getElementById("add-quanHe").value;
        const ghiChu = document.getElementById("add-ghiChu").value;

        const tbody = document.querySelector(".resident-table tbody");
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${ma}</td>
            <td>${hoTen}</td>
            <td>${cccd}</td>
            <td>${ngaySinh}</td>
            <td>${quanHe}</td>
            <td>${ngheNghiep}</td>
            <td>Hoạt động</td>
            <td class="action">
                <span class="btn-detail"
                    data-ma="${ma}"
                    data-ho-ten="${hoTen}"
                    data-cccd="${cccd}"
                    data-ngay-sinh="${ngaySinh}"
                    data-noi-sinh="${noiSinh}"
                    data-dan-toc="${danToc}"
                    data-nghe-nghiep="${ngheNghiep}"
                    data-quan-he="${quanHe}"
                    data-ghi-chu="${ghiChu}"
                    data-trang-thai="Hoạt động">
                </span>
                <span class="btn-remove"></span>
            </td>
        `;

        tbody.appendChild(tr);
        addModal.classList.remove("show");

        tr.querySelector(".btn-detail").addEventListener("click", function () {
            openDetail(this);
        });

        tr.querySelector(".btn-remove").addEventListener("click", () => {
            currentRow = tr;
            deleteModal.classList.add("show");
        });

        showNotify("Thêm nhân khẩu thành công!");
    });

    /* ===============================
       DELETE
    =============================== */
    document.querySelectorAll(".btn-remove").forEach(btn => {
        btn.addEventListener("click", () => {
            currentRow = btn.closest("tr");
            deleteModal.classList.add("show");
        });
    });

    ["cancel-delete", "close-delete"].forEach(id =>
        document.getElementById(id)?.addEventListener("click", () =>
            deleteModal.classList.remove("show")
        )
    );

    document.getElementById("confirm-delete").addEventListener("click", () => {
        if (currentRow) currentRow.remove();
        deleteModal.classList.remove("show");
        showNotify("Xóa nhân khẩu thành công!");
    });

});
=======
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

  // ✅ VALIDATE BẮT BUỘC
  if (!maHoKhau || !hoTen || !cccd) {
    showNotify("Vui lòng nhập đầy đủ: Mã hộ khẩu, Họ tên và CCCD!");
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
      const err = await res.json();
      showNotify(err.message || "Thêm nhân khẩu thất bại!");
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
  const payload = {
    MaHoKhau: document.getElementById("edit-ma").value,
    HoTen: document.getElementById("edit-hoTen").value,
    CanCuocCongDan: document.getElementById("edit-cccd").value,
    NgaySinh: document.getElementById("edit-ngaySinh").value,
    NoiSinh: document.getElementById("edit-noiSinh").value,
    DanToc: document.getElementById("edit-danToc").value,
    NgheNghiep: document.getElementById("edit-ngheNghiep").value,
    QuanHe: document.getElementById("edit-quanHe").value,
    GhiChu: document.getElementById("edit-ghiChu").value,
  };

  await fetch(`${API_URL}/${currentNhanKhauId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  document.getElementById("editModal").classList.remove("show");
  showNotify("Cập nhật nhân khẩu thành công!");
  loadNhanKhau();
}

/* ===============================
   DELETE
================================ */
async function deleteNhanKhau() {
  await fetch(`${API_URL}/${currentNhanKhauId}`, { method: "DELETE" });
  closeDelete();
  showNotify("Xóa nhân khẩu thành công!");
  loadNhanKhau();
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
>>>>>>> main
