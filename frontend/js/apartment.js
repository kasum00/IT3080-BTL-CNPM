// document.addEventListener("DOMContentLoaded", () => {

//     /* ===============================
//        MODAL CHI TIẾT
//        =============================== */
//     const detailModal = document.getElementById("apartment-modal");
//     const closeDetailBtn = document.getElementById("close-modal");
//     const btnCloseDetail = document.getElementById("btn-close-detail");

//     /* ===============================
//        MODAL CHỈNH SỬA
//        =============================== */
//     const editModal = document.getElementById("editModal");
//     const btnOpenEdit = document.getElementById("btn-open-edit");
//     const closeEditBtn = document.getElementById("close-edit");

//     const btnSaveEdit = document.getElementById("btn-save-edit");
//     let currentRow = null; //lưu dòng đang sử


//     /* ===============================
//        ICON BÚT → MỞ MODAL CHI TIẾT
//        =============================== */
//     document.querySelectorAll(".btn-detail").forEach(btn => {
//         btn.addEventListener("click", () => {
//             currentRow = btn.closest("tr");

//             document.getElementById("modal-name").value = btn.dataset.name || "";
//             document.getElementById("modal-floor").value = btn.dataset.floor || "";
//             document.getElementById("modal-area").value = btn.dataset.area || "";
//             document.getElementById("modal-desc").value = btn.dataset.status || "";
//             document.getElementById("modal-owner").value = btn.dataset.owner || "";
//             document.getElementById("modal-start").value = btn.dataset.start || "";
//             document.getElementById("modal-end").value = btn.dataset.end || "";

//             detailModal.classList.add("show");
//         });
//     });

//     /* ===============================
//        ĐÓNG MODAL CHI TIẾT
//        =============================== */
//     [closeDetailBtn, btnCloseDetail].forEach(btn => {
//         btn?.addEventListener("click", () => {
//             detailModal.classList.remove("show");
//         });
//     });



//     detailModal.addEventListener("click", e => {
//         if (e.target === detailModal) {
//             detailModal.classList.remove("show");
//         }
//     });

//     /* ===============================
//        CLICK "CHỈNH SỬA"
//        CHI TIẾT → EDIT
//        =============================== */
//     btnOpenEdit.addEventListener("click", () => {

//         // Đóng modal chi tiết
//         detailModal.classList.remove("show");

//         // Copy dữ liệu sang form edit
//         document.getElementById("edit-name").value =
//             document.getElementById("modal-name").value;

//         document.getElementById("edit-floor").value =
//             document.getElementById("modal-floor").value;

//         document.getElementById("edit-desc").value =
//             document.getElementById("modal-desc").value;

//         document.getElementById("edit-area").value =
//             document.getElementById("modal-area").value;

//         document.getElementById("edit-owner").value =
//             document.getElementById("modal-owner").value;

//         document.getElementById("edit-start").value =
//             document.getElementById("modal-start").value;

//         document.getElementById("edit-end").value =
//             document.getElementById("modal-end").value;

//         // Mở modal chỉnh sửa
//         editModal.classList.add("show");
//     });
//     /* ===============================
//        LƯU CHỈNH SỬA → CẬP NHẬT BẢNG
//        =============================== */
//     btnSaveEdit.onclick = () => {

//         if (!currentRow) return;

//         const name = document.getElementById("edit-name").value;
//         const floor = document.getElementById("edit-floor").value;
//         const area = document.getElementById("edit-area").value;

//         // Cập nhật lại bảng
//         currentRow.children[0].innerText = name;
//         currentRow.children[1].innerText = floor;
//         currentRow.children[2].innerText = area;

//         // Cập nhật lại dataset cho icon bút
//         const btnDetail = currentRow.querySelector(".btn-detail");
//         btnDetail.dataset.name = name;
//         btnDetail.dataset.floor = floor;
//         btnDetail.dataset.area = area;
//         btnDetail.dataset.status = document.getElementById("edit-desc").value;
//         btnDetail.dataset.owner = document.getElementById("edit-owner").value;
//         btnDetail.dataset.start = document.getElementById("edit-start").value;
//         btnDetail.dataset.end = document.getElementById("edit-end").value;

//         // Đóng modal edit
//         editModal.classList.remove("show");

//     };

//     /* ===============================
//        ĐÓNG MODAL CHỈNH SỬA
//        =============================== */
//     closeEditBtn.addEventListener("click", () => {
//         editModal.classList.remove("show");

