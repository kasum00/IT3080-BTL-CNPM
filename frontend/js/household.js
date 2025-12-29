document.addEventListener("DOMContentLoaded", () => {

    let currentRow = null;

    /* ===============================
       MODALS
    =============================== */
    const detailModal = document.getElementById("household-modal");
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
        document.getElementById("modal-canHo").value = btn.dataset.canHo || "";
        document.getElementById("modal-chuHo").value = btn.dataset.chuHo || "";
        document.getElementById("modal-diaChi").value = btn.dataset.diaChi || "";
        document.getElementById("modal-noiCap").value = btn.dataset.noiCap || "";
        document.getElementById("modal-ngayCap").value = btn.dataset.ngayCap || "";

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
        document.getElementById("edit-canHo").value =
            document.getElementById("modal-canHo").value;
        document.getElementById("edit-chuHo").value =
            document.getElementById("modal-chuHo").value;
        document.getElementById("edit-diaChi").value =
            document.getElementById("modal-diaChi").value;
        document.getElementById("edit-noiCap").value =
            document.getElementById("modal-noiCap").value;
        document.getElementById("edit-ngayCap").value =
            document.getElementById("modal-ngayCap").value;

        editModal.classList.add("show");
    });

    /* ===============================
       SAVE EDIT (1 LẦN DUY NHẤT)
    =============================== */
    document.getElementById("btn-save-edit").addEventListener("click", () => {

        if (!currentRow) return;

        const ma = document.getElementById("edit-ma").value;
        const canHo = document.getElementById("edit-canHo").value;
        const chuHo = document.getElementById("edit-chuHo").value;

        currentRow.children[0].innerText = ma;
        currentRow.children[1].innerText = canHo;
        currentRow.children[2].innerText = chuHo;

        const btn = currentRow.querySelector(".btn-detail");
        btn.dataset.ma = ma;
        btn.dataset.canHo = canHo;
        btn.dataset.chuHo = chuHo;
        btn.dataset.diaChi = document.getElementById("edit-diaChi").value;
        btn.dataset.noiCap = document.getElementById("edit-noiCap").value;
        btn.dataset.ngayCap = document.getElementById("edit-ngayCap").value;

        editModal.classList.remove("show");
        showNotify("Cập nhật hộ khẩu thành công!");
    });

    document.getElementById("close-edit").addEventListener("click", () => {
        editModal.classList.remove("show");
    });

    /* ===============================
       ADD HOUSEHOLD
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
        const canHo = document.getElementById("add-canHo").value;
        const chuHo = document.getElementById("add-chuHo").value;
        const diaChi = document.getElementById("add-diaChi").value;
        const noiCap = document.getElementById("add-noiCap").value;
        const ngayCap = document.getElementById("add-ngayCap").value;

        const tbody = document.querySelector(".household-table tbody");
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${ma}</td>
            <td>${canHo}</td>
            <td>${chuHo}</td>
            <td>${diaChi}</td>
            <td>${ngayCap}</td>
            <td class="action">
                <span class="btn-detail"
                    data-ma="${ma}"
                    data-can-ho="${canHo}"
                    data-chu-ho="${chuHo}"
                    data-dia-chi="${diaChi}"
                    data-noi-cap="${noiCap}"
                    data-ngay-cap="${ngayCap}">
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

        showNotify("Thêm hộ khẩu thành công!");
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
        showNotify("Xóa hộ khẩu thành công!");
    });

});
