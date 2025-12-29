document.addEventListener("DOMContentLoaded", () => {

    /* ===============================
       BIẾN DÙNG CHUNG
    =============================== */
    let currentRow = null;

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
       HÀM MỞ MODAL CHI TIẾT (DÙNG CHUNG)
    =============================== */
    function openDetail(btn) {
        currentRow = btn.closest("tr");

        document.getElementById("modal-hoTen").value = btn.dataset.hoTen || "";
        document.getElementById("modal-cccd").value = btn.dataset.cccd || "";
        document.getElementById("modal-ngayBatDau").value = btn.dataset.ngayBatDau || "";
        document.getElementById("modal-ngayKetThuc").value = btn.dataset.ngayKetThuc || "";
        document.getElementById("modal-lyDo").value = btn.dataset.lyDo || "";

        detailModal.classList.add("show");
    }

    /* ===============================
       CLICK CHI TIẾT (DÒNG CÓ SẴN)
    =============================== */
    document.querySelectorAll(".btn-detail").forEach(btn => {
        btn.addEventListener("click", function () {
            openDetail(this);
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
    btnSaveEdit.addEventListener("click", () => {

        if (!currentRow) return;

        const hoTen = document.getElementById("edit-hoTen").value;
        const cccd = document.getElementById("edit-cccd").value;
        const ngayBatDau = document.getElementById("edit-ngayBatDau").value;
        const ngayKetThuc = document.getElementById("edit-ngayKetThuc").value;
        const lyDo = document.getElementById("edit-lyDo").value;

        const soNgay = tinhSoNgay(ngayBatDau, ngayKetThuc);

        currentRow.children[0].innerText = cccd;
        currentRow.children[1].innerText = hoTen;
        currentRow.children[2].innerText = soNgay;
        currentRow.children[3].innerText = lyDo;

        const btnDetail = currentRow.querySelector(".btn-detail");
        btnDetail.dataset.hoTen = hoTen;
        btnDetail.dataset.cccd = cccd;
        btnDetail.dataset.ngayBatDau = ngayBatDau;
        btnDetail.dataset.ngayKetThuc = ngayKetThuc;
        btnDetail.dataset.lyDo = lyDo;

        editModal.classList.remove("show");
        showNotify("Cập nhật tạm vắng thành công!");
    });

    closeEditBtn.addEventListener("click", () => {
        editModal.classList.remove("show");
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
        document.querySelectorAll("#addModal input").forEach(i => i.value = "");
        addModal.classList.add("show");
    });

    [closeAddBtn, cancelAddBtn].forEach(btn =>
        btn.addEventListener("click", () =>
            addModal.classList.remove("show")
        )
    );

    saveAddBtn.addEventListener("click", () => {

        const soNgay = tinhSoNgay(addNgayBatDau.value, addNgayKetThuc.value);
        const tbody = document.querySelector(".absence-table tbody");
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${addCCCD.value}</td>
            <td>${addHoTen.value}</td>
            <td>${soNgay}</td>
            <td>${addLyDo.value}</td>
            <td class="action">
                <span class="btn-detail"
                    data-ho-ten="${addHoTen.value}"
                    data-cccd="${addCCCD.value}"
                    data-ngay-bat-dau="${addNgayBatDau.value}"
                    data-ngay-ket-thuc="${addNgayKetThuc.value}"
                    data-ly-do="${addLyDo.value}">
                </span>
                <span class="btn-remove"></span>
            </td>
        `;

        tbody.appendChild(tr);
        addModal.classList.remove("show");
        showNotify("Đăng ký tạm vắng thành công!");

        tr.querySelector(".btn-detail").addEventListener("click", function () {
            openDetail(this);
        });

        tr.querySelector(".btn-remove").addEventListener("click", () => {
            currentRow = tr;
            deleteModal.classList.add("show");
        });
    });

    /* ===============================
       XÓA TẠM VẮNG
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
        showNotify("Xóa tạm vắng thành công!");
    });

});
