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
