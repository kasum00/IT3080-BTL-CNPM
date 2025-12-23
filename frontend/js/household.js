document.addEventListener("DOMContentLoaded", () => {

    /* ===============================
       BIẾN DÙNG CHUNG
    =============================== */
    let currentRow = null;

    /* ===============================
       MODAL CHI TIẾT
    =============================== */
    const detailModal = document.getElementById("household-modal");
    const closeDetailBtn = document.getElementById("close-modal");
    const btnCloseDetail = document.getElementById("btn-close-detail");
    const btnOpenEdit = document.getElementById("btn-open-edit");

    /* ===============================
       MODAL CHỈNH SỬA
    =============================== */
    const editModal = document.getElementById("editModal");
    const closeEditBtn = document.getElementById("close-edit");
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

    [notifyOk, closeNotify].forEach(btn =>
        btn?.addEventListener("click", () =>
            notifyModal.classList.remove("show")
        )
    );

    /* ===============================
       ICON BÚT → MỞ MODAL CHI TIẾT
    =============================== */
    document.querySelectorAll(".btn-detail").forEach(btn => {
        btn.addEventListener("click", () => {

            currentRow = btn.closest("tr");

            document.getElementById("modal-ma").value = btn.dataset.ma || "";
            document.getElementById("modal-canHo").value = btn.dataset.canHo || "";
            document.getElementById("modal-chuHo").value = btn.dataset.chuHo || "";
            document.getElementById("modal-diaChi").value = btn.dataset.diaChi || "";
            document.getElementById("modal-noiCap").value = btn.dataset.noiCap || "";
            document.getElementById("modal-ngayCap").value = btn.dataset.ngayCap || "";

            detailModal.classList.add("show");

        });
    });

    /* ===============================
       ĐÓNG MODAL CHI TIẾT
    =============================== */
    [closeDetailBtn, btnCloseDetail].forEach(btn =>
        btn?.addEventListener("click", () =>
            detailModal.classList.remove("show")
        )
    );

    detailModal.addEventListener("click", e => {
        if (e.target === detailModal) {
            detailModal.classList.remove("show");
        }
    });

    /* ===============================
       CHI TIẾT → CHỈNH SỬA
    =============================== */
    btnOpenEdit.addEventListener("click", () => {
        detailModal.classList.remove("show");

        document.getElementById("edit-ma").value = document.getElementById("modal-ma").value;
        document.getElementById("edit-canHo").value = document.getElementById("modal-canHo").value;
        document.getElementById("edit-chuHo").value = document.getElementById("modal-chuHo").value;
        document.getElementById("edit-diaChi").value = document.getElementById("modal-diaChi").value;
        document.getElementById("edit-noiCap").value = document.getElementById("modal-noiCap").value;
        document.getElementById("edit-ngayCap").value = document.getElementById("modal-ngayCap").value;

        editModal.classList.add("show");
    });

    /* ===============================
           LƯU CHỈNH SỬA → CẬP NHẬT BẢNG
           =============================== */
    btnSaveEdit.onclick = () => {

        if (!currentRow) return;

        const ma = document.getElementById("edit-ma").value;
        const canHo = document.getElementById("edit-canHo").value;
        const chuHo = document.getElementById("edit-chuHo").value;

        // Cập nhật lại bảng
        currentRow.children[0].innerText = ma;
        currentRow.children[1].innerText = canHo;
        currentRow.children[2].innerText = chuHo;

        // Cập nhật lại dataset cho icon bút
        const btnDetail = currentRow.querySelector(".btn-detail");
        btnDetail.dataset.ma = ma;
        btnDetail.dataset.canHo = canHo;
        btnDetail.dataset.chuHo = chuHo;
        btnDetail.dataset.diaChi = document.getElementById("edit-diaChi").value;
        btnDetail.dataset.noiCap = document.getElementById("edit-noiCap").value;
        btnDetail.dataset.ngayCap = document.getElementById("edit-ngayCap").value;

        // Đóng modal edit
        editModal.classList.remove("show");
    };

    /* ===============================
       ĐÓNG MODAL CHỈNH SỬA
       =============================== */
    closeEditBtn.addEventListener("click", () => {
        editModal.classList.remove("show");

    });

    /* ===============================
       THÊM HỘ KHẨU
    =============================== */
    const addMa = document.getElementById("add-ma");
    const addCanHo = document.getElementById("add-canHo");
    const addChuHo = document.getElementById("add-chuHo");
    const addDiaChi = document.getElementById("add-diaChi");
    const addNoiCap = document.getElementById("add-noiCap");
    const addNgayCap = document.getElementById("add-ngayCap");

    const btnAdd = document.querySelector(".btn-add");
    const addModal = document.getElementById("addModal");
    const closeAddBtn = document.getElementById("close-add");
    const cancelAddBtn = document.getElementById("cancel-add");
    const saveAddBtn = document.getElementById("save-add");

    btnAdd.addEventListener("click", () => {
        document.querySelectorAll("#addModal input").forEach(i => i.value = "");
        addModal.classList.add("show");
    });

    [closeAddBtn, cancelAddBtn].forEach(btn =>
        btn.addEventListener("click", () =>
            addModal.classList.remove("show")
        )
    );

    saveAddBtn.addEventListener("click", () => {

        const tbody = document.querySelector(".household-table tbody");

        const tr = document.createElement("tr");
        tr.innerHTML = `
        <td>${addMa.value}</td>
        <td>${addCanHo.value}</td>
        <td>${addChuHo.value}</td>
        <td>${addDiaChi.value}</td>
        <td>${addNgayCap.value}</td>
        <td class="action">
            <span class="btn-detail"
                data-ma="${addMa.value}"
                data-can-ho="${addCanHo.value}"
                data-chu-ho="${addChuHo.value}"
                data-dia-chi="${addDiaChi.value}"
                data-noi-cap="${addNoiCap.value}"
                data-ngay-cap="${addNgayCap.value}">
            </span>
            <span class="btn-remove"></span>
        </td>
    `;

        tbody.appendChild(tr);
        addModal.classList.remove("show");
        showNotify("Thêm hộ khẩu thành công!");

        tr.querySelector(".btn-detail").addEventListener("click", function () {
            this.dispatchEvent(new Event("click"));
        });

        tr.querySelector(".btn-remove").addEventListener("click", () => {
            currentRow = tr;
            deleteModal.classList.add("show");
        });
    });



    /* ===============================
       XÓA HỘ KHẨU
    =============================== */
    const deleteModal = document.getElementById("deleteModal");
    const confirmDelete = document.getElementById("confirm-delete");
    const cancelDelete = document.getElementById("cancel-delete");
    const closeDelete = document.getElementById("close-delete");

    document.querySelectorAll(".btn-remove").forEach(btn => {
        btn.addEventListener("click", () => {
            currentRow = btn.closest("tr");
            deleteModal.classList.add("show");
        });
    });

    [cancelDelete, closeDelete].forEach(btn =>
        btn?.addEventListener("click", () =>
            deleteModal.classList.remove("show")
        )
    );

    confirmDelete.addEventListener("click", () => {
        if (currentRow) currentRow.remove();
        deleteModal.classList.remove("show");
        showNotify("Xóa hộ khẩu thành công!");
    });

});
