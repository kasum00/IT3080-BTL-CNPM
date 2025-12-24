document.addEventListener("DOMContentLoaded", () => {

    /* ===============================
       BIẾN DÙNG CHUNG
    =============================== */
    let currentRow = null;

    /* ===============================
       MODAL CHI TIẾT
    =============================== */
    const detailModal = document.getElementById("temporary-modal");
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
            console.log(btn.dataset);


            currentRow = btn.closest("tr");

            document.getElementById("modal-hoTen").value = btn.dataset.hoTen || "";
            document.getElementById("modal-cccd").value = btn.dataset.cccd || "";
            document.getElementById("modal-diaChi").value = btn.dataset.diaChi || "";
            document.getElementById("modal-ngayBatDau").value = btn.dataset.ngayBatDau || "";
            document.getElementById("modal-ngayKetThuc").value = btn.dataset.ngayKetThuc || "";

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

        document.getElementById("edit-cccd").value = document.getElementById("modal-cccd").value
        document.getElementById("edit-hoTen").value = document.getElementById("modal-hoTen").value;
        document.getElementById("edit-diaChi").value = document.getElementById("modal-diaChi").value;
        document.getElementById("edit-ngayBatDau").value = document.getElementById("modal-ngayBatDau").value;
        document.getElementById("edit-ngayKetThuc").value = document.getElementById("modal-ngayKetThuc").value;

        editModal.classList.add("show");
    });

    /* ===============================
           LƯU CHỈNH SỬA → CẬP NHẬT BẢNG
           =============================== */
    btnSaveEdit.onclick = () => {

        if (!currentRow) return;
        const cccd = document.getElementById("edit-cccd").value;
        const hoTen = document.getElementById("edit-hoTen").value;

        // Cập nhật lại bảng
        currentRow.children[0].innerText = cccd;
        currentRow.children[1].innerText = hoTen;
        // Cập nhật lại dataset cho icon bút
        const btnDetail = currentRow.querySelector(".btn-detail");

        btnDetail.dataset.hoTen = hoTen;
        btnDetail.dataset.cccd = cccd;

        btnDetail.dataset.diaChi = document.getElementById("edit-diaChi").value;
        btnDetail.dataset.ngayBatDau = document.getElementById("edit-ngayBatDau").value;
        btnDetail.dataset.ngayKetThuc = document.getElementById("edit-ngayKetThuc").value;

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
       DANG KY TAM TRU
    =============================== */
    const addNhanKhau = document.getElementById("add-nhanKhau");
    const addHoTen = document.getElementById("add-hoTen");
    const addcccd = document.getElementById("add-cccd");
    const addDiaChi = document.getElementById("add-diaChi");
    const addNgayBatDau = document.getElementById("add-ngayBatDau");
    const addNgayKetThuc = document.getElementById("add-ngayKetThuc");



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

        const tbody = document.querySelector(".temporary-table tbody");

        const tr = document.createElement("tr");
        tr.innerHTML = `
        <td>${addHoTen.value}</td>
        <td>${addcccd.value}</td>
        <td>${addDiaChi.value}</td>
        <td>${addNgayBatDau.value}</td>
        <td>${addNgayKetThuc.value}</td>
        <td>Hoạt động</td>
        <td class="action">
            <span class="btn-detail"
                data-ma="${addMa.value}"
                data-ho-ten="${addHoTen.value}"
                data-cccd="${addcccd.value}"
                data-ngay-sinh="${addNgaySinh.value}"
                data-noi-sinh="${addNoiSinh.value}"
                data-dan-toc="${addDanToc.value}"
                data-nghe-nghiep="${addNgheNghiep.value}"
                data-quan-he="${addQuanHe.value}"
                data-ghi-chu="${addGhiChu.value}"
                data-trang-thai="Hoạt động">
            </span>
            <span class="btn-remove"></span>
        </td>
    `;
        tbody.appendChild(tr);
        addModal.classList.remove("show");
        showNotify("Thêm nhân khẩu thành công!");

        tr.querySelector(".btn-detail").addEventListener("click", function () {
            this.dispatchEvent(new Event("click"));
        });

        tr.querySelector(".btn-remove").addEventListener("click", () => {
            currentRow = tr;
            deleteModal.classList.add("show");
        });
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
        showNotify("Xóa nhân khẩu thành công!");
    });

});
