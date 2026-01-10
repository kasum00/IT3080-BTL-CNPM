document.addEventListener("DOMContentLoaded", () => {
  let currentRow = null;
  let selectedId = null;
  let allFees = []; // Lưu tất cả dữ liệu để filter

  function attachEvents() {
    document.querySelectorAll(".btn-detail").forEach((btn) => {
      btn.addEventListener("click", () => openDetail(btn));
    });

    document.querySelectorAll(".btn-remove").forEach((btn) => {
      btn.addEventListener("click", () => {
        currentRow = btn.closest("tr");
        selectedId = btn.dataset.id;
        deleteModal.classList.add("show");
      });
    });
  }

  /* ===============================
     RENDER TABLE
     =============================== */
  function renderFees(fees) {
    const tbody = document.querySelector(".fee-list-table tbody");
    tbody.innerHTML = "";

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to compare only dates

    fees.forEach((fee) => {
      const tr = document.createElement("tr");
      const loaiKhoanThu = fee.LoaiKhoanThu === 1 ? "Định kỳ" : "Một lần";

      // Check if fee is expired
      let isExpired = false;
      if (fee.ThoiGianKetThuc) {
        const endDate = new Date(fee.ThoiGianKetThuc);
        endDate.setHours(0, 0, 0, 0);
        isExpired = endDate < today;
      }

      // Add expired class if needed
      if (isExpired) {
        tr.classList.add("expired-fee");
      }

      tr.innerHTML = `
        <td>${fee.MaKhoanThu}</td>
        <td>${fee.TenKhoanThu}</td>
        <td>${loaiKhoanThu}</td>
        <td>${fee.ThoiGianBatDau || ""}</td>
        <td>${fee.ThoiGianKetThuc || ""}</td>
        <td class="action">
            <span class="btn-detail"
                data-id="${fee.MaKhoanThu}"
                data-name="${fee.TenKhoanThu}"
                data-type="${fee.LoaiKhoanThu}"
                data-status="${fee.ChiTiet || ""}"
                data-budget="${fee.DonGia || ""}"
                data-unit="${fee.DonViTinh || ""}"
                data-start="${fee.ThoiGianBatDau || ""}"
                data-end="${fee.ThoiGianKetThuc || ""}"
                data-note="${fee.GhiChu || ""}">
            </span>
            <span class="btn-remove" data-id="${fee.MaKhoanThu}"></span>
        </td>
      `;
      tbody.appendChild(tr);
    });

    attachEvents();
  }

  /* ===============================
     LOAD FROM BACKEND - DONE
     =============================== */
  function loadFees() {
    fetch("http://localhost:3000/api/khoan-thu")
      .then((res) => res.json())
      .then((response) => {
        console.log("API Response:", response);
        allFees = response.data || [];
        renderFees(allFees);
      })
      .catch((err) => {
        console.error("Error loading fees:", err);
        showNotify("Không thể tải danh sách khoản thu!");
      });
  }

  loadFees();

  /* ===============================
     TÌM KIẾM VÀ LỌC
     =============================== */
  const searchInput = document.getElementById("search-input");
  const filterModal = document.getElementById("filterModal");
  const btnOpenFilter = document.getElementById("btn-open-filter");
  const btnApplyFilter = document.getElementById("btn-apply-filter");
  const btnResetFilter = document.getElementById("btn-reset-filter");
  const closeFilter = document.getElementById("close-filter");

  // Tìm kiếm theo tên hoặc mã khoản thu
  searchInput.addEventListener("input", (e) => {
    const keyword = e.target.value.toLowerCase().trim();

    const filtered = allFees.filter((fee) => {
      const maKhoanThu = (fee.MaKhoanThu || "").toLowerCase();
      const tenKhoanThu = (fee.TenKhoanThu || "").toLowerCase();
      return maKhoanThu.includes(keyword) || tenKhoanThu.includes(keyword);
    });

    renderFees(filtered);
  });

  // Mở modal filter
  btnOpenFilter.addEventListener("click", () => {
    filterModal.classList.add("show");
  });

  // Đóng modal filter
  closeFilter.addEventListener("click", () => {
    filterModal.classList.remove("show");
  });

  filterModal.addEventListener("click", (e) => {
    if (e.target === filterModal) {
      filterModal.classList.remove("show");
    }
  });

  // Áp dụng filter
  btnApplyFilter.addEventListener("click", () => {
    const minPrice =
      parseFloat(document.getElementById("filter-min-price").value) || 0;
    const maxPrice =
      parseFloat(document.getElementById("filter-max-price").value) || Infinity;
    const startDate = document.getElementById("filter-start-date").value;
    const endDate = document.getElementById("filter-end-date").value;
    const filterType = document.getElementById("filter-type").value;
    const sortOption = document.getElementById("filter-sort").value;

    let filtered = [...allFees];

    // Lọc theo giá
    filtered = filtered.filter((fee) => {
      const price = fee.DonGia || 0;
      return price >= minPrice && price <= maxPrice;
    });

    // Lọc theo ngày bắt đầu
    if (startDate) {
      filtered = filtered.filter((fee) => {
        return !fee.ThoiGianBatDau || fee.ThoiGianBatDau >= startDate;
      });
    }

    // Lọc theo ngày kết thúc
    if (endDate) {
      filtered = filtered.filter((fee) => {
        return !fee.ThoiGianKetThuc || fee.ThoiGianKetThuc <= endDate;
      });
    }

    // Lọc theo loại khoản thu
    if (filterType) {
      filtered = filtered.filter((fee) => {
        return fee.LoaiKhoanThu === parseInt(filterType);
      });
    }

    // Sắp xếp
    switch (sortOption) {
      case "name-asc":
        filtered.sort((a, b) =>
          (a.TenKhoanThu || "").localeCompare(b.TenKhoanThu || "")
        );
        break;
      case "name-desc":
        filtered.sort((a, b) =>
          (b.TenKhoanThu || "").localeCompare(a.TenKhoanThu || "")
        );
        break;
      case "price-asc":
        filtered.sort((a, b) => (a.DonGia || 0) - (b.DonGia || 0));
        break;
      case "price-desc":
        filtered.sort((a, b) => (b.DonGia || 0) - (a.DonGia || 0));
        break;
      case "date-asc":
        filtered.sort((a, b) =>
          (a.ThoiGianBatDau || "").localeCompare(b.ThoiGianBatDau || "")
        );
        break;
      case "date-desc":
        filtered.sort((a, b) =>
          (b.ThoiGianBatDau || "").localeCompare(a.ThoiGianBatDau || "")
        );
        break;
    }

    renderFees(filtered);
    filterModal.classList.remove("show");
    showNotify(`Đã lọc được ${filtered.length} khoản thu`);
  });

  // Reset filter
  btnResetFilter.addEventListener("click", () => {
    document.getElementById("filter-min-price").value = "";
    document.getElementById("filter-max-price").value = "";
    document.getElementById("filter-start-date").value = "";
    document.getElementById("filter-end-date").value = "";
    document.getElementById("filter-type").value = "";
    document.getElementById("filter-sort").value = "name-asc";

    renderFees(allFees);
    filterModal.classList.remove("show");
    showNotify("Đã đặt lại bộ lọc");
  });

  /* ===============================
       MODALS
    =============================== */
  const detailModal = document.getElementById("fee-list-modal");
  const editModal = document.getElementById("editModal");
  const notifyModal = document.getElementById("notifyModal");
  const deleteModal = document.getElementById("deleteModal");

  const notifyText = document.getElementById("notify-text");
  const notifyOk = document.getElementById("notify-ok");
  const closeNotify = document.getElementById("close-notify");

  function showNotify(msg) {
    notifyText.innerText = msg;
    notifyModal.classList.add("show");
  }

  [notifyOk, closeNotify].forEach((btn) =>
    btn?.addEventListener("click", () => notifyModal.classList.remove("show"))
  );

  /* ===============================
       OPEN DETAIL
    =============================== */
  function openDetail(btn) {
    currentRow = btn.closest("tr");
    selectedId = btn.dataset.id;

    document.getElementById("modal-name").value = btn.dataset.name || "";

    // Convert type back to text for display
    const typeValue = btn.dataset.type === "1" ? "Định kỳ" : "Một lần";
    document.getElementById("modal-type").value = typeValue;
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
  document.querySelectorAll(".btn-detail").forEach((btn) => {
    btn.addEventListener("click", function () {
      openDetail(this);
    });
  });

  /* ===============================
       CLOSE DETAIL
    =============================== */
  ["close-modal", "btn-close-detail"].forEach((id) => {
    document.getElementById(id)?.addEventListener("click", () => {
      detailModal.classList.remove("show");
    });
  });

  detailModal.addEventListener("click", (e) => {
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

    // Clear error and enable button
    document.getElementById("error-edit-date-range").textContent = "";
    document.getElementById("btn-save-edit").disabled = false;
    document.getElementById("btn-save-edit").style.opacity = "1";
    document.getElementById("btn-save-edit").style.cursor = "pointer";

    editModal.classList.add("show");
  });

  // Real-time validation for edit form date range
  const editStartInput = document.getElementById("edit-start");
  const editEndInput = document.getElementById("edit-end");
  const saveEditBtn = document.getElementById("btn-save-edit");
  const errorEditDateRange = document.getElementById("error-edit-date-range");

  function validateEditDateRange() {
    const startDate = editStartInput.value;
    const endDate = editEndInput.value;

    if (startDate && endDate) {
      if (new Date(endDate) <= new Date(startDate)) {
        errorEditDateRange.textContent =
          "Ngày kết thúc phải lớn hơn ngày bắt đầu";
        saveEditBtn.disabled = true;
        saveEditBtn.style.opacity = "0.5";
        saveEditBtn.style.cursor = "not-allowed";
        return false;
      } else {
        errorEditDateRange.textContent = "";
        saveEditBtn.disabled = false;
        saveEditBtn.style.opacity = "1";
        saveEditBtn.style.cursor = "pointer";
        return true;
      }
    }
    return true;
  }

  editStartInput.addEventListener("change", validateEditDateRange);
  editEndInput.addEventListener("change", validateEditDateRange);

  /* ===============================
       SAVE EDIT
    =============================== */
  document.getElementById("btn-save-edit").addEventListener("click", () => {
    if (!selectedId) return;

    const editType = document.getElementById("edit-type").value;
    const loaiKhoanThu = editType === "Định kỳ" ? 1 : 2;

    const ngayBatDau = document.getElementById("edit-start").value;
    const ngayKetThuc = document.getElementById("edit-end").value;

    // Validate date range
    if (
      ngayBatDau &&
      ngayKetThuc &&
      new Date(ngayKetThuc) <= new Date(ngayBatDau)
    ) {
      document.getElementById("error-edit-date-range").textContent =
        "Ngày kết thúc phải lớn hơn ngày bắt đầu";
      return;
    }

    const payload = {
      TenKhoanThu: document.getElementById("edit-name").value,
      LoaiKhoanThu: loaiKhoanThu,
      ChiTiet: document.getElementById("edit-desc").value,
      DonGia: parseInt(document.getElementById("edit-budget").value) || 0,
      DonViTinh: document.getElementById("edit-unit").value,
      ThoiGianBatDau: ngayBatDau,
      ThoiGianKetThuc: ngayKetThuc,
    };

    console.log("Updating fee:", selectedId, payload); // debug

    fetch(`http://localhost:3000/api/khoan-thu/${selectedId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Update response:", data); // debug
        editModal.classList.remove("show");
        loadFees();
        showNotify("Cập nhật khoản thu thành công!");
      })
      .catch((err) => {
        console.error("Error updating:", err);
        showNotify("Có lỗi xảy ra khi cập nhật!");
      });
  });

  document.getElementById("close-edit").addEventListener("click", () => {
    editModal.classList.remove("show");
  });

  /* ===============================
       ADD FEE - DONE
    =============================== */
  document.querySelector(".btn-add").addEventListener("click", () => {
    document.querySelectorAll("#addModal input").forEach((i) => (i.value = ""));
    document
      .querySelectorAll("#addModal .error-message")
      .forEach((el) => (el.textContent = ""));
    document.getElementById("save-add").disabled = false;
    document.getElementById("addModal").classList.add("show");
  });

  // Real-time validation for add form date range
  const addStartInput = document.getElementById("add-start");
  const addEndInput = document.getElementById("add-end");
  const saveAddBtn = document.getElementById("save-add");
  const errorAddDateRange = document.getElementById("error-add-date-range");

  function validateAddDateRange() {
    const startDate = addStartInput.value;
    const endDate = addEndInput.value;

    if (startDate && endDate) {
      if (new Date(endDate) <= new Date(startDate)) {
        errorAddDateRange.textContent =
          "Ngày kết thúc phải lớn hơn ngày bắt đầu";
        saveAddBtn.disabled = true;
        saveAddBtn.style.opacity = "0.5";
        saveAddBtn.style.cursor = "not-allowed";
        return false;
      } else {
        errorAddDateRange.textContent = "";
        saveAddBtn.disabled = false;
        saveAddBtn.style.opacity = "1";
        saveAddBtn.style.cursor = "pointer";
        return true;
      }
    }
    return true;
  }

  addStartInput.addEventListener("change", validateAddDateRange);
  addEndInput.addEventListener("change", validateAddDateRange);

  ["close-add", "cancel-add"].forEach((id) => {
    document.getElementById(id).addEventListener("click", () => {
      document.getElementById("addModal").classList.remove("show");
    });
  });

  document.getElementById("save-add").addEventListener("click", () => {
    // Validate form
    const errors = {};

    const tenKhoanThu = document.getElementById("add-name").value.trim();
    const addType = document.getElementById("add-type").value;
    const donGia = document.getElementById("add-budget").value;
    const donViTinh = document.getElementById("add-unit").value;
    const ngayBatDau = document.getElementById("add-start").value;
    const ngayKetThuc = document.getElementById("add-end").value;

    // Clear previous errors
    document
      .querySelectorAll(".error-message")
      .forEach((el) => (el.textContent = ""));

    // Validate
    if (!tenKhoanThu) {
      errors.name = "Vui lòng nhập tên khoản thu";
      document.getElementById("error-add-name").textContent = errors.name;
    }

    if (!addType) {
      errors.type = "Vui lòng chọn loại khoản thu";
      document.getElementById("error-add-type").textContent = errors.type;
    }

    if (!donGia || donGia <= 0) {
      errors.budget = "Vui lòng nhập đơn giá hợp lệ";
      document.getElementById("error-add-budget").textContent = errors.budget;
    }

    if (!donViTinh) {
      errors.unit = "Vui lòng chọn đơn vị tính";
      document.getElementById("error-add-unit").textContent = errors.unit;
    }

    if (!ngayBatDau) {
      errors.start = "Vui lòng chọn ngày bắt đầu";
      document.getElementById("error-add-start").textContent = errors.start;
    }

    if (!ngayKetThuc) {
      errors.end = "Vui lòng chọn ngày kết thúc";
      document.getElementById("error-add-end").textContent = errors.end;
    }

    // Validate date range
    if (
      ngayBatDau &&
      ngayKetThuc &&
      new Date(ngayKetThuc) <= new Date(ngayBatDau)
    ) {
      errors.dateRange = "Ngày kết thúc phải lớn hơn ngày bắt đầu";
      document.getElementById("error-add-date-range").textContent =
        errors.dateRange;
    }

    // If there are errors, don't submit
    if (Object.keys(errors).length > 0) {
      return;
    }

    // "Định kỳ" → 1, "Một lần" → 2
    let loaiKhoanThu;
    if (addType === "Định kỳ" || addType === "dinh_ky" || addType === "1") {
      loaiKhoanThu = 1;
    } else if (
      addType === "Một lần" ||
      addType === "mot_lan" ||
      addType === "2"
    ) {
      loaiKhoanThu = 2;
    } else {
      loaiKhoanThu = parseInt(addType) || 1; // default là 1
    }

    const payload = {
      TenKhoanThu: tenKhoanThu,
      LoaiKhoanThu: loaiKhoanThu,
      ChiTiet: document.getElementById("add-desc").value,
      DonGia: parseInt(donGia) || 0,
      DonViTinh: donViTinh,
      ThoiGianBatDau: ngayBatDau,
      ThoiGianKetThuc: ngayKetThuc,
      GhiChu: document.getElementById("add-note")?.value || "",
    };

    console.log("Adding fee:", payload); // debug

    fetch("http://localhost:3000/api/khoan-thu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Add response:", data); // debug

        if (data.success) {
          document.getElementById("addModal").classList.remove("show");
          loadFees();
          showNotify("Thêm khoản thu thành công!");
        } else {
          showNotify("Lỗi: " + data.error);
        }
      })
      .catch((err) => {
        console.error("Error adding fee:", err);
        showNotify("Có lỗi xảy ra khi thêm khoản thu!");
      });
  });

  /* ===============================
       DELETE
    =============================== */
  const cannotDeleteModal = document.getElementById("cannotDeleteModal");

  ["cancel-delete", "close-delete"].forEach((id) =>
    document
      .getElementById(id)
      ?.addEventListener("click", () => deleteModal.classList.remove("show"))
  );

  ["ok-cannot-delete", "close-cannot-delete"].forEach((id) =>
    document
      .getElementById(id)
      ?.addEventListener("click", () =>
        cannotDeleteModal.classList.remove("show")
      )
  );

  document.getElementById("confirm-delete").addEventListener("click", () => {
    if (!selectedId) return;

    console.log("Deleting fee:", selectedId); // debug

    fetch(`http://localhost:3000/api/khoan-thu/${selectedId}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Delete response:", data); // debug
        deleteModal.classList.remove("show");

        if (data.success) {
          loadFees();
          showNotify("Xóa khoản thu thành công!");
        } else {
          // Nếu không thể xóa do có hộ đã đóng tiền
          if (data.info && data.info.soHoDaDongTien) {
            const infoEl = document.getElementById("cannot-delete-info");
            infoEl.innerText = `Khoản thu này đã có ${data.info.soHoDaDongTien} hộ thanh toán`;
            cannotDeleteModal.classList.add("show");
          } else {
            showNotify("Lỗi: " + data.error);
          }
        }
      })
      .catch((err) => {
        console.error("Error deleting:", err);
        showNotify("Có lỗi xảy ra khi xóa!");
      });
  });

  /* ===============================
       GÁN KHOẢN THU CHO HỘ KHẨU
    =============================== */
  const assignFeeModal = document.getElementById("assignFeeModal");
  const btnAssignFee = document.getElementById("btn-assign-fee");
  const closeAssign = document.getElementById("close-assign");
  const btnCancelAssign = document.getElementById("btn-cancel-assign");
  const btnSaveAssign = document.getElementById("btn-save-assign");
  const assignTbody = document.getElementById("assign-tbody");
  const checkboxAll = document.getElementById("checkbox-all");
  const selectedCount = document.getElementById("selected-count");

  let allApartments = [];
  let filteredApartments = [];
  let assignedApartments = new Set(); // Lưu các căn hộ đã được gán khoản thu này
  let changedApartments = new Map(); // Lưu các thay đổi: maHoKhau -> true/false (gán/bỏ gán)

  // Parse mã căn hộ để lấy tòa, tầng
  // Format: "Căn hộ A101" -> Tòa A, Tầng 1, Căn 01
  function parseApartmentCode(code) {
    const codeStr = String(code || "").trim();
    if (!codeStr || codeStr === "null" || codeStr === "undefined") {
      return { building: "", floor: 0 };
    }

    // Tìm pattern: chữ cái + 3-4 chữ số (VD: A201, B1501)
    const match = codeStr.match(/([A-Za-z])(\d{3,4})/);

    if (!match) {
      return { building: "", floor: 0 };
    }

    const building = match[1].toUpperCase();
    const numberPart = match[2];

    // Xử lý tầng:
    // A101 -> 101 -> tầng 1
    // A201 -> 201 -> tầng 2
    let floor = 0;
    if (numberPart.length === 3) {
      floor = parseInt(numberPart.charAt(0));
    } else if (numberPart.length === 4) {
      floor = parseInt(numberPart.substring(0, 2));
    }

    return { building, floor };
  }

  // Mở modal gán khoản thu
  btnAssignFee?.addEventListener("click", async () => {
    if (!selectedId) {
      showNotify("Chưa chọn khoản thu!");
      return;
    }

    detailModal.classList.remove("show");
    assignFeeModal.classList.add("show");

    // Reset
    changedApartments.clear();
    assignedApartments.clear();

    // Load danh sách căn hộ và hộ khẩu
    await loadApartmentsForAssign();

    // Load các hộ khẩu đã được gán khoản thu này
    await loadAssignedHouseholds();

    // Render table (không cần populate floor dropdown nữa)
    filterAndRenderAssignTable();
  });

  // Load danh sách căn hộ
  async function loadApartmentsForAssign() {
    try {
      const res = await fetch("http://localhost:3000/api/can-ho");
      const response = await res.json();
      const apartments = Array.isArray(response)
        ? response
        : response.data || [];

      // Load thêm thông tin chủ hộ cho mỗi căn hộ
      allApartments = [];
      for (const apt of apartments) {
        let chuHo = "Chưa có chủ hộ";

        try {
          const ownerRes = await fetch(
            `http://localhost:3000/api/can-ho/tim-chu-ho/${apt.MaCanHo}`
          );
          const ownerData = await ownerRes.json();

          if (ownerData.chuHo && ownerData.chuHo.HoTen) {
            chuHo = ownerData.chuHo.HoTen;
          }
        } catch (err) {
          console.error(`Lỗi khi tìm chủ hộ cho ${apt.MaCanHo}:`, err);
        }

        const parsed = parseApartmentCode(apt.TenCanHo); // Parse từ TenCanHo
        allApartments.push({
          ...apt,
          chuHo,
          building: parsed.building,
          floor: parsed.floor,
        });

        // Debug: log parsed values
        console.log(
          `Căn hộ ${apt.MaCanHo} - Tên: ${apt.TenCanHo} -> Tòa=${parsed.building}, Tầng=${parsed.floor}`
        );
      }

      filteredApartments = [...allApartments];
      console.log(`Loaded ${allApartments.length} apartments`);
    } catch (err) {
      console.error("Error loading apartments:", err);
      showNotify("Không thể tải danh sách căn hộ!");
    }
  }

  // Load các hộ khẩu đã được gán khoản thu
  async function loadAssignedHouseholds() {
    try {
      // Giả sử có API endpoint để lấy danh sách hộ khẩu đã gán khoản thu
      // Nếu không có, bạn cần tạo endpoint mới trong backend
      // Tạm thời comment lại, sẽ implement khi có API

      // const res = await fetch(`http://localhost:3000/api/khoan-thu/${selectedId}/ho-khau`);
      // const data = await res.json();
      // if (data.success && data.data) {
      //   data.data.forEach(item => {
      //     assignedApartments.add(item.MaHoKhau);
      //   });
      // }

      // Tạm thời load từ bảng khoan_thu_ho_khau
      for (const apt of allApartments) {
        if (apt.MaHoKhau) {
          try {
            const res = await fetch(
              `http://localhost:3000/api/khoan-thu-ho-khau/${apt.MaHoKhau}`
            );
            const data = await res.json();

            if (data.success && data.data) {
              const hasThisFee = data.data.some(
                (fee) => fee.MaKhoanThu === selectedId
              );
              if (hasThisFee) {
                assignedApartments.add(apt.MaHoKhau);
              }
            }
          } catch (err) {
            console.error(`Lỗi khi kiểm tra gán cho ${apt.MaHoKhau}:`, err);
          }
        }
      }
    } catch (err) {
      console.error("Error loading assigned households:", err);
    }
  }

  // Không cần populate floor dropdown nữa vì dùng input number

  // Filter và render bảng
  function filterAndRenderAssignTable() {
    const buildingEl = document.getElementById("assign-filter-building");
    const floorEl = document.getElementById("assign-filter-floor");
    const apartmentEl = document.getElementById("assign-filter-apartment");

    // Null check
    if (!buildingEl || !floorEl || !apartmentEl) {
      console.error("Cannot find filter elements");
      return;
    }

    const buildingFilter = buildingEl.value.trim().toUpperCase();
    const floorFilterInput = floorEl.value.trim();
    const floorFilter = floorFilterInput ? parseInt(floorFilterInput) : null;
    const apartmentFilter = apartmentEl.value.toLowerCase().trim();

    console.log(
      `Filter - Tòa: "${buildingFilter}", Tầng: ${floorFilter}, Tìm kiếm: "${apartmentFilter}"`
    );

    filteredApartments = allApartments.filter((apt) => {
      let match = true;

      // Lọc theo tòa (so sánh uppercase)
      if (buildingFilter && apt.building.toUpperCase() !== buildingFilter) {
        match = false;
      }

      // Lọc theo tầng (so sánh số)
      if (floorFilter !== null && apt.floor !== floorFilter) {
        match = false;
      }

      // Lọc theo mã/tên căn hộ
      if (apartmentFilter) {
        const code = String(apt.MaCanHo || "").toLowerCase();
        const name = String(apt.TenCanHo || "").toLowerCase();
        if (
          !code.includes(apartmentFilter) &&
          !name.includes(apartmentFilter)
        ) {
          match = false;
        }
      }

      return match;
    });

    console.log(`Filtered: ${filteredApartments.length} apartments`);
    renderAssignTable();
  }

  // Render bảng gán khoản thu
  function renderAssignTable() {
    assignTbody.innerHTML = "";

    if (!filteredApartments || filteredApartments.length === 0) {
      assignTbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; padding: 30px; color: #999;">
            Không có căn hộ nào
          </td>
        </tr>
      `;
      updateSelectedCount();
      return;
    }

    filteredApartments.forEach((apt) => {
      const tr = document.createElement("tr");
      const maHoKhau = apt.MaHoKhau || "";

      // Kiểm tra trạng thái: đã gán ban đầu + thay đổi mới
      let isAssigned = assignedApartments.has(maHoKhau);
      if (changedApartments.has(maHoKhau)) {
        isAssigned = changedApartments.get(maHoKhau);
      }

      const statusText = maHoKhau
        ? isAssigned
          ? "Đã gán"
          : "Chưa gán"
        : "Chưa có hộ khẩu";
      const statusClass = maHoKhau
        ? isAssigned
          ? "status-assigned"
          : "status-not-assigned"
        : "status-not-assigned";

      tr.innerHTML = `
        <td>
          <input type="checkbox" 
            class="apt-checkbox" 
            data-ma-ho-khau="${maHoKhau}"
            ${!maHoKhau ? "disabled" : ""}
            ${isAssigned ? "checked" : ""}>
        </td>
        <td>${apt.MaCanHo}</td>
        <td>${apt.TenCanHo}</td>
        <td>${apt.building}</td>
        <td>${apt.floor}</td>
        <td>${maHoKhau || "—"}</td>
        <td>${apt.chuHo}</td>
        <td><span class="${statusClass}">${statusText}</span></td>
      `;

      assignTbody.appendChild(tr);
    });

    // Attach checkbox events
    attachCheckboxEvents();
    updateSelectedCount();
  }

  // Attach checkbox events
  function attachCheckboxEvents() {
    document.querySelectorAll(".apt-checkbox").forEach((checkbox) => {
      checkbox.addEventListener("change", (e) => {
        const maHoKhau = e.target.dataset.maHoKhau;
        const isChecked = e.target.checked;

        // Lưu thay đổi
        const originallyAssigned = assignedApartments.has(maHoKhau);
        if (isChecked !== originallyAssigned) {
          changedApartments.set(maHoKhau, isChecked);
        } else {
          changedApartments.delete(maHoKhau);
        }

        updateSelectedCount();
        renderAssignTable(); // Re-render để cập nhật trạng thái
      });
    });
  }

  // Update selected count
  function updateSelectedCount() {
    const checkedBoxes = document.querySelectorAll(
      ".apt-checkbox:checked:not(:disabled)"
    );
    selectedCount.textContent = checkedBoxes.length;
  }

  // Checkbox all
  checkboxAll?.addEventListener("change", (e) => {
    const isChecked = e.target.checked;

    filteredApartments.forEach((apt) => {
      if (apt.MaHoKhau) {
        const originallyAssigned = assignedApartments.has(apt.MaHoKhau);
        if (isChecked !== originallyAssigned) {
          changedApartments.set(apt.MaHoKhau, isChecked);
        } else {
          changedApartments.delete(apt.MaHoKhau);
        }
      }
    });

    renderAssignTable();
  });

  // Filter events
  document
    .getElementById("assign-filter-building")
    ?.addEventListener("change", filterAndRenderAssignTable);

  document
    .getElementById("assign-filter-floor")
    ?.addEventListener("change", filterAndRenderAssignTable);

  document
    .getElementById("assign-filter-apartment")
    ?.addEventListener("input", filterAndRenderAssignTable);

  // Chọn tất cả
  document.getElementById("btn-select-all")?.addEventListener("click", () => {
    filteredApartments.forEach((apt) => {
      if (apt.MaHoKhau) {
        changedApartments.set(apt.MaHoKhau, true);
      }
    });
    renderAssignTable();
  });

  // Bỏ chọn tất cả
  document.getElementById("btn-deselect-all")?.addEventListener("click", () => {
    filteredApartments.forEach((apt) => {
      if (apt.MaHoKhau) {
        changedApartments.set(apt.MaHoKhau, false);
      }
    });
    renderAssignTable();
  });

  // Đóng modal
  [closeAssign, btnCancelAssign].forEach((btn) => {
    btn?.addEventListener("click", () => {
      assignFeeModal.classList.remove("show");
    });
  });

  assignFeeModal?.addEventListener("click", (e) => {
    if (e.target === assignFeeModal) {
      assignFeeModal.classList.remove("show");
    }
  });

  // Lưu thay đổi
  btnSaveAssign?.addEventListener("click", async () => {
    if (changedApartments.size === 0) {
      showNotify("Không có thay đổi nào!");
      return;
    }

    try {
      // Gửi từng request để gán/bỏ gán
      const promises = [];

      for (const [maHoKhau, shouldAssign] of changedApartments.entries()) {
        if (shouldAssign) {
          // Gán khoản thu cho hộ
          promises.push(
            fetch("http://localhost:3000/api/khoan-thu-ho-khau", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                MaHoKhau: maHoKhau,
                MaKhoanThu: selectedId,
              }),
            })
          );
        } else {
          // Bỏ gán khoản thu (xóa)
          promises.push(
            fetch(
              `http://localhost:3000/api/khoan-thu-ho-khau/${maHoKhau}/${selectedId}`,
              {
                method: "DELETE",
              }
            )
          );
        }
      }

      await Promise.all(promises);

      assignFeeModal.classList.remove("show");
      showNotify(`Đã cập nhật gán khoản thu cho ${changedApartments.size} hộ!`);

      // Reset
      changedApartments.clear();
    } catch (err) {
      console.error("Error saving assignments:", err);
      showNotify("Có lỗi xảy ra khi lưu thay đổi!");
    }
  });
});
