document.addEventListener("DOMContentLoaded", async () => {

    let currentRow = null;
    let currentHoKhauID = null;

    /* ===============================
       MODALS
    =============================== */
    const detailModal = document.getElementById("household-modal");
    const editModal = document.getElementById("editModal");
    const addModal = document.getElementById("addModal");
    const deleteModal = document.getElementById("deleteModal");
    const notifyModal = document.getElementById("notifyModal");
    const tbody = document.querySelector(".household-table tbody")

    /* ===============================
       NOTIFY
    =============================== */
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

    /* ===============================
       RENDER ROW
    =============================== */
    function renderRow(hokhau) {
        const tr = document.createElement("tr")

        tr.innerHTML = `
            <td>${hokhau.MaHoKhau}</td>
            <td>${hokhau.MaCanHo || "Chưa gán"}</td>
            <td>${hokhau.ChuHo ?? "Chưa có"}</td>
            <td>${hokhau.DiaChiThuongTru || ""}</td>
            <td>${hokhau.NgayCap || ""}</td>
            <td class="action">
                <span class="btn-detail"></span>
                <span class="btn-remove"></span>
            </td>
        `
        tr.querySelector(".btn-detail").addEventListener("click", () => {
            currentRow = tr
            openDetail(hokhau.MaHoKhau)
        })

        tr.querySelector(".btn-remove").addEventListener("click", () => {
            currentRow = tr
            currentHoKhauID = hokhau.MaHoKhau
            deleteModal.classList.add("show")
        });

        return tr
    }

    /* ===============================
       CALL API GET ALL
    =============================== */
    await fetch("http://localhost:3000/api/ho-khau")
        .then(res => res.json())
        .then(data => {
            tbody.innerHTML = "";
            data.forEach(hokhau => tbody.appendChild(renderRow(hokhau)));
        });

    /* ===============================
       OPEN DETAIL
    =============================== */
    async function openDetail(maHoKhau) {
        currentHoKhauID = maHoKhau

        await fetch(`http://localhost:3000/api/ho-khau/${maHoKhau}`)
            .then(res => res.json())
            .then(hokhau => {
                document.getElementById("modal-ma").value = hokhau.MaHoKhau
                document.getElementById("modal-canHo").value = hokhau.MaCanHo || ""
                document.getElementById("modal-chuHo").value = hokhau.ChuHo || "";
                document.getElementById("modal-diaChi").value = hokhau.DiaChiThuongTru || "";
                document.getElementById("modal-noiCap").value = hokhau.NoiCap || "";
                document.getElementById("modal-ngayCap").value = hokhau.NgayCap || "";

                detailModal.classList.add("show");
            })

    }

    /* ===============================
       CLOSE DETAIL
    =============================== */
    ["close-modal", "btn-close-detail"].forEach(id => {
        document.getElementById(id)?.addEventListener("click", () => {
            detailModal.classList.remove("show");
        });
    });

    /* ===============================
       DETAIL → EDIT
    =============================== */
    document.getElementById("btn-open-edit").addEventListener("click", () => {
        detailModal.classList.remove("show");

        document.getElementById("edit-ma").value =
            document.getElementById("modal-ma").value;
        document.getElementById("edit-canHo").value =
            document.getElementById("modal-canHo").value;
        document.getElementById("edit-chuHo").value =
            document.getElementById("modal-chuHo").value;
        document.getElementById("edit-diaChi").value =
            document.getElementById("modal-diaChi").value;
        document.getElementById("edit-noiCap").value =
            document.getElementById("modal-noiCap").value;
        document.getElementById("edit-ngayCap").value =
            document.getElementById("modal-ngayCap").value;

        editModal.classList.add("show");
    });

    /* ===============================
       SAVE EDIT (1 LẦN DUY NHẤT)
    =============================== */
    document.getElementById("btn-save-edit").addEventListener("click", async () => {

        if (!currentRow) return;
        await fetch(`http://localhost:3000/api/ho-khau/${currentHoKhauID}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                DiaChiThuongTru: document.getElementById("edit-diaChi").value,
                NoiCap: document.getElementById("edit-noiCap").value,
                NgayCap: document.getElementById("edit-ngayCap").value
            })
        })
            .then(res => res.json())
            .then(updated => {
                const newRow = renderRow(updated);
                currentRow.replaceWith(newRow);
                currentRow = newRow;
                editModal.classList.remove("show");
                showNotify("Cập nhật hộ khẩu thành công!");
            });
    });

    document.getElementById("close-edit").addEventListener("click", () => {
        editModal.classList.remove("show");
    });

    /* ===============================
       ADD HOUSEHOLD
    =============================== */
    document.querySelector(".btn-add").addEventListener("click", () => {
        document.querySelectorAll("#addModal input").forEach(i => i.value = "");
        addModal.classList.add("show");
    });

    ["close-add", "cancel-add"].forEach(id => {
        document.getElementById(id)?.addEventListener("click", () => {
            addModal.classList.remove("show");
        });
    });

    document.getElementById("save-add").addEventListener("click", async () => {
        const maCanHo = document.getElementById("add-canHo").value
        const ngayCap = document.getElementById("add-ngayCap").value

        await fetch("http://localhost:3000/api/ho-khau", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                MaHoKhau: document.getElementById("add-ma").value,
                MaCanHo: maCanHo ? Number(maCanHo) : null,
                DiaChiThuongTru: document.getElementById("add-diaChi").value,
                NoiCap: document.getElementById("add-noiCap").value,
                NgayCap: ngayCap ? ngayCap : null
            })
        })
            .then(async res => {
                const data = await res.json()
                if (!res.ok) {
                    addModal.classList.remove("show")
                    showNotify(data.message || "Thêm hộ khẩu thất bại!")
                    return;
                }
                tbody.appendChild(renderRow(data))
                addModal.classList.remove("show")
                showNotify("Thêm hộ khẩu thành công!")
            })
    });

    ["cancel-delete", "close-delete"].forEach(id =>
        document.getElementById(id)?.addEventListener("click", () =>
            deleteModal.classList.remove("show")
        )
    );

    document.getElementById("confirm-delete").addEventListener("click", async () => {
        await fetch(`http://localhost:3000/api/ho-khau/${currentHoKhauID}`, {
            method: "DELETE"
        })
            .then(() => {
                currentRow.remove();
                deleteModal.classList.remove("show");
                showNotify("Xóa hộ khẩu thành công!");
            });
    });
    const searchInput = document.getElementById("search-input");

    searchInput.addEventListener("input", () => {
        const keyword = searchInput.value.toLowerCase().trim();
        const rows = document.querySelectorAll(".household-table tbody tr");

        rows.forEach(row => {
            const text = row.innerText.toLowerCase();
            row.style.display = text.includes(keyword) ? "" : "none";
        });
    });
});