//     });
//     /* ===============================
//    MODAL THÔNG BÁO
//    =============================== */
//     const notifyModal = document.getElementById("notifyModal");
//     const notifyText = document.getElementById("notify-text");
//     const notifyOk = document.getElementById("notify-ok");
//     const closeNotify = document.getElementById("close-notify");

//     function showNotify(message) {
//         notifyText.innerText = message;
//         notifyModal.classList.add("show");
//     }

//     [notifyOk, closeNotify].forEach(btn => {
//         btn?.addEventListener("click", () => {
//             notifyModal.classList.remove("show");
//         });
//     });

//     function openDetail(btn) {
//         currentRow = btn.closest("tr");

//         document.getElementById("modal-name").value = btn.dataset.name || "";
//         document.getElementById("modal-floor").value = btn.dataset.floor || "";
//         document.getElementById("modal-area").value = btn.dataset.area || "";
//         document.getElementById("modal-status").value = btn.dataset.status || "";
//         document.getElementById("modal-owner").value = btn.dataset.owner || "";
//         document.getElementById("modal-start").value = btn.dataset.start || "";
//         document.getElementById("modal-end").value = btn.dataset.end || "";
        

//         detailModal.classList.add("show");
//     }


//     /* ===============================
//        GHI ĐÈ HÀNH VI ĐÓNG / HỦY EDIT
//        =============================== */
//     closeEditBtn.addEventListener("click", () => {
//         editModal.classList.remove("show");
//         showNotify("Đóng chỉnh sửa căn hộ thành công!");
//     });

//     const btnCancelEdit = document.getElementById("btn-cancel-edit");
//     btnCancelEdit?.addEventListener("click", () => {
//         editModal.classList.remove("show");
//         showNotify("Đóng chỉnh sửa căn hộ thành công!");
//     });

//     /* ===============================
//        SAU KHI LƯU → HIỆN THÔNG BÁO
//        =============================== */
//     btnSaveEdit.onclick = () => {

//         if (!currentRow) return;

//         const name = document.getElementById("edit-name").value;
//         const floor = document.getElementById("edit-floor").value;
//         const area = document.getElementById("edit-area").value;

//         currentRow.children[0].innerText = name;
//         currentRow.children[1].innerText = floor;
//         currentRow.children[2].innerText = area;

//         const btnDetail = currentRow.querySelector(".btn-detail");
//         btnDetail.dataset.name = name;
//         btnDetail.dataset.floor = floor;
//         btnDetail.dataset.area = area;
//         btnDetail.dataset.status = document.getElementById("edit-desc").value;
//         btnDetail.dataset.owner = document.getElementById("edit-owner").value;
//         btnDetail.dataset.start = document.getElementById("edit-start").value;
//         btnDetail.dataset.end = document.getElementById("edit-end").value;

//         editModal.classList.remove("show");
//         showNotify("Lưu chỉnh sửa căn hộ thành công!");
//     };

//     const btnAddApartment = document.querySelector(".btn-add");
//     const addModal = document.getElementById("addModal");
//     const closeAddBtn = document.getElementById("close-add");
//     const cancelAddBtn = document.getElementById("cancel-add");
//     const saveAddBtn = document.getElementById("save-add");

//     btnAddApartment.addEventListener("click", () => {

//         // reset form
//         document.querySelectorAll(
//             "#addModal input"
//         ).forEach(i => i.value = "");

//         addModal.classList.add("show");
//     });

//     [closeAddBtn, cancelAddBtn].forEach(btn => {
//         btn.addEventListener("click", () => {
//             addModal.classList.remove("show");
//         });
//     });

//     saveAddBtn.addEventListener("click", () => {

//         const ma = document.getElementById("add-ma").value;

//         const name = document.getElementById("add-name").value;
//         const floor = document.getElementById("add-floor").value;
//         const area = document.getElementById("add-area").value;
//         const desc = document.getElementById("add-desc").value;
//         const owner = document.getElementById("add-owner").value;
//         const start = document.getElementById("add-start").value;
//         const end = document.getElementById("add-end").value;

//         const tbody = document.querySelector(".apartment-table tbody");

