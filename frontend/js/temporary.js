<<<<<<< HEAD
document.addEventListener("DOMContentLoaded", () => {

    let currentRow = null;

    /* ===============================
       MODALS
    =============================== */
    const detailModal = document.getElementById("temporary-modal");
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

        document.getElementById("modal-hoTen").value = btn.dataset.hoTen || "";
        document.getElementById("modal-cccd").value = btn.dataset.cccd || "";
        document.getElementById("modal-diaChi").value = btn.dataset.diaChi || "";
        document.getElementById("modal-ngayBatDau").value = btn.dataset.ngayBatDau || "";
        document.getElementById("modal-ngayKetThuc").value = btn.dataset.ngayKetThuc || "";

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

        document.getElementById("edit-hoTen").value =
            document.getElementById("modal-hoTen").value;
        document.getElementById("edit-cccd").value =
            document.getElementById("modal-cccd").value;
        document.getElementById("edit-diaChi").value =
            document.getElementById("modal-diaChi").value;
        document.getElementById("edit-ngayBatDau").value =
            document.getElementById("modal-ngayBatDau").value;
        document.getElementById("edit-ngayKetThuc").value =
            document.getElementById("modal-ngayKetThuc").value;

        editModal.classList.add("show");
    });

    /* ===============================
       SAVE EDIT (1 LẦN DUY NHẤT)
    =============================== */
    document.getElementById("btn-save-edit").addEventListener("click", () => {

        if (!currentRow) return;

        const hoTen = document.getElementById("edit-hoTen").value;
        const cccd = document.getElementById("edit-cccd").value;
        const diaChi = document.getElementById("edit-diaChi").value;
        const ngayBatDau = document.getElementById("edit-ngayBatDau").value;
        const ngayKetThuc = document.getElementById("edit-ngayKetThuc").value;

        currentRow.children[0].innerText = cccd;
        currentRow.children[1].innerText = hoTen;
        currentRow.children[2].innerText = diaChi;
        currentRow.children[3].innerText = ngayBatDau;
        currentRow.children[4].innerText = ngayKetThuc;

        const btn = currentRow.querySelector(".btn-detail");
        btn.dataset.hoTen = hoTen;
        btn.dataset.cccd = cccd;
        btn.dataset.diaChi = diaChi;
        btn.dataset.ngayBatDau = ngayBatDau;
        btn.dataset.ngayKetThuc = ngayKetThuc;

        editModal.classList.remove("show");
        showNotify("Cập nhật tạm trú thành công!");
    });

    document.getElementById("close-edit").addEventListener("click", () => {
        editModal.classList.remove("show");
    });

    /* ===============================
       ADD TEMPORARY
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

        const hoTen = document.getElementById("add-hoTen").value;
        const cccd = document.getElementById("add-cccd").value;
        const diaChi = document.getElementById("add-diaChi").value;
        const ngayBatDau = document.getElementById("add-ngayBatDau").value;
        const ngayKetThuc = document.getElementById("add-ngayKetThuc").value;

        const tbody = document.querySelector(".temporary-table tbody");
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${cccd}</td>
            <td>${hoTen}</td>
            <td>${diaChi}</td>
            <td>${ngayBatDau}</td>
            <td>${ngayKetThuc}</td>
            <td class="action">
                <span class="btn-detail"
                    data-ho-ten="${hoTen}"
                    data-cccd="${cccd}"
                    data-dia-chi="${diaChi}"
                    data-ngay-bat-dau="${ngayBatDau}"
                    data-ngay-ket-thuc="${ngayKetThuc}">
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

        showNotify("Đăng ký tạm trú thành công!");
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
        showNotify("Xóa tạm trú thành công!");
    });

});
=======
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
    CanCuocCongDan: document.getElementById("add-cccd").value.trim(),
    DiaChiTamTru: document.getElementById("add-diaChi").value.trim(),
    NgayBatDau: document.getElementById("add-ngayBatDau").value,
    NgayKetThuc: document.getElementById("add-ngayKetThuc").value,
  };

  if (!payload.CanCuocCongDan || !payload.DiaChiTamTru || !payload.NgayBatDau) {
    showNotify("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    showNotify(data.message || "Đăng ký tạm trú thất bại!");
    return;
  }
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
>>>>>>> main
