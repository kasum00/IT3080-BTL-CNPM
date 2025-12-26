document.addEventListener("DOMContentLoaded", () => {

    /* ===============================
       MODAL CHI TIẾT
       =============================== */
    const detailModal = document.getElementById("fee-manage-modal");
    const receiptModal = document.getElementById("receipt-modal");
    const invoiceModal = document.getElementById("invoice-modal");
    const invoiceDetailModal = document.getElementById("invoice-detail-modal");
    const closeInvoiceDetailBtn = document.getElementById("close-invoice-detail");
    const closeDetailBtn = document.getElementById("close-modal");
    const closeInvoiceBtn = document.getElementById("close-modal-invoice");
    const btnCloseDetail = document.getElementById("btn-close-detail");

    /* ===============================
       MODAL CHỈNH SỬA
       =============================== */
    const closeEditBtn = document.getElementById("close-edit");

    const btnSaveEdit = document.getElementById("btn-save-edit");
    let currentRow = null; //lưu dòng đang sửa modal


    /* ===============================
       ICON BÚT → MỞ MODAL DANH SACH KHOAN THU CUA HO
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
       ĐÓNG MODAL KHOAN THU CUA HO
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
       ICON BÚT → MỞ MODAL DANH SACH HOA ĐƠN CUA HO
       =============================== */
    document.querySelectorAll(".btn-invoice").forEach(btn => {
        btn.addEventListener("click", () => {
            currentRow = btn.closest("tr");

            document.getElementById("modal-id-apt-invoice").innerText = btn.dataset.idAptInvoice || "";
            document.getElementById("modal-id-invoice").innerText = btn.dataset.idInvoice || "";
            document.getElementById("modal-name-invoice").innerText = btn.dataset.nameInvoice || "";
            document.getElementById("modal-money-invoice").innerText = btn.dataset.moneyInvoice || "";
            document.getElementById("modal-date-invoice").innerText = btn.dataset.dateInvoice || "";
            invoiceModal.classList.add("show");
        });
    });

    /* ===============================
       ĐÓNG MODAL HOA DON CUA HO
       =============================== */
    closeInvoiceBtn.addEventListener("click",() => {
        invoiceModal.classList.remove("show");
    });


    invoiceModal.addEventListener("click", e => {
        if (e.target === invoiceModal) {
            invoiceModal.classList.remove("show");
        }
    });

    
    /* ===============================
       ICON HÓA ĐƠN → MỞ MODAL HOA DON
       =============================== */
    /* ===============================
       ICON HÓA ĐƠN → MỞ MODAL THANH TOÁN
       =============================== */
    document.querySelectorAll(".btn-receipt").forEach(btn => {
        btn.addEventListener("click", () => {

            if (btn.id == "btn-invoice-detail"){
                document.getElementById("modal-id-apt-invoice-detail").innerText = btn.dataset.idAptInvoiceDetail || "";
                document.getElementById("modal-id-fee-invoice-detail").innerText = btn.dataset.idFeeInvoiceDetail || "";
                document.getElementById("modal-name1-invoice-detail").innerText = btn.dataset.name1InvoiceDetail || "";
                document.getElementById("modal-name2-invoice-detail").value = btn.dataset.name2InvoiceDetail || "";
                document.getElementById("modal-money-invoice-detail").value = btn.dataset.moneyInvoiceDetail || "";
                document.getElementById("modal-date-invoice-detail").value = btn.dataset.dateInvoiceDetail || "";
            
                invoiceDetailModal.classList.add("show");
            }
            if (btn.id == "btn-receipt"){
                document.getElementById("modal-id-apt-bill").innerText = btn.dataset.idAptBill || "";
                document.getElementById("modal-id-fee-bill").innerText = btn.dataset.idFeeBill || "";
                document.getElementById("modal-name1-bill").innerText = btn.dataset.name1Bill || "";
                document.getElementById("modal-name2-bill").value = btn.dataset.name2Bill || "";
                document.getElementById("modal-money-bill").value = btn.dataset.moneyBill || "";
                document.getElementById("modal-date-bill").value = btn.dataset.dateBill || "";
                
                receiptModal.classList.add("show");
            }
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
       ĐÓNG MODAL HÓA Đơn
       =============================== */
    closeInvoiceDetailBtn.addEventListener("click", () => {
        closeInvoiceModal(true);
    });

    invoiceDetailModal.addEventListener("click", e => {
        if (e.target === invoiceDetailModal) {
            closeInvoiceModal(true);
        }
    });
    
    function closeInvoiceModal(showMessage = false) {
        invoiceDetailModal.classList.remove("show");
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
<<<<<<< HEAD
})
=======

});
>>>>>>> 51bdf234a72c3d4cf847f52c9d51eaea8b1113e2
