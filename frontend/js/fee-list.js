document.addEventListener("DOMContentLoaded", () => {

    let currentRow = null;

    /* ===============================
       MODALS
    =============================== */
    const detailModal = document.getElementById("fee-list-modal");
    const editModal = document.getElementById("editModal");
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

        document.getElementById("modal-name").value = btn.dataset.name || "";
        document.getElementById("modal-type").value = btn.dataset.type || "";
        document.getElementById("modal-desc").value = btn.dataset.status || "";
        document.getElementById("modal-budget").value = btn.dataset.budget || "";
        document.getElementById("modal-unit").value = btn.dataset.unit || "";
        document.getElementById("modal-start").value = btn.dataset.start || "";
        document.getElementById("modal-end").value = btn.dataset.end || "";

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

        editModal.classList.add("show");
    });

    /* ===============================
       SAVE EDIT (CHỈ 1 LẦN)
    =============================== */
    document.getElementById("btn-save-edit").addEventListener("click", () => {

        if (!currentRow) return;

        const name = document.getElementById("edit-name").value;
        const type = document.getElementById("edit-type").value;
        const start = document.getElementById("edit-start").value;
        const end = document.getElementById("edit-end").value;

        currentRow.children[1].innerText = name;
        currentRow.children[2].innerText = type;
        currentRow.children[3].innerText = start;
        currentRow.children[4].innerText = end;

        const btn = currentRow.querySelector(".btn-detail");
        btn.dataset.name = name;
        btn.dataset.type = type;
        btn.dataset.status = document.getElementById("edit-desc").value;
        btn.dataset.budget = document.getElementById("edit-budget").value;
        btn.dataset.unit = document.getElementById("edit-unit").value;
        btn.dataset.start = start;
        btn.dataset.end = end;

        editModal.classList.remove("show");
        showNotify("Lưu chỉnh sửa khoản thu thành công!");
    });

    document.getElementById("close-edit").addEventListener("click", () => {
        editModal.classList.remove("show");
    });

    /* ===============================
       ADD FEE
    =============================== */
    document.querySelector(".btn-add").addEventListener("click", () => {
        document.querySelectorAll("#addModal input").forEach(i => i.value = "");
        document.getElementById("addModal").classList.add("show");
    });

    ["close-add", "cancel-add"].forEach(id => {
        document.getElementById(id).addEventListener("click", () => {
            document.getElementById("addModal").classList.remove("show");
        });
    });

    document.getElementById("save-add").addEventListener("click", () => {

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
        document.getElementById("addModal").classList.remove("show");

        tr.querySelector(".btn-detail").addEventListener("click", function () {
            openDetail(this);
        });

        tr.querySelector(".btn-remove").addEventListener("click", () => {
            currentRow = tr;
            document.getElementById("deleteModal").classList.add("show");
        });

        showNotify("Thêm khoản thu thành công!");
    });

    /* ===============================
       DELETE
    =============================== */
    const deleteModal = document.getElementById("deleteModal");

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
        showNotify("Xóa khoản thu thành công!");
    });

});
