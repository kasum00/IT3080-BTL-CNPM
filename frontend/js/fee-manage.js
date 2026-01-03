document.addEventListener("DOMContentLoaded", () => {
  // Khai báo biến toàn cục trong scope
  let currentRow = null;
  let selectedId = null;
  let allApartments = []; // Lưu tất cả dữ liệu để filter

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
                const isPaid =
                  fee.TrangThai === "Đã đóng" || fee.TrangThai === "da_thu";
                if (isPaid) {
                  daDong += thanhTien;
                }

                const tr = document.createElement("tr");
                tr.dataset.maKhoanThu = fee.MaKhoanThu;
                tr.dataset.thanhTien = thanhTien;
                tr.innerHTML = `
                  <td>${fee.MaKhoanThu}</td>
                  <td>${fee.TenKhoanThu || ""}</td>
                  <td>${fee.LoaiKhoanThu || ""}</td>
                  <td>${
                    fee.ThanhTien
                      ? fee.ThanhTien.toLocaleString("vi-VN") + " đ"
                      : "0 đ"
                  }</td>
                  <td><span class="status-${isPaid ? "paid" : "unpaid"}">${
                  isPaid ? "Đã đóng" : "Chưa đóng"
                }</span></td>
                  <td>${
                    isPaid
                      ? '<span style="color: #4CAF50;">✓ Đã thanh toán</span>'
                      : '<button class="btn-pay-fee" style="padding: 5px 10px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;">Thanh toán</button>'
                  }</td>
                `;
                tbody.appendChild(tr);
              });

              // tổng kết tiền
              const conThieu = tongTien - daDong;
              document.getElementById("modal-tong-tien").textContent =
                tongTien.toLocaleString("vi-VN") + " đ";
              document.getElementById("modal-da-dong").textContent =
                daDong.toLocaleString("vi-VN") + " đ";
              document.getElementById("modal-con-thieu").textContent =
                conThieu.toLocaleString("vi-VN") + " đ";
              summary.style.display = "block";

              document.querySelectorAll(".btn-pay-fee").forEach((payBtn) => {
                payBtn.addEventListener("click", async () => {
                  const row = payBtn.closest("tr");
                  const maKhoanThu = row.dataset.maKhoanThu;
                  const thanhTien = parseFloat(row.dataset.thanhTien);

                  try {
                    const updateRes = await fetch(
                      `http://localhost:3000/api/khoan-thu-ho-khau/${maHoKhau}/${maKhoanThu}`,
                      {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ TrangThai: "da_thu" }),
                      }
                    );

                    const updateData = await updateRes.json();

                    if (!updateData.success) {
                      throw new Error(
                        updateData.error || "Không thể cập nhật trạng thái"
                      );
                    }

                    // Cập nhật trạng thái (front)
                    const statusCell = row.children[4];
                    const statusSpan = statusCell.querySelector("span");
                    statusSpan.className = "status-paid";
                    statusSpan.textContent = "Đã đóng";

                    // Cập nhật nút thanh toán (front)
                    const payCell = row.children[5];
                    payCell.innerHTML =
                      '<span style="color: #4CAF50;">✓ Đã thanh toán</span>';

                    // Cập nhật tổng kết
                    const currentDaDong = parseFloat(
                      document
                        .getElementById("modal-da-dong")
                        .textContent.replace(/[^0-9]/g, "")
                    );
                    const newDaDong = currentDaDong + thanhTien;
                    document.getElementById("modal-da-dong").textContent =
                      newDaDong.toLocaleString("vi-VN") + " đ";

                    const currentConThieu = parseFloat(
                      document
                        .getElementById("modal-con-thieu")
                        .textContent.replace(/[^0-9]/g, "")
                    );
                    const newConThieu = currentConThieu - thanhTien;
                    document.getElementById("modal-con-thieu").textContent =
                      newConThieu.toLocaleString("vi-VN") + " đ";

                    showNotify("Thanh toán khoản thu thành công!");
                  } catch (err) {
                    console.error("Lỗi khi thanh toán:", err);
                    showNotify(
                      "Có lỗi xảy ra khi thanh toán: " +
                        (err.message || "Lỗi không xác định")
                    );
                  }
                });
              });
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

    document.querySelectorAll(".btn-invoice-list").forEach((btn) => {
      btn.addEventListener("click", async () => {
        currentRow = btn.closest("tr");

        document.getElementById("invoice-modal-name").innerText =
          btn.dataset.name || "";
        document.getElementById("invoice-modal-owner").innerText =
          btn.dataset.owner || "";
        document.getElementById("invoice-modal-hokhau").innerText =
          btn.dataset.hokhau || "Chưa có";

        const maHoKhau = btn.dataset.hokhau;
        const tbody = document.getElementById("invoice-modal-tbody");
        const loading = document.getElementById("invoice-modal-loading");
        const empty = document.getElementById("invoice-modal-empty");

        // Reset và hiển thị loading
        tbody.innerHTML = "";
        loading.style.display = "block";
        empty.style.display = "none";

        invoiceListModal.classList.add("show");

        // Load danh sách khoản thu
        if (maHoKhau) {
          try {
            const res = await fetch(
              `http://localhost:3000/api/khoan-thu-ho-khau/${maHoKhau}`
            );
            const data = await res.json();
            loading.style.display = "none";

            if (data.success && data.data && data.data.length > 0) {
              data.data.forEach((fee) => {
                const thanhTien = fee.ThanhTien || 0;
                const isPaid =
                  fee.TrangThai === "Đã đóng" || fee.TrangThai === "da_thu";

                const tr = document.createElement("tr");
                tr.dataset.maKhoanThu = fee.MaKhoanThu;
                tr.dataset.maHoKhau = maHoKhau;
                tr.dataset.thanhTien = thanhTien;
                tr.innerHTML = `
                  <td>${fee.MaKhoanThu}</td>
                  <td>${fee.TenKhoanThu || ""}</td>
                  <td>${fee.LoaiKhoanThu || ""}</td>
                  <td>${
                    fee.ThanhTien
                      ? fee.ThanhTien.toLocaleString("vi-VN") + " đ"
                      : "0 đ"
                  }</td>
                  <td><span class="status-${isPaid ? "paid" : "unpaid"}">${
                  isPaid ? "Đã đóng" : "Chưa đóng"
                }</span></td>
                  <td class="invoice-action">
                    <span class="btn-export-invoice" 
                      data-ma-khoan-thu="${fee.MaKhoanThu}"
                      data-ma-ho-khau="${maHoKhau}"
                      data-ten-khoan-thu="${fee.TenKhoanThu || ""}"
                      data-thanh-tien="${thanhTien}"
                      title="Xuất hóa đơn"></span>
                  </td>
                `;
                tbody.appendChild(tr);
              });

              attachExportInvoiceEvents();
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
  }

  // Hàm xử lý xuất hóa đơn
  function attachExportInvoiceEvents() {
    document.querySelectorAll(".btn-export-invoice").forEach((btn) => {
      btn.addEventListener("click", () => {
        const maKhoanThu = btn.dataset.maKhoanThu;
        const maHoKhau = btn.dataset.maHoKhau;
        const tenKhoanThu = btn.dataset.tenKhoanThu;
        const thanhTien = btn.dataset.thanhTien;

        // Đóng modal danh sách hóa đơn
        invoiceListModal.classList.remove("show");

        // Điền thông tin vào modal hóa đơn
        document.getElementById("modal-name1-bill").innerText = tenKhoanThu;
        document.getElementById("modal-id-apt-bill").innerText = maHoKhau;
        document.getElementById("modal-id-fee-bill").innerText = maKhoanThu;
        document.getElementById(
          "modal-name2-bill"
        ).value = `Hóa đơn ${tenKhoanThu}`;
        document.getElementById("modal-money-bill").value =
          parseInt(thanhTien).toLocaleString("vi-VN");

        // ngày xuất hóa đơn = now
        const today = new Date().toISOString().split("T")[0];
        document.getElementById("modal-date-bill").value = today;

        receiptModal.classList.add("show");
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

      const apartments = Array.isArray(response)
        ? response
        : response.data || [];
      console.log("Apartments to render:", apartments.length); // debug

      // Lấy thông tin đầy đủ cho từng căn hộ
      allApartments = [];

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

        // Lấy trạng thái thanh toán và tổng tiền
        let paymentStatus = "Chưa có khoản thu";
        let statusClass = "none";
        let totalAmount = 0;
        let paidAmount = 0;

        if (maHoKhau) {
          try {
            const feeRes = await fetch(
              `http://localhost:3000/api/khoan-thu-ho-khau/${maHoKhau}`
            );
            const feeData = await feeRes.json();

            if (feeData.success && feeData.data && feeData.data.length > 0) {
              const totalFees = feeData.data.length;
              const paidFees = feeData.data.filter(
                (fee) =>
                  fee.TrangThai === "Đã đóng" || fee.TrangThai === "da_thu"
              ).length;

              // Tính tổng tiền
              feeData.data.forEach((fee) => {
                totalAmount += fee.ThanhTien || 0;
                if (fee.TrangThai === "Đã đóng" || fee.TrangThai === "da_thu") {
                  paidAmount += fee.ThanhTien || 0;
                }
              });

              if (paidFees === totalFees) {
                paymentStatus = "Đã đóng";
                statusClass = "paid";
              } else if (paidFees > 0) {
                paymentStatus = `Một phần (${paidFees}/${totalFees})`;
                statusClass = "partial";
              } else {
                paymentStatus = "Chưa đóng";
                statusClass = "unpaid";
              }
            }
          } catch (err) {
            console.error(
              `Lỗi khi tải trạng thái thanh toán cho hộ khẩu ${maHoKhau}:`,
              err
            );
          }
        }

        // Lưu thông tin đầy đủ vào allApartments
        allApartments.push({
          ...apartment,
          chuCanHo,
          maHoKhau,
          paymentStatus,
          statusClass,
          totalAmount,
          paidAmount,
        });
      }

      renderApartments(allApartments);
    } catch (err) {
      console.error("Error loading apartment fee:", err);
      showNotify("Không thể tải danh sách khoản thu!");
    }
  }

  /* ===============================
     RENDER TABLE
     =============================== */
  function renderApartments(apartments) {
    const tbody = document.querySelector(".fee-manage-table tbody");
    tbody.innerHTML = "";

    apartments.forEach((apartment) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${apartment.MaCanHo}</td>
        <td>${apartment.TenCanHo}</td>
        <td>${apartment.chuCanHo}</td> 
        <td>${apartment.Tang || ""}</td>
        <td>${apartment.TrangThai || ""}</td>
        <td><span class="status-${apartment.statusClass}">${
        apartment.paymentStatus
      }</span></td>
        <td class="action">
          <span class="btn-detail"
              data-id="${apartment.MaCanHo}"
              data-name="${apartment.TenCanHo}"
              data-owner="${apartment.chuCanHo}"
              data-hokhau="${apartment.maHoKhau}"
              data-floor="${apartment.Tang || ""}"
              data-status="${apartment.TrangThai || ""}"
              data-area="${apartment.DienTich || ""}"
              data-note="${apartment.MoTa || ""}">
          </span>
          <span class="btn-invoice-list"
              data-name="${apartment.TenCanHo}"
              data-owner="${apartment.chuCanHo}"
              data-hokhau="${apartment.maHoKhau}"
              title="Xem danh sách hóa đơn">
          </span>
        </td>
      `;
      tbody.appendChild(tr);
    });

    attachEvents();
  }

  loadapartmentFees();
  /* ===============================
       MODAL CHI TIẾT
       =============================== */
  const detailModal = document.getElementById("fee-manage-modal");
  const receiptModal = document.getElementById("receipt-modal");
  const invoiceListModal = document.getElementById("invoice-list-modal");
  const closeDetailBtn = document.getElementById("close-modal");
  const btnCloseDetail = document.getElementById("btn-close-detail");
  const closeInvoiceBtn = document.getElementById("close-invoice-modal");
  const btnCloseInvoice = document.getElementById("btn-close-invoice");

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
       ĐÓNG MODAL DANH SÁCH HÓA ĐƠN
       =============================== */
  [closeInvoiceBtn, btnCloseInvoice].forEach((btn) => {
    btn?.addEventListener("click", () => {
      invoiceListModal.classList.remove("show");
    });
  });

  invoiceListModal.addEventListener("click", (e) => {
    if (e.target === invoiceListModal) {
      invoiceListModal.classList.remove("show");
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
       XUẤT HÓA ĐƠN PDF
       =============================== */
  const btnExportPdf = document.getElementById("btn-export-pdf");

  btnExportPdf?.addEventListener("click", () => {
    // Lấy thông tin từ form
    const tenKhoanThu = document.getElementById("modal-name1-bill").innerText;
    const maHoKhau = document.getElementById("modal-id-apt-bill").innerText;
    const maKhoanThu = document.getElementById("modal-id-fee-bill").innerText;
    const tenHoaDon = document.getElementById("modal-name2-bill").value;
    const soTien = document.getElementById("modal-money-bill").value;
    const ngayXuat = document.getElementById("modal-date-bill").value;

    // Tạo PDF
    exportInvoicePDF({
      tenKhoanThu,
      maHoKhau,
      maKhoanThu,
      tenHoaDon,
      soTien,
      ngayXuat,
    });

    // Đóng modal
    receiptModal.classList.remove("show");
    showNotify("Đã xuất hóa đơn PDF thành công!");
  });

  // Hàm tạo PDF hóa đơn
  function exportInvoicePDF(data) {
    // Tạo HTML content cho hóa đơn
    const invoiceHTML = `
      <div style="font-family: 'Times New Roman', serif; padding: 40px; background: white;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1F5FA9; font-size: 28px; margin: 0; font-weight: bold;">HÓA ĐƠN KHOẢN THU</h1>
          <div style="margin-top: 15px;">
            <p style="margin: 5px 0; font-size: 14px; font-weight: bold;">CHUNG CƯ BLUEMOON</p>
            <p style="margin: 5px 0; font-size: 12px;">Địa chỉ: Hà Nội</p>
            <p style="margin: 5px 0; font-size: 12px;">Điện thoại: 024.xxxx.xxxx</p>
          </div>
        </div>
        
        <hr style="border: 1px solid #333; margin: 20px 0;">
        
        <!-- Thông tin hóa đơn -->
        <div style="margin: 30px 0;">
          <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 15px;">THÔNG TIN HÓA ĐƠN</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-size: 13px; width: 40%;"><strong>Tên hóa đơn:</strong></td>
              <td style="padding: 8px 0; font-size: 13px;">${
                data.tenHoaDon || "N/A"
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-size: 13px;"><strong>Mã hộ khẩu:</strong></td>
              <td style="padding: 8px 0; font-size: 13px;">${
                data.maHoKhau || "N/A"
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-size: 13px;"><strong>Mã khoản thu:</strong></td>
              <td style="padding: 8px 0; font-size: 13px;">${
                data.maKhoanThu || "N/A"
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-size: 13px;"><strong>Tên khoản thu:</strong></td>
              <td style="padding: 8px 0; font-size: 13px;">${
                data.tenKhoanThu || "N/A"
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-size: 13px;"><strong>Ngày xuất hóa đơn:</strong></td>
              <td style="padding: 8px 0; font-size: 13px;">${
                data.ngayXuat || new Date().toLocaleDateString("vi-VN")
              }</td>
            </tr>
          </table>
        </div>
        
        <hr style="border: 0.5px solid #999; margin: 20px 0;">
        
        <!-- Số tiền -->
        <div style="margin: 30px 0; padding: 20px; background-color: #f8f9fa;">
          <h3 style="color: #2196F3; font-size: 18px; margin-bottom: 10px; font-weight: bold;">SỐ TIỀN THANH TOÁN</h3>
          <p style="color: #FF5722; font-size: 24px; font-weight: bold; margin: 10px 0;">${
            data.soTien
          } đ</p>
        </div>
        
        <!-- Ghi chú -->
        <div style="margin: 25px 0; padding: 15px; background-color: #fff3cd; border-left: 4px solid #ffc107;">
          <p style="margin: 5px 0; font-size: 12px; font-style: italic; color: #666;">Vui lòng thanh toán đúng hạn để tránh phát sinh phí trễ hạn.</p>
          <p style="margin: 5px 0; font-size: 12px; font-style: italic; color: #666;">Mọi thắc mắc xin vui lòng liên hệ Ban quản lý.</p>
        </div>
        
        <!-- Chữ ký -->
        <div style="margin-top: 60px;">
          <table style="width: 100%;">
            <tr>
              <td style="text-align: center; width: 50%;">
                <p style="font-size: 13px; font-weight: bold;">Người lập phiếu</p>
                <p style="font-size: 11px; font-style: italic; margin-top: 60px;">(Ký, họ tên)</p>
              </td>
              <td style="text-align: center; width: 50%;">
                <p style="font-size: 13px; font-weight: bold;">Ban quản lý</p>
                <p style="font-size: 11px; font-style: italic; margin-top: 60px;">(Ký, đóng dấu)</p>
              </td>
            </tr>
          </table>
        </div>
        
        <!-- Footer -->
        <div style="margin-top: 40px; text-align: center; font-size: 10px; color: #999;">
          <p>Hóa đơn được tạo tự động ngày ${new Date().toLocaleString(
            "vi-VN"
          )}</p>
        </div>
      </div>
    `;

    // Tạo một div tạm để chứa nội dung
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = invoiceHTML;
    tempDiv.style.width = "210mm"; // A4 width
    tempDiv.style.minHeight = "297mm"; // A4 height
    document.body.appendChild(tempDiv);

    // Cấu hình html2pdf
    const opt = {
      margin: 10,
      filename: `HoaDon_${data.maKhoanThu}_${Date.now()}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        logging: false,
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    // Tạo và tải PDF - sử dụng element trực tiếp, không dùng .from()
    setTimeout(() => {
      html2pdf()
        .set(opt)
        .from(tempDiv)
        .save()
        .then(() => {
          // Xóa div tạm sau khi tạo PDF
          document.body.removeChild(tempDiv);
        })
        .catch((error) => {
          console.error("Lỗi khi tạo PDF:", error);
          if (document.body.contains(tempDiv)) {
            document.body.removeChild(tempDiv);
          }
          showNotify("Có lỗi xảy ra khi xuất PDF!");
        });
    }, 200);
  }

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

  /* ===============================
     TÌM KIẾM VÀ LỌC THEO CĂN HỘ
     =============================== */
  const searchAptInput = document.getElementById("search-apt-input");
  const apartmentFilterModal = document.getElementById("apartmentFilterModal");
  const btnOpenAptFilter = document.getElementById("btn-open-apt-filter");
  const btnApplyAptFilter = document.getElementById("btn-apply-apt-filter");
  const btnResetAptFilter = document.getElementById("btn-reset-apt-filter");
  const closeAptFilter = document.getElementById("close-apt-filter");

  // Tìm kiếm theo mã hoặc tên
  searchAptInput?.addEventListener("input", (e) => {
    const keyword = e.target.value.toLowerCase().trim();

    const filtered = allApartments.filter((apt) => {
      const maCanHo = (apt.MaCanHo || "").toLowerCase();
      const tenCanHo = (apt.TenCanHo || "").toLowerCase();
      return maCanHo.includes(keyword) || tenCanHo.includes(keyword);
    });

    renderApartments(filtered);
  });

  // Mở modal filter
  btnOpenAptFilter?.addEventListener("click", () => {
    apartmentFilterModal.classList.add("show");
  });

  // Đóng modal filter
  closeAptFilter?.addEventListener("click", () => {
    apartmentFilterModal.classList.remove("show");
  });

  apartmentFilterModal?.addEventListener("click", (e) => {
    if (e.target === apartmentFilterModal) {
      apartmentFilterModal.classList.remove("show");
    }
  });

  // apply filter
  btnApplyAptFilter?.addEventListener("click", () => {
    const paymentStatus = document.getElementById(
      "filter-payment-status"
    ).value;
    const apartmentStatus = document.getElementById(
      "filter-apartment-status"
    ).value;
    const minTotal =
      parseFloat(document.getElementById("filter-apt-min-total").value) || 0;
    const maxTotal =
      parseFloat(document.getElementById("filter-apt-max-total").value) ||
      Infinity;
    const sortOption = document.getElementById("filter-apt-sort").value;

    let filtered = [...allApartments];

    // Lọc theo tình trạng thanh toán
    if (paymentStatus) {
      filtered = filtered.filter((apt) => apt.statusClass === paymentStatus);
    }

    // Lọc theo trạng thái căn hộ
    if (apartmentStatus) {
      filtered = filtered.filter((apt) => apt.TrangThai === apartmentStatus);
    }

    // Lọc theo tổng tiền
    filtered = filtered.filter((apt) => {
      const total = apt.totalAmount || 0;
      return total >= minTotal && total <= maxTotal;
    });

    // Sắp xếp
    switch (sortOption) {
      case "code-asc":
        filtered.sort((a, b) =>
          (a.MaCanHo || "").localeCompare(b.MaCanHo || "")
        );
        break;
      case "code-desc":
        filtered.sort((a, b) =>
          (b.MaCanHo || "").localeCompare(a.MaCanHo || "")
        );
        break;
      case "name-asc":
        filtered.sort((a, b) =>
          (a.TenCanHo || "").localeCompare(b.TenCanHo || "")
        );
        break;
      case "name-desc":
        filtered.sort((a, b) =>
          (b.TenCanHo || "").localeCompare(a.TenCanHo || "")
        );
        break;
      case "total-asc":
        filtered.sort((a, b) => (a.totalAmount || 0) - (b.totalAmount || 0));
        break;
      case "total-desc":
        filtered.sort((a, b) => (b.totalAmount || 0) - (a.totalAmount || 0));
        break;
    }

    renderApartments(filtered);
    apartmentFilterModal.classList.remove("show");
    showNotify(`Đã lọc được ${filtered.length} căn hộ`);
  });

  // Reset filter
  btnResetAptFilter?.addEventListener("click", () => {
    document.getElementById("filter-payment-status").value = "";
    document.getElementById("filter-apartment-status").value = "";
    document.getElementById("filter-apt-min-total").value = "";
    document.getElementById("filter-apt-max-total").value = "";
    document.getElementById("filter-apt-sort").value = "code-asc";

    renderApartments(allApartments);
    apartmentFilterModal.classList.remove("show");
    showNotify("Đã reset filter");
  });
});
