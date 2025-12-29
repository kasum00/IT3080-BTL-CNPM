document.addEventListener("DOMContentLoaded", () => {

    const modal = document.getElementById("apartment-modal");
    const closeBtn = document.getElementById("close-modal");

    const editModal = document.getElementById("editModal");
    const btnOpenEdit = document.getElementById("btn-open-edit");
    const closeEditBtn = document.getElementById("closeModal");

    /* ===============================
       MỞ MODAL CHI TIẾT
       =============================== */
    document.querySelectorAll(".btn-detail").forEach(btn => {
        btn.addEventListener("click", () => {
            document.getElementById("modal-name").value  = btn.dataset.name;
            document.getElementById("modal-floor").value = btn.dataset.floor;
            document.getElementById("modal-area").value  = btn.dataset.area;
            document.getElementById("modal-desc").value  = btn.dataset.status;
            document.getElementById("modal-owner").value = btn.dataset.owner;
            document.getElementById("modal-start").value = btn.dataset.start;
            document.getElementById("modal-end").value   = btn.dataset.end;

            modal.classList.add("show");
        });
    });

    /* ===============================
       ĐÓNG MODAL CHI TIẾT
       =============================== */
    closeBtn.addEventListener("click", () => {
        modal.classList.remove("show");
    });

    modal.addEventListener("click", e => {
        if (e.target === modal) {
            modal.classList.remove("show");
        }
    });

    /* ===============================
       CHI TIẾT → CHỈNH SỬA
       =============================== */
    btnOpenEdit.addEventListener("click", () => {
        // đóng modal chi tiết
        modal.classList.remove("show");

        // đổ dữ liệu sang form chỉnh sửa
        document.getElementById("edit-name").value  = document.getElementById("modal-name").value;
        document.getElementById("edit-floor").value = document.getElementById("modal-floor").value;
        document.getElementById("edit-desc").value  = document.getElementById("modal-desc").value;
        document.getElementById("edit-area").value  = document.getElementById("modal-area").value;
        document.getElementById("edit-owner").value = document.getElementById("modal-owner").value;
        document.getElementById("edit-start").value = document.getElementById("modal-start").value;
        document.getElementById("edit-end").value   = document.getElementById("modal-end").value;

        // mở modal chỉnh sửa
        editModal.classList.remove("hidden");
    });

    /* ===============================
       ĐÓNG MODAL CHỈNH SỬA
       =============================== */
    closeEditBtn.addEventListener("click", () => {
        editModal.classList.add("hidden");
    });

});