//         const tr = document.createElement("tr");
//         tr.innerHTML = `
//         <td>${ma}</td>
//         <td>${name}</td>
//         <td>${floor}</td>
//         <td>${area}</td>
//         <td>${desc || "trống"}</td>
//         <td class="action">
//             <span class="btn-detail"
//                 data-ma ="${ma}"
//                 data-name="${name}"
//                 data-floor="${floor}"
//                 data-area="${area}"
//                 data-status="${desc}"
//                 data-owner="${owner}"
//                 data-start="${start}"
//                 data-end="${end}">
//             </span>
//         </td>
//     `;

//         tbody.appendChild(tr);

//         addModal.classList.remove("show");

//         // Gắn lại sự kiện icon bút cho dòng mới
//         tr.querySelector(".btn-detail").addEventListener("click", function () {
//             openDetail(this);
//         });

//         // Thông báo
//         showNotify("Thêm căn hộ thành công!");
//     });



// });
document.addEventListener("DOMContentLoaded", () => {

    let currentRow = null;

    /* ===============================
       MODAL
    =============================== */
    const detailModal = document.getElementById("apartment-modal");
    const editModal = document.getElementById("editModal");

    /* ===============================
       OPEN DETAIL
    =============================== */
    function openDetail(btn) {
        currentRow = btn.closest("tr");

        document.getElementById("modal-name").value = btn.dataset.name || "";
        document.getElementById("modal-floor").value = btn.dataset.floor || "";
        document.getElementById("modal-area").value = btn.dataset.area || "";
        document.getElementById("modal-desc").value = btn.dataset.status || "";
        document.getElementById("modal-owner").value = btn.dataset.owner || "";
        document.getElementById("modal-start").value = btn.dataset.start || "";
        document.getElementById("modal-end").value = btn.dataset.end || "";

        detailModal.classList.add("show");
    }

    /* ===============================
       ICON DETAIL (DÒNG CŨ)
    =============================== */
    document.querySelectorAll(".btn-detail").forEach(btn => {
        btn.addEventListener("click", function () {
            openDetail(this);
        });
    });

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

        document.getElementById("edit-name").value =
            document.getElementById("modal-name").value;
        document.getElementById("edit-floor").value =
            document.getElementById("modal-floor").value;
        document.getElementById("edit-area").value =
            document.getElementById("modal-area").value;
        document.getElementById("edit-desc").value =
            document.getElementById("modal-desc").value;
        document.getElementById("edit-owner").value =
            document.getElementById("modal-owner").value;
        document.getElementById("edit-start").value =
            document.getElementById("modal-start").value;
        document.getElementById("edit-end").value =
            document.getElementById("modal-end").value;

        editModal.classList.add("show");
    });

    /* ===============================
       SAVE EDIT (CHỈ 1 LẦN)
    =============================== */
    document.getElementById("btn-save-edit").addEventListener("click", () => {

        if (!currentRow) return;

        const name = document.getElementById("edit-name").value;
        const floor = document.getElementById("edit-floor").value;
        const area = document.getElementById("edit-area").value;

        currentRow.children[1].innerText = name;
        currentRow.children[2].innerText = floor;
        currentRow.children[3].innerText = area;

        const btn = currentRow.querySelector(".btn-detail");
        btn.dataset.name = name;
        btn.dataset.floor = floor;
        btn.dataset.area = area;
        btn.dataset.status = document.getElementById("edit-desc").value;
        btn.dataset.owner = document.getElementById("edit-owner").value;
        btn.dataset.start = document.getElementById("edit-start").value;
        btn.dataset.end = document.getElementById("edit-end").value;

        editModal.classList.remove("show");
        showNotify("Lưu chỉnh sửa căn hộ thành công!");
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

    document.getElementById("save-add").addEventListener("click", () => {

        const ma = document.getElementById("add-ma").value;
        const name = document.getElementById("add-name").value;
        const floor = document.getElementById("add-floor").value;
        const area = document.getElementById("add-area").value;
        const desc = document.getElementById("add-desc").value;

        const tbody = document.querySelector(".apartment-table tbody");
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${ma}</td>
            <td>${name}</td>
            <td>${floor}</td>
            <td>${area}</td>
            <td>${desc || "trống"}</td>
            <td class="action">
                <span class="btn-detail"
                    data-name="${name}"
                    data-floor="${floor}"
                    data-area="${area}"
                    data-status="${desc}">
                </span>
            </td>
        `;

        tbody.appendChild(tr);
        document.getElementById("addModal").classList.remove("show");

        tr.querySelector(".btn-detail").addEventListener("click", function () {
            openDetail(this);
        });

        showNotify("Thêm căn hộ thành công!");
    });

});
