document.addEventListener("DOMContentLoaded", async () => {

    let currentRow = null;
    let currentCanHoID = null

    /* ===============================
       MODAL
    =============================== */
    const detailModal = document.getElementById("apartment-modal");
    const editModal = document.getElementById("editModal");
    const addModal = document.getElementById("addModal");
    const tbody = document.querySelector(".apartment-table tbody");

    /* ===============================
       MODAL THÔNG BÁO
    =============================== */
    const notifyModal = document.getElementById("notifyModal");
    const notifyText = document.getElementById("notify-text");
    const notifyOk = document.getElementById("notify-ok");
    const closeNotify = document.getElementById("close-notify");

    function showNotify(msg) {
        notifyText.innerText = msg
        notifyModal.classList.add("show")
    }

    [notifyOk, closeNotify].forEach(btn => {
        btn?.addEventListener("click", () => {
            notifyModal.classList.remove("show")
        })
    })

    const statusLabel = {
        'trong': "Trống",
        'chu_o': "Chủ ở",
        'cho_thue': "Cho thuê",
    }

    /* ===============================
       LOAD TABLE
    =============================== */

    async function loadCanHo() {
        try {
            const res = await fetch("http://localhost:3000/api/can-ho")
            const data = await res.json()

            if (!res.ok) {
                showNotify(data.message || "Không tải được danh sách căn hộ!");
                return;
            }

            tbody.innerHTML = ""
            data.forEach(canho => tbody.appendChild(renderRow(canho)))
        } catch (err) {
            showNotify("Lỗi kết nối server!")
        }
    }

    /* ===============================
       INIT
    =============================== */
    await loadCanHo();

    /* ===============================
       RENDER ROW
    =============================== */

    function renderRow(canho) {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${canho.MaCanHo}</td>
            <td>${canho.TenCanHo}</td>
            <td>${canho.Tang}</td>
            <td>${canho.DienTich}</td>
            <td>${statusLabel[canho.TrangThai] || ""}</td>
            <td class="action">
                <span class="btn-detail" data-id="${canho.MaCanHo}"></span>
            </td>
        `
        tr.querySelector(".btn-detail").addEventListener("click", () => {
            currentRow = tr;
            openDetail(canho.MaCanHo);
        })
        return tr;
    }

    /* ===============================
       OPEN DETAIL
    =============================== */
    async function openDetail(id) {
        currentCanHoID = id
        try {
            const res = await fetch(`http://localhost:3000/api/can-ho/${id}`)
            const canho = await res.json()

            if (!res.ok) {
                detailModal.classList.remove("show")
                showNotify(data.message || "Không tải được chi tiết căn hộ!")
                return
            }

            document.getElementById("modal-name").value = canho.TenCanHo || "";
            document.getElementById("modal-floor").value = canho.Tang || "";
            document.getElementById("modal-area").value = canho.DienTich || "";
            document.getElementById("modal-desc").value = canho.MoTa || "";
            // document.getElementById("modal-start").value = canho.NgayBatDau || "";
            // document.getElementById("modal-end").value = canho.NgayKetThuc || "";

            try {
                const ownerRes = await fetch(`http://localhost:3000/api/can-ho/tim-chu-ho/${id}`)
                const owner = await ownerRes.json()
                document.getElementById("modal-owner").value = owner?.chuHo?.HoTen || ""
            } catch (err) {
                document.getElementById("modal-owner").value = ""
            }
            detailModal.classList.add("show");
        } catch (err) {
            showNotify("Lỗi kết nối server!")
        }
    }

    /* ===============================
       CLOSE DETAIL
    =============================== */
    ["close-modal", "btn-close-detail"].forEach(id => {
        document.getElementById(id)?.addEventListener("click", () => {
            detailModal.classList.remove("show");
        });
    });

    detailModal.addEventListener("click", e => {
        if (e.target === detailModal) {
            detailModal.classList.remove("show");
        }
    });

    /* ===============================
       DETAIL → EDIT
    =============================== */
    document.getElementById("btn-open-edit").addEventListener("click", () => {
        detailModal.classList.remove("show");

        document.getElementById("edit-name").value = document.getElementById("modal-name").value;
        document.getElementById("edit-floor").value = document.getElementById("modal-floor").value;
        document.getElementById("edit-area").value = document.getElementById("modal-area").value;
        document.getElementById("edit-desc").value = document.getElementById("modal-desc").value;
        document.getElementById("edit-owner").value = document.getElementById("modal-owner").value;
        // document.getElementById("edit-start").value = document.getElementById("modal-start").value;
        // document.getElementById("edit-end").value = document.getElementById("modal-end").value;

        editModal.classList.add("show");
    });

    /* ===============================
       SAVE EDIT (CHỈ 1 LẦN)
    =============================== */
    document.getElementById("btn-save-edit").addEventListener("click", async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/can-ho/${currentCanHoID}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    TenCanHo: document.getElementById("edit-name").value,
                    Tang: document.getElementById("edit-floor").value,
                    DienTich: document.getElementById("edit-area").value,
                    MoTa: document.getElementById("edit-desc").value
                })
            })

            const data = await res.json()
            if (!res.ok) {
                editModal.classList.remove("show")
                showNotify(data.message || "Cập nhật căn hộ thất bại!")
                return
            }

            editModal.classList.remove("show")
            showNotify("Lưu chỉnh sửa căn hộ thành công!")
            await loadCanHo()
        } catch (err) {
            showNotify("Lỗi kết nối server!")
        }
    });

    document.getElementById("close-edit").addEventListener("click", () => {
        editModal.classList.remove("show");
    });

    /* ===============================
       ADD APARTMENT
    =============================== */
    document.querySelector(".btn-add").addEventListener("click", () => {
        document.querySelectorAll("#addModal input").forEach(i => i.value = "");
        document.getElementById("addModal").classList.add("show");
    });

    ["close-add", "cancel-add"].forEach(id => {
        document.getElementById(id).addEventListener("click", () => {
            document.getElementById("addModal").classList.remove("show");
        });
    });

    document.getElementById("save-add").addEventListener("click", async () => {
        try {
            const res = await fetch("http://localhost:3000/api/can-ho", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    TenCanHo: document.getElementById("add-name").value,
                    Tang: document.getElementById("add-floor").value,
                    DienTich: document.getElementById("add-area").value,
                    MoTa: document.getElementById("add-desc").value
                })
            })

            const data = await res.json()
            if (!res.ok) {
                addModal.classList.remove("show")
                showNotify("Thêm căn hộ thất bại!")
                return
            }

            addModal.classList.remove("show")
            showNotify("Thêm căn hộ thành công!")
            await loadCanHo()
        } catch (err) {
            showNotify("Lỗi kết nối server!")
        }
    });

    /* ===============================
       SEARCH
    =============================== */

    const searchInput = document.getElementById("search-input")

    searchInput.addEventListener("input", () => {
        const keyword = searchInput.value.toLowerCase()
        const result = document.querySelectorAll(".apartment-table tbody tr")

        result.forEach(row => {
            const text = row.innerText.toLowerCase()
            row.style.display = text.includes(keyword) ? "" : "none"
        })
    })
});

