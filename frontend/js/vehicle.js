document.addEventListener("DOMContentLoaded", () => {

    /* ===============================
       DATA MOCK (DỮ LIỆU GIẢ)
    =============================== */
    let vehicles = [
        {
            MaHoKhau: "HK001",
            TenPhuongTien: "Xe máy",
            BienSo: "59A1-12345",
            MaLoaiPT: 2,
            ChuSoHuu: "Nguyễn Văn An"
        },
        {
            MaHoKhau: "HK002",
            TenPhuongTien: "Ô tô",
            BienSo: "51A-99999",
            MaLoaiPT: 3,
            ChuSoHuu: "Phạm Đức Thắng"
        }
    ]

    /* ===============================
       ELEMENTS
    =============================== */
    const tbody = document.querySelector(".apartment-table tbody")
    const detailModal = document.getElementById("vehicle-modal")
    const addModal = document.getElementById("addVehicleModal")

    const searchInput = document.getElementById("search-input")
    const btnAddVehicle = document.getElementById("btn-add-vehicle")

    /* ===============================
       RENDER TABLE
    =============================== */
    function renderTable() {
        tbody.innerHTML = ""
        vehicles.forEach(v => {
            tbody.appendChild(renderRow(v))
        })
    }

    function renderRow(v) {
        const tr = document.createElement("tr")
        tr.innerHTML = `
            <td>${v.MaHoKhau}</td>
            <td>${v.TenPhuongTien}</td>
            <td>${v.BienSo || ""}</td>
            <td>${v.MaLoaiPT}</td>
            <td>${v.ChuSoHuu}</td>
            <td class="action">
                <span class="btn-detail"></span>
                <span class="btn-remove" title="Xóa"></span>
            </td>
        `

        /* XEM CHI TIẾT */
        tr.querySelector(".btn-detail").addEventListener("click", () => {
            openDetail(v)
        })

        /* XÓA PHƯƠNG TIỆN */
        tr.querySelector(".btn-remove").addEventListener("click", () => {
            if (!confirm("Bạn có chắc chắn muốn xóa phương tiện này?")) return
            vehicles = vehicles.filter(item => item !== v)
            tr.remove()
        })

        return tr
    }

    renderTable()

    /* ===============================
       OPEN DETAIL MODAL
    =============================== */
    function openDetail(v) {
        document.getElementById("modal-hokhau").value = v.MaHoKhau
        document.getElementById("modal-name").value = v.TenPhuongTien
        document.getElementById("modal-bien").value = v.BienSo || ""
        document.getElementById("modal-loai").value = v.MaLoaiPT
        document.getElementById("modal-owner").value = v.ChuSoHuu

        detailModal.classList.add("show")
    }

    /* ===============================
       CLOSE DETAIL MODAL
    =============================== */
    ;["close-vehicle-modal", "close-vehicle-detail"].forEach(id => {
        document.getElementById(id).addEventListener("click", () => {
            detailModal.classList.remove("show")
        })
    })

    detailModal.addEventListener("click", e => {
        if (e.target === detailModal) {
            detailModal.classList.remove("show")
        }
    })

    /* ===============================
       ADD VEHICLE
    =============================== */
    btnAddVehicle.addEventListener("click", () => {
        document.querySelectorAll("#addVehicleModal input").forEach(i => i.value = "")
        addModal.classList.add("show")
    })

    ;["close-add-vehicle", "cancel-add-vehicle"].forEach(id => {
        document.getElementById(id).addEventListener("click", () => {
            addModal.classList.remove("show")
        })
    })

    document.getElementById("save-add-vehicle").addEventListener("click", () => {
        const newVehicle = {
            MaHoKhau: document.getElementById("add-hokhau").value,
            TenPhuongTien: document.getElementById("add-name").value,
            BienSo: document.getElementById("add-bien").value || "",
            MaLoaiPT: document.getElementById("add-loai").value,
            ChuSoHuu: document.getElementById("add-owner").value
        }

        vehicles.push(newVehicle)
        tbody.appendChild(renderRow(newVehicle))

        addModal.classList.remove("show")
        alert("Thêm phương tiện thành công!")
    })

    /* ===============================
       SEARCH
    =============================== */
    searchInput.addEventListener("input", () => {
        const keyword = searchInput.value.toLowerCase()
        document.querySelectorAll(".apartment-table tbody tr").forEach(row => {
            row.style.display = row.innerText.toLowerCase().includes(keyword)
                ? ""
                : "none"
        })
    })
})
