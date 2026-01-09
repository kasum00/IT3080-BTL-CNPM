document.addEventListener("DOMContentLoaded", async () => {
    let currentRow = null
    let currentVehicleID = null

    /* ===============================
       ELEMENTS
    =============================== */
    const tbody = document.querySelector(".apartment-table tbody")
    const detailModal = document.getElementById("vehicle-modal")
    const addModal = document.getElementById("addVehicleModal")
    const deleteModal = document.getElementById("deleteModal")

    const searchInput = document.getElementById("search-input")
    const btnAddVehicle = document.getElementById("btn-add-vehicle")

    /* ===============================
      NOTIFY
   =============================== */
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

    async function loadHoKhauSelect() {
        try {
            const res = await fetch("http://localhost:3000/api/ho-khau")
            const data = await res.json()

            if (!res.ok) {
                showNotify("Không tải được danh sách hộ khẩu!")
                return
            }

            const select = document.getElementById("add-hokhau")
            select.innerHTML = `<option value="">Chọn hộ khẩu</option>`

            data.forEach(hk => {
                const opt = document.createElement("option")
                opt.value = hk.MaHoKhau
                opt.textContent = `${hk.MaHoKhau}`
                select.appendChild(opt)
            })
        } catch (err) {
            showNotify("Lỗi kết nối server!")
        }
    }


    /* ===============================
       LOAD TABLE
    =============================== */
    async function loadVehicles() {
        try {
            const res = await fetch("http://localhost:3000/api/phuong-tien")
            const data = await res.json()

            if (!res.ok) {
                showNotify(data.message || "Không tải được danh sách phương tiện!")
                return
            }

            tbody.innerHTML = ""
            data.forEach(v => tbody.appendChild(renderRow(v)))
        } catch (err) {
            showNotify("Lỗi kết nối server!")
        }
    }

    await loadVehicles()

    /* ===============================
       RENDER TABLE
    =============================== */
    function renderRow(v) {
        const tr = document.createElement("tr")
        tr.innerHTML = `
            <td>${v.MaHoKhau}</td>
            <td>${v.TenPhuongTien}</td>
            <td>${v.BienSo || ""}</td>
            <td>${v.ChuSoHuu || ""}</td>
            <td class="action">
                <span class="btn-detail"></span>
                <span class="btn-remove" title="Xóa"></span>
            </td>
        `

        /* XEM CHI TIẾT */
        tr.querySelector(".btn-detail").addEventListener("click", () => {
            currentRow = tr
            currentVehicleID = v.MaPhuongTien
            openDetail(v.MaPhuongTien)
        })

        /* XÓA PHƯƠNG TIỆN */
        tr.querySelector(".btn-remove").addEventListener("click", () => {
            currentVehicleID = v.MaPhuongTien
            deleteModal.classList.add("show")
        })

        return tr
    }

    ["cancel-delete", "close-delete"].forEach(id =>
        document.getElementById(id)?.addEventListener("click", () =>
            deleteModal.classList.remove("show")
        )
    )

    document.getElementById("confirm-delete").addEventListener("click", async () => {
        try {
            const res = await fetch(
                `http://localhost:3000/api/phuong-tien/${currentVehicleID}`,
                { method: "DELETE" }
            )

            const data = await res.json()

            if (!res.ok) {
                deleteModal.classList.remove("show")
                showNotify(data.message || "Xóa phương tiện thất bại!")
                return
            }

            deleteModal.classList.remove("show")
            showNotify("Xóa phương tiện thành công!")
            await loadVehicles()
        } catch (err) {
            deleteModal.classList.remove("show")
            showNotify("Lỗi kết nối server!")
        }
    })


    /* ===============================
       OPEN DETAIL MODAL
    =============================== */
    async function openDetail(id) {
        try {
            const res = await fetch(`http://localhost:3000/api/phuong-tien/${id}`)
            const v = await res.json()

            if (!res.ok) {
                showNotify(v.message || "Không tải được chi tiết phương tiện!")
                return
            }

            document.getElementById("modal-hokhau").value = v.MaHoKhau
            document.getElementById("modal-name").value = v.TenPhuongTien
            document.getElementById("modal-bien").value = v.BienSo || ""
            document.getElementById("modal-owner").value = v.ChuSoHuu || ""

            detailModal.classList.add("show")
        } catch (err) {
            showNotify("Lỗi kết nối server!")
        }
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
    btnAddVehicle.addEventListener("click", async () => {
        document.querySelectorAll("#addVehicleModal input").forEach(i => i.value = "")
        document.getElementById("add-loai").value = ""
        await loadHoKhauSelect()
        addModal.classList.add("show")
    })

        ;["close-add-vehicle", "cancel-add-vehicle"].forEach(id => {
            document.getElementById(id).addEventListener("click", () => {
                addModal.classList.remove("show")
            })
        })

    document.getElementById("save-add-vehicle").addEventListener("click", async () => {
        try {
            const payload = {
                MaHoKhau: document.getElementById("add-hokhau").value.trim(),
                MaLoaiPT: Number(document.getElementById("add-loai").value),
                BienSo: document.getElementById("add-bien").value.trim() || null,
                ChuSoHuu: document.getElementById("add-owner").value.trim()
            }

            const res = await fetch("http://localhost:3000/api/phuong-tien", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })

            const data = await res.json()

            if (!res.ok) {
                showNotify(data.message || "Thêm phương tiện thất bại!")
                return
            }

            addModal.classList.remove("show")
            showNotify("Thêm phương tiện thành công!")
            await loadVehicles()
        } catch (err) {
            showNotify("Lỗi kết nối server!")
        }
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
