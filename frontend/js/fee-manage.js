document.addEventListener("DOMContentLoaded", () => {
  // Khai báo biến toàn cục trong scope
  let currentRow = null;
  let selectedId = null;

  function attachEvents() {
    document.querySelectorAll(".btn-detail").forEach((btn) => {
      btn.addEventListener("click", async () => {
        currentRow = btn.closest("tr");

        document.getElementById("modal-name").innerText =
          btn.dataset.name || "";
        document.getElementById("modal-owner").innerText =
          btn.dataset.owner || "";
        document.getElementById("modal-hokhau").innerText =
          btn.dataset.hokhau || "Chưa có";

        const maHoKhau = btn.dataset.hokhau;
        const tbody = document.getElementById("modal-fee-tbody");
        const loading = document.getElementById("modal-loading");
        const empty = document.getElementById("modal-empty");
        const summary = document.getElementById("modal-summary");

        // Reset và hiển thị loading
        tbody.innerHTML = "";
        loading.style.display = "block";
        empty.style.display = "none";
        summary.style.display = "none";

        detailModal.classList.add("show");

        // danh sách khoản thu
        if (maHoKhau) {
          try {
            const res = await fetch(
              `http://localhost:3000/api/khoan-thu-ho-khau/${maHoKhau}`
            );
            const data = await res.json();
            loading.style.display = "none";

            if (data.success && data.data && data.data.length > 0) {
              let tongTien = 0;
              let daDong = 0;

              data.data.forEach((fee) => {
                const thanhTien = fee.ThanhTien || 0;
                tongTien += thanhTien;

                // Kiểm tra trạng thái đã đóng
                if (fee.TrangThai === "Đã đóng" || fee.TrangThai === "da_thu") {
                  daDong += thanhTien;
                }

                const tr = document.createElement("tr");
                tr.innerHTML = `
                  <td>${fee.MaKhoanThu}</td>
                  <td>${fee.TenKhoanThu || ""}</td>
                  <td>${fee.LoaiKhoanThu || ""}</td>
                  <td>${
                    fee.ThanhTien
                      ? fee.ThanhTien.toLocaleString("vi-VN") + " đ"
                      : "0 đ"
                  }</td>
                  <td><span class="status-${
                    fee.TrangThai === "Đã đóng" || fee.TrangThai === "da_thu"
                      ? "paid"
                      : "unpaid"
                  }">${
                  fee.TrangThai === "Đã đóng" || fee.TrangThai === "da_thu"
                    ? "Đã đóng"
                    : "Chưa đóng"
                }</span></td>
                `;
                tbody.appendChild(tr);
              });

              // Hiển thị tổng kết
              const conThieu = tongTien - daDong;
              document.getElementById("modal-tong-tien").textContent =
                tongTien.toLocaleString("vi-VN") + " đ";
              document.getElementById("modal-da-dong").textContent =
                daDong.toLocaleString("vi-VN") + " đ";
              document.getElementById("modal-con-thieu").textContent =
                conThieu.toLocaleString("vi-VN") + " đ";
              summary.style.display = "block";
            } else {
              empty.style.display = "block";
            }
          } catch (err) {
            console.error("Lỗi khi load khoản thu:", err);
            loading.style.display = "none";
            empty.innerText = "Lỗi khi tải dữ liệu";
            empty.style.display = "block";
          }
        } else {
          loading.style.display = "none";
          empty.innerText = "Căn hộ chưa có hộ khẩu";
          empty.style.display = "block";
        }
      });
    });

    document.querySelectorAll(".btn-remove").forEach((btn) => {
      btn.addEventListener("click", () => {
        currentRow = btn.closest("tr");
        selectedId = btn.dataset.id;
        // Thêm logic xóa nếu cần
        console.log("Remove clicked for ID:", selectedId);
      });
    });
  }

  /* ===============================
     LOAD FROM BACKEND - DONE
     =============================== */
  async function loadapartmentFees() {
    try {
      const res = await fetch("http://localhost:3000/api/can-ho");
      const response = await res.json();
      console.log("API Response:", response); // debug

      const tbody = document.querySelector(".fee-manage-table tbody");
      tbody.innerHTML = "";

      //API trả về Array trực tiếp (không có .data), nên apartments là mảng rỗng.
      // return array trực tiếp hoặc object có property data
      const apartments = Array.isArray(response)
        ? response
        : response.data || [];
      console.log("Apartments to render:", apartments.length); // debug

      // tìm chủ hộ
      for (const apartment of apartments) {
        let chuCanHo = "Chưa có chủ hộ";

        try {
          const ownerRes = await fetch(
            `http://localhost:3000/api/can-ho/tim-chu-ho/${apartment.MaCanHo}`
          );
          const ownerData = await ownerRes.json();

          if (ownerData.chuHo && ownerData.chuHo.HoTen) {
            chuCanHo = ownerData.chuHo.HoTen;
          } else if (apartment.TrangThai === "trong") {
            chuCanHo = "Căn hộ trống";
          }
        } catch (err) {
          console.error(
            `Lỗi khi tìm chủ hộ cho căn hộ ${apartment.MaCanHo}:`,
            err
          );
        }

        const maHoKhau = apartment.MaHoKhau || "";
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${apartment.MaCanHo}</td>
          <td>${apartment.TenCanHo}</td>
          <td>${chuCanHo}</td> 
          <td>${apartment.Tang || ""}</td>
          <td>${apartment.TrangThai || ""}</td>
          <td class="action">
            <span class="btn-detail"
                data-id="${apartment.MaCanHo}"
                data-name="${apartment.TenCanHo}"
                data-owner="${chuCanHo}"
                data-hokhau="${maHoKhau}"
                data-floor="${apartment.Tang || ""}"
                data-status="${apartment.TrangThai || ""}"
                data-area="${apartment.DienTich || ""}"
                data-note="${apartment.MoTa || ""}">
            </span>
            <span class="btn-remove" data-id="${apartment.MaCanHo}"></span>
          </td>
        `;
        tbody.appendChild(tr);
      }

      attachEvents();
    } catch (err) {
      console.error("Error loading apartment fee:", err);
      showNotify("Không thể tải danh sách khoản thu!");
    }
  }
  loadapartmentFees();
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

  /* ===============================
       ĐÓNG MODAL CHI TIẾT
       =============================== */
  [closeDetailBtn, btnCloseDetail].forEach((btn) => {
    btn?.addEventListener("click", () => {
      detailModal.classList.remove("show");
    });
  });

  detailModal.addEventListener("click", (e) => {
    if (e.target === detailModal) {
      detailModal.classList.remove("show");
    }
  });

  /* ===============================
       ICON HÓA ĐƠN → MỞ MODAL THANH TOÁN
       =============================== */
  document.querySelectorAll(".btn-receipt").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentRow = btn.closest("tr");

      document.getElementById("modal-id-apt-bill").innerText =
        btn.dataset.idAptBill || "";
      document.getElementById("modal-id-fee-bill").innerText =
        btn.dataset.idFeeBill || "";
      document.getElementById("modal-name1-bill").innerText =
        btn.dataset.name1Bill || "";
      document.getElementById("modal-name2-bill").value =
        btn.dataset.name2Bill || "";
      document.getElementById("modal-money-bill").value =
        btn.dataset.moneyBill || "";
      document.getElementById("modal-date-bill").value =
        btn.dataset.dateBill || "";

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
    const statusSpan =
      statusCell.querySelector(".status-label") ||
      statusCell.querySelector("span");

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

  receiptModal.addEventListener("click", (e) => {
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

  [notifyOk, closeNotify].forEach((btn) => {
    btn?.addEventListener("click", () => {
      notifyModal.classList.remove("show");
    });
  });
});
