document.addEventListener("DOMContentLoaded", () => {

    /* ===============================
       MODAL CHI TIẾT
       =============================== */
    const detailModal = document.getElementById("fee-manage-modal");
    const receiptModal = document.getElementById("receipt-modal");
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

            document.getElementById("modal-id-apt").innerText = btn.dataset.idApt || "";
            document.getElementById("modal-id-fee").innerText = btn.dataset.idFee || "";
            document.getElementById("modal-name").innerText = btn.dataset.name || "";
            document.getElementById("modal-money").innerText = btn.dataset.money || "";
            document.getElementById("modal-status").innerText = btn.dataset.status || "";
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
       ICON HÓA ĐƠN → MỞ MODAL THANH TOÁN
       =============================== */
    document.querySelectorAll(".btn-receipt").forEach(btn => {
        btn.addEventListener("click", () => {
            currentRow = btn.closest("tr");

            document.getElementById("modal-id-apt-bill").innerText = btn.dataset.idAptBill || "";
            document.getElementById("modal-id-fee-bill").innerText = btn.dataset.idFeeBill || "";
            document.getElementById("modal-name1-bill").innerText = btn.dataset.name1Bill || "";
            document.getElementById("modal-name2-bill").value = btn.dataset.name2Bill || "";
            document.getElementById("modal-money-bill").value = btn.dataset.moneyBill || "";
            document.getElementById("modal-date-bill").value = btn.dataset.dateBill || "";
            
            receiptModal.classList.add("show");
        });
    });
    /* ===============================
       LƯU HOÁ ĐƠN → CẬP NHẬT BẢNG
       =============================== */
    btnSaveEdit.onclick = () => {

        if (!currentRow) return;

        const status = "Đã thanh toán";

        // CÁCH SỬA: Tìm thẻ span chứa trạng thái bên trong dòng hiện tại
        // Giả sử cột trạng thái là cột thứ 4 (index 3)
        const statusCell = currentRow.children[3];
        const statusSpan = statusCell.querySelector(".status-label") || statusCell.querySelector("span");

        if (statusSpan) {
            statusSpan.innerText = status; // Chỉ cập nhật chữ bên trong span
        } else {
            // Nếu không có span, hãy cập nhật cẩn thận để không ghi đè nút bấm (nếu nút nằm chung cột)
            statusCell.innerText = status; 
        }
        
        // Đóng modal edit
        receiptModal.classList.remove("show");
        
        showNotify("Thanh toán khoản thu thành công!");
    
    };

    /* ===============================
       ĐÓNG MODAL THANH TOÁN
       =============================== */
    closeEditBtn.addEventListener("click", () => {
        closeReceiptModal(true);
    });

    const btnCancelEdit = document.getElementById("btn-close-edit");
    btnCancelEdit?.addEventListener("click", () => {
        closeReceiptModal(true);
    });

    receiptModal.addEventListener("click", e => {
        if (e.target === receiptModal) {
            closeReceiptModal(true);
        }
    });
    
    function closeReceiptModal(showMessage = false) {
        receiptModal.classList.remove("show");
        if (showMessage) {
            showNotify("Đóng thanh toán khoản thu thành công!");
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

});