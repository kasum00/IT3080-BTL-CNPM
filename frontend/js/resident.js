document.addEventListener("DOMContentLoaded", () => {

    /* ===============================
       BIẾN DÙNG CHUNG
    =============================== */
    let currentRow = null;

    /* ===============================
       MODAL CHI TIẾT
    =============================== */
    const detailModal = document.getElementById("resident-modal");
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

        document.getElementById("edit-ma").value = document.getElementById("modal-ma").value
        document.getElementById("edit-hoTen").value = document.getElementById("modal-hoTen").value;
        document.getElementById("edit-cccd").value = document.getElementById("modal-cccd").value;
        document.getElementById("edit-ngaySinh").value = document.getElementById("modal-ngaySinh").value;
        document.getElementById("edit-noiSinh").value = document.getElementById("modal-noiSinh").value;
        document.getElementById("edit-danToc").value = document.getElementById("modal-danToc").value;
        document.getElementById("edit-ngheNghiep").value = document.getElementById("modal-ngheNghiep").value;
        document.getElementById("edit-quanHe").value = document.getElementById("modal-quanHe").value;
        document.getElementById("edit-ghiChu").value = document.getElementById("modal-ghiChu").value;
        document.getElementById("edit-trangThai").value = document.getElementById("modal-trangThai").value;

        editModal.classList.add("show");
    });

    /* ===============================
           LƯU CHỈNH SỬA → CẬP NHẬT BẢNG
           =============================== */
    btnSaveEdit.onclick = () => {

        if (!currentRow) return;
        const ma = document.getElementById("edit-ma").value;
        const hoTen = document.getElementById("edit-hoTen").value;
        const cccd = document.getElementById("edit-cccd").value;


        // Cập nhật lại bảng
        currentRow.children[0].innerText = ma;
        currentRow.children[1].innerText = hoTen;
        currentRow.children[2].innerText = cccd;

        // Cập nhật lại dataset cho icon bút
        const btnDetail = currentRow.querySelector(".btn-detail");
        btnDetail.dataset.ma = ma
        btnDetail.dataset.hoTen = hoTen;
        btnDetail.dataset.cccd = cccd;

        btnDetail.dataset.ngaySinh = document.getElementById("edit-ngaySinh").value;
        btnDetail.dataset.noiSinh = document.getElementById("edit-noiSinh").value;
        btnDetail.dataset.danToc = document.getElementById("edit-danToc").value;
        btnDetail.dataset.ngheNghiep = document.getElementById("edit-ngheNghiep").value;
        btnDetail.dataset.quanHe = document.getElementById("edit-quanHe").value;
        btnDetail.dataset.ghiChu = document.getElementById("edit-ghiChu").value;
        btnDetail.dataset.trangThai = document.getElementById("edit-trangThai").value;

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
    const addHoTen = document.getElementById("add-hoTen");
    const addcccd = document.getElementById("add-cccd");
    const addNgaySinh = document.getElementById("add-ngaySinh");
    const addNoiSinh = document.getElementById("add-noiSinh");
    const addDanToc = document.getElementById("add-danToc");
    const addNgheNghiep = document.getElementById("add-ngheNghiep");
    const addQuanHe = document.getElementById("add-quanHe");
    const addGhiChu = document.getElementById("add-ghiChu");


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

        const tbody = document.querySelector(".resident-table tbody");

        const tr = document.createElement("tr");
        tr.innerHTML = `
        <td>${addMa.value}</td>
        <td>${addHoTen.value}</td>
        <td>${addcccd.value}</td>
        <td>${addNgaySinh.value}</td>
        <td>${addQuanHe.value}</td>
        <td>${addNgheNghiep.value}</td>
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
