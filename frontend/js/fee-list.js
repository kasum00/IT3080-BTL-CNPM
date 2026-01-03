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

    fees.forEach((fee) => {
      const tr = document.createElement("tr");
      const loaiKhoanThu = fee.LoaiKhoanThu === 1 ? "Định kỳ" : "Một lần";

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

    editModal.classList.add("show");
  });

  /* ===============================
       SAVE EDIT
    =============================== */
  document.getElementById("btn-save-edit").addEventListener("click", () => {
    if (!selectedId) return;

    const editType = document.getElementById("edit-type").value;
    const loaiKhoanThu = editType === "Định kỳ" ? 1 : 2;

    const payload = {
      TenKhoanThu: document.getElementById("edit-name").value,
      LoaiKhoanThu: loaiKhoanThu,
      ChiTiet: document.getElementById("edit-desc").value,
      DonGia: parseInt(document.getElementById("edit-budget").value) || 0,
      DonViTinh: document.getElementById("edit-unit").value,
      ThoiGianBatDau: document.getElementById("edit-start").value,
      ThoiGianKetThuc: document.getElementById("edit-end").value,
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
    document.getElementById("addModal").classList.add("show");
  });

  ["close-add", "cancel-add"].forEach((id) => {
    document.getElementById(id).addEventListener("click", () => {
      document.getElementById("addModal").classList.remove("show");
    });
  });

  document.getElementById("save-add").addEventListener("click", () => {
    const addType = document.getElementById("add-type").value;

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
      TenKhoanThu: document.getElementById("add-name").value,
      LoaiKhoanThu: loaiKhoanThu,
      ChiTiet: document.getElementById("add-desc").value,
      DonGia: parseInt(document.getElementById("add-budget").value) || 0,
      DonViTinh: document.getElementById("add-unit").value,
      ThoiGianBatDau: document.getElementById("add-start").value,
      ThoiGianKetThuc: document.getElementById("add-end").value,
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
  ["cancel-delete", "close-delete"].forEach((id) =>
    document
      .getElementById(id)
      ?.addEventListener("click", () => deleteModal.classList.remove("show"))
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
        loadFees();
        showNotify("Xóa khoản thu thành công!");
      })
      .catch((err) => {
        console.error("Error deleting:", err);
        showNotify("Có lỗi xảy ra khi xóa!");
      });
  });
});
