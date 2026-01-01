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

              // Attach event cho nút xuất hóa đơn
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
            <span class="btn-invoice-list"
                data-name="${apartment.TenCanHo}"
                data-owner="${chuCanHo}"
                data-hokhau="${maHoKhau}"
                title="Xem danh sách hóa đơn">
            </span>
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
  // 1. Cấu hình thông tin cố định của Ban Quản Lý (Thay đổi theo thực tế)
  const bqlInfo = {
    name: "BAN QUẢN LÝ CHUNG CƯ BLUEMOON",
    address: "Ngã Tư Văn Phú, Quận Hà Đông, TP. Hà Nội",
    taxCode: "0101811757", 
    phone: "0543.8592.750",
    bankAccount: "111000005576 - Ngân hàng Vietinbank - CN Hà Đông",
    logo: "../assets/logo.png" // Đường dẫn logo của bạn
  };

  // 2. Tạo nội dung HTML (Sử dụng dấu huyền ` để tính toán biểu thức JS)
  const invoiceHTML = `
  <div style="font-family: 'Times New Roman', Times, serif; padding: 20px; background: white; color: #000; line-height: 1.4; width: 190mm; margin: auto; border: 1px solid #eee;">
      
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #000; padding-bottom: 10px;">
          <div style="width: 70%; display: flex; align-items: center;">
              <img src="${bqlInfo.logo}" style="height: 65px; margin-right: 15px;" onerror="this.src='https://via.placeholder.com/70x70?text=LOGO'">
              <div>
                  <h2 style="margin: 0; font-size: 15px; color: #1F5FA9; text-transform: uppercase;">${bqlInfo.name}</h2>
                  <p style="margin: 2px 0; font-size: 12px;"><strong>Mã số thuế:</strong> ${bqlInfo.taxCode}</p>
                  <p style="margin: 2px 0; font-size: 12px;"><strong>Địa chỉ:</strong> ${bqlInfo.address}</p>
                  <p style="margin: 2px 0; font-size: 12px;"><strong>Điện thoại:</strong> ${bqlInfo.phone}</p>
                  <p style="margin: 2px 0; font-size: 12px;"><strong>Số tài khoản:</strong> ${bqlInfo.bankAccount}</p>
              </div>
          </div>
          <div style="width: 25%; text-align: right; font-size: 12px;">
              <p style="margin: 0;"><strong>Mẫu số:</strong> 01GTKT0/001</p>
              <p style="margin: 0;"><strong>Ký hiệu:</strong> MS/26E</p>
              <p style="margin: 0; color: #d32f2f;"><strong>Số:</strong> ${String(Math.floor(Math.random() * 1000000)).padStart(7, '0')}</p>
          </div>
      </div>

      <div style="text-align: center; margin: 20px 0;">
          <h1 style="margin: 0; color: #d32f2f; font-size: 22px; font-weight: bold;">HÓA ĐƠN THANH TOÁN</h1>
          <p style="margin: 2px 0; font-style: italic; font-size: 12px;">(Bản thể hiện của hóa đơn điện tử)</p>
          <p style="margin: 2px 0; font-size: 13px;">Ngày ${new Date().getDate()} tháng ${new Date().getMonth() + 1} năm ${new Date().getFullYear()}</p>
      </div>

      <div style="margin-bottom: 15px; font-size: 14px; border-top: 1px solid #000; padding-top: 10px;">
          <table style="width: 100%; border-collapse: collapse;">
              <tr>
                  <td style="width: 25%; padding: 2px 0;">Họ tên người mua hàng:</td>
                  <td style="font-weight: bold;">${data.tenChuHo || "Nguyễn Văn An"}</td>
              </tr>
              <tr>
                  <td style="padding: 2px 0;">Tên đơn vị (Căn hộ):</td>
                  <td>Căn hộ ${data.tenCanHo || "N/A"} - Mã hộ: ${data.maHoKhau || "N/A"}</td>
              </tr>
              <tr>
                  <td style="padding: 2px 0;">Tên hóa đơn:</td>
                  <td>${data.tenHoaDon || "N/A"}</td>
              </tr>
          </table>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 13px;">
          <thead>
              <tr style="background-color: #f2f2f2; text-align: center; font-weight: bold;">
                  <th style="border: 1px solid #000; padding: 5px; width: 40px;">STT</th>
                  <th style="border: 1px solid #000; padding: 5px;">Tên hàng hóa, dịch vụ</th>
                  <th style="border: 1px solid #000; padding: 5px; width: 60px;">ĐVT</th>
                  <th style="border: 1px solid #000; padding: 5px; width: 100px;">Thành tiền</th>
              </tr>
          </thead>
          <tbody>
              <tr style="min-height: 150px;">
                  <td style="border: 1px solid #000; padding: 10px; text-align: center; vertical-align: top;">1</td>
                  <td style="border: 1px solid #000; padding: 10px; vertical-align: top;">
                      <p style="margin: 0; font-weight: bold;">${data.tenKhoanThu || "Phí dịch vụ chung cư"}</p>
                      <p style="margin: 5px 0 0; font-size: 11px; color: #555;">Mã khoản thu: ${data.maKhoanThu || "N/A"}</p>
                  </td>
                  <td style="border: 1px solid #000; padding: 10px; text-align: center; vertical-align: top;">Tháng</td>
                  <td style="border: 1px solid #000; padding: 10px; text-align: right; vertical-align: top;">
                      ${data.soTien}
                  </td>
              </tr>
              <tr style="font-weight: bold; background: #fafafa;">
                  <td colspan="3" style="border: 1px solid #000; padding: 8px; text-align: right; text-transform: uppercase;">Tổng cộng tiền thanh toán:</td>
                  <td style="border: 1px solid #000; padding: 8px; text-align: right; color: #d32f2f;">
                      ${data.soTien} đ
                  </td>
              </tr>
          </tbody>
      </table>

      <div style="display: flex; justify-content: space-around; margin-top: 20px; text-align: center;">
          <div style="width: 45%;">
              <p style="margin: 0; font-weight: bold;">Người mua hàng</p>
              <p style="margin: 0; font-size: 11px; font-style: italic;">(Ký, ghi rõ họ tên)</p>
          </div>
          <div style="width: 45%; position: relative;">
              <p style="margin: 0; font-weight: bold;">Người bán hàng</p>
              <p style="margin: 0; font-size: 11px; font-style: italic;">(Ký, ghi rõ họ tên, đóng dấu)</p>
              
              <div style="margin-top: 15px; border: 2px solid #4CAF50; padding: 5px; color: #4CAF50; font-size: 11px; font-weight: bold; text-align: left; width: fit-content; margin-left: auto; margin-right: auto; transform: rotate(-2deg);">
                  Signature Valid<br>
                  Ký bởi: ${bqlInfo.name}<br>
                  Ngày ký: ${new Date().toLocaleDateString("vi-VN")}
              </div>
          </div>
      </div>

      <div style="margin-top: 50px; text-align: center; font-size: 11px; color: #666; border-top: 1px dashed #ccc; padding-top: 10px;">
          Tra cứu hóa đơn tại Website: https://bluemoon.vn/tra-cuu-hoa-don<br>
          (Cần kiểm tra, đối chiếu khi lập, giao, nhận hóa đơn)
      </div>
  </div>`;

  // 3. Cấu hình html2pdf để xuất file chuẩn A4
  const opt = {
    margin: 5,
    filename: `HoaDon_${data.maKhoanThu}_${data.maHoKhau}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
        scale: 2, 
        useCORS: true, 
        letterRendering: true 
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  // Thực hiện lưu file
  html2pdf().set(opt).from(invoiceHTML).save();
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
});

