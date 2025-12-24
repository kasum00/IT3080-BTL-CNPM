document.addEventListener("DOMContentLoaded", () => {

    /* ===============================
       MODAL CHI TIẾT
       =============================== */
    const detailModal = document.getElementById("fee-list-modal");
    const closeDetailBtn = document.getElementById("close-modal");
    const btnCloseDetail = document.getElementById("btn-close-detail");

    /* ===============================
       MODAL CHỈNH SỬA
       =============================== */
    const editModal = document.getElementById("editModal");
    const btnOpenEdit = document.getElementById("btn-open-edit");
    const closeEditBtn = document.getElementById("close-edit");

    const btnSaveEdit = document.getElementById("btn-save-edit");
    let currentRow = null; //lưu dòng đang sử


    /* ===============================
       ICON BÚT → MỞ MODAL CHI TIẾT
       =============================== */
    document.querySelectorAll(".btn-detail").forEach(btn => {
        btn.addEventListener("click", () => {
            currentRow = btn.closest("tr");

            document.getElementById("modal-name").value = btn.dataset.name || "";
            document.getElementById("modal-type").value = btn.dataset.type || "";
            document.getElementById("modal-desc").value = btn.dataset.desc || "";
            document.getElementById("modal-budget").value = btn.dataset.budget || "";
            document.getElementById("modal-unit").value = btn.dataset.unit || "";
            document.getElementById("modal-start").value = btn.dataset.start || "";
            document.getElementById("modal-end").value = btn.dataset.end || "";

            detailModal.classList.add("show");
        });
    });

    /* ===============================
       ĐÓNG MODAL CHI TIẾT
       =============================== */
    [closeDetailBtn, btnCloseDetail].forEach(btn => {
        btn?.addEventListener("click", () => {
            detailModal.classList.remove("show");
        });
    });



    detailModal.addEventListener("click", e => {
        if (e.target === detailModal) {
            detailModal.classList.remove("show");
        }
    });

    /* ===============================
       CLICK "CHỈNH SỬA"
       CHI TIẾT → EDIT
       =============================== */
    btnOpenEdit.addEventListener("click", () => {

        // Đóng modal chi tiết
        detailModal.classList.remove("show");

        // Copy dữ liệu sang form edit
        document.getElementById("edit-name").value =
            document.getElementById("modal-name").value;

        document.getElementById("edit-type").value =
            document.getElementById("modal-type").value;

        document.getElementById("edit-desc").value =
            document.getElementById("modal-desc").value;

        document.getElementById("edit-budget").value =
            document.getElementById("modal-budget").value;

        document.getElementById("edit-unit").value =
            document.getElementById("modal-unit").value;

        document.getElementById("edit-start").value =
            document.getElementById("modal-start").value;

        document.getElementById("edit-end").value =
            document.getElementById("modal-end").value;

        // Mở modal chỉnh sửa
        editModal.classList.add("show");
    });
    /* ===============================
       LƯU CHỈNH SỬA → CẬP NHẬT BẢNG
       =============================== */
    btnSaveEdit.onclick = () => {

        if (!currentRow) return;

        const name = document.getElementById("edit-name").value;
        const type = document.getElementById("edit-type").value;
        const start = document.getElementById("edit-start").value;
        const end = document.getElementById("edit-end").value;

        // Cập nhật lại bảng
        currentRow.children[1].innerText = name;
        currentRow.children[2].innerText = type;
        currentRow.children[3].innerText = start;
        currentRow.children[4].innerText = end;

        // Cập nhật lại dataset cho icon bút
        const btnDetail = currentRow.querySelector(".btn-detail");
        btnDetail.dataset.name = name;
        btnDetail.dataset.type = type;
        btnDetail.dataset.start = start;
        btnDetail.dataset.end = end
        btnDetail.dataset.status = document.getElementById("edit-desc").value;
        btnDetail.dataset.budget = document.getElementById("edit-budget").value;
        btnDetail.dataset.unit = document.getElementById("edit-unit").value;
        
        // Đóng modal edit
        editModal.classList.remove("show");
    };

    /* ===============================
       ĐÓNG MODAL CHỈNH SỬA
       =============================== */
    closeEditBtn.addEventListener("click", () => {
        closeEditModal(true);
    });


    const btnCancelEdit = document.getElementById("btn-close-edit");
    btnCancelEdit?.addEventListener("click", () => {
        closeEditModal(true);
    });

    editModal.addEventListener("click", e => {
        if (e.target === editModal) {
            closeEditModal(true);
        }
    });
    
    function closeEditModal(showMessage = false) {
        editModal.classList.remove("show");
        if (showMessage) {
            showNotify("Đóng chỉnh sửa khoản thu thành công!");
        }
    }


    /* ===============================
   MODAL THÔNG BÁO
   =============================== */
    const notifyModal = document.getElementById("notifyModal");
    const notifyText = document.getElementById("notify-text");
    const notifyOk = document.getElementById("notify-ok");
    const closeNotify = document.getElementById("close-notify");

    function showNotify(message) {
        notifyText.innerText = message;
        notifyModal.classList.add("show");
    }

    [notifyOk, closeNotify].forEach(btn => {
        btn?.addEventListener("click", () => {
            notifyModal.classList.remove("show");
        });
    });

    /* ===============================
       GHI ĐÈ HÀNH VI ĐÓNG / HỦY EDIT
       =============================== */
    closeEditBtn.addEventListener("click", () => {
        closeEditModal(true);
    });


    btnCancelEdit?.addEventListener("click", () => {
        closeEditModal(true);
    });

    editModal.addEventListener("click", e => {
        if (e.target === editModal) {
            closeEditModal(true);
        }
    });
    
    function closeEditModal(showMessage = false) {
        editModal.classList.remove("show");
        if (showMessage) {
            showNotify("Đóng chỉnh sửa khoản thu thành công!");
        }
    }

    /* ===============================
       SAU KHI LƯU → HIỆN THÔNG BÁO
       =============================== */
    btnSaveEdit.onclick = () => {

        if (!currentRow) return;

        const name = document.getElementById("edit-name").value;
        const type = document.getElementById("edit-type").value;
        const start = document.getElementById("edit-start").value;
        const end = document.getElementById("edit-end").value;

        currentRow.children[1].innerText = name;
        currentRow.children[2].innerText = type;
        currentRow.children[3].innerText = start;
        currentRow.children[4].innerText = end;

        const btnDetail = currentRow.querySelector(".btn-detail");
        btnDetail.dataset.name = name;
        btnDetail.dataset.type = type;
        btnDetail.dataset.start = start;
        btnDetail.dataset.end = end;
        btnDetail.dataset.status = document.getElementById("edit-desc").value;
        btnDetail.dataset.budget = document.getElementById("edit-budget").value;
        btnDetail.dataset.unit = document.getElementById("edit-unit").value;

        editModal.classList.remove("show");
        showNotify("Lưu chỉnh sửa khoản thu thành công!");
    };

    const btnAddRevenue = document.querySelector(".btn-add");
    const addModal = document.getElementById("addModal");
    const closeAddBtn = document.getElementById("close-add");
    const cancelAddBtn = document.getElementById("cancel-add");
    const saveAddBtn = document.getElementById("save-add");

    btnAddRevenue.addEventListener("click", () => {

        // reset form
        document.querySelectorAll(
            "#addModal input"
        ).forEach(i => i.value = "");

        addModal.classList.add("show");
    });

    [closeAddBtn, cancelAddBtn].forEach(btn => {
        btn.addEventListener("click", () => {
            addModal.classList.remove("show");
        });
    });

    saveAddBtn.addEventListener("click", () => {

        const name = document.getElementById("add-name").value;
        const type = document.getElementById("add-type").value;
        const desc = document.getElementById("add-desc").value;
        const budget = document.getElementById("add-budget").value;
        const unit = document.getElementById("add-unit").value;
        const start = document.getElementById("add-start").value;
        const end = document.getElementById("add-end").value;

        const tbody = document.querySelector(".fee-list-table tbody");

        const tr = document.createElement("tr");
        tr.innerHTML = `
        <td>${name.split(" ")[2] || "A?"}</td>
        <td>${name}</td>
        <td>${type}</td>
        <td>${start}</td>
        <td>${end}</td>
        <td class="action">
            <span class="btn-detail"
                data-name="${name}"
                data-type="${type}"
                data-status="${desc}"
                data-budget="${budget}"
                data-unit="${unit}"
                data-start="${start}"
                data-end="${end}">
            </span>
            <span class="btn-remove"></span>
        </td>
    `;

        tbody.appendChild(tr);

        addModal.classList.remove("show");

        // Gắn lại sự kiện icon bút cho dòng mới
        tr.querySelector(".btn-detail").addEventListener("click", function () {
            this.dispatchEvent(new Event("click"));
        });

        // Gắn lại sự kiện xóa cho dòng mới
        tr.querySelector(".btn-remove").addEventListener("click", () => {
            currentRow = tr;
            deleteModal.classList.add("show");
        });

        // Thông báo
        showNotify("Thêm khoản thu thành công!");
    });

    /* ===============================
       XÓA NHÂN KHẨU
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
        showNotify("Xóa khoản thu thành công!");
    });



});
