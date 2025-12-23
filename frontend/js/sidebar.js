document.addEventListener("DOMContentLoaded", () => {

    /* ===============================
       CLICK MENU → CHUYỂN TRANG
       =============================== */
    document.querySelectorAll("[data-page]").forEach(item => {
        item.addEventListener("click", () => {
            e.preventDefault();
            const page = item.dataset.page;
            if (page) {
                window.location.href = page;
            }
        });
    });

    /* ===============================
       MỞ / ĐÓNG SUBMENU
       =============================== */
    document.querySelectorAll(".has-arrow").forEach(menu => {
        menu.addEventListener("click", (e) => {
            e.preventDefault(); // tránh nhảy trang khi có data-page

            menu.classList.toggle("open");

            const submenu = menu.nextElementSibling;
            if (submenu && submenu.classList.contains("submenu")) {
                submenu.classList.toggle("show");
            }
        });
    });

    /* ===============================
       ACTIVE MENU THEO TRANG
       =============================== */
    const currentPage = window.location.pathname.split("/").pop();

    document.querySelectorAll("[data-page]").forEach(item => {
        if (item.dataset.page === currentPage) {
            item.classList.add("active");

            // Tự mở submenu nếu đang ở trang con
            const submenu = item.closest(".submenu");
            if (submenu) {
                submenu.classList.add("show");
                submenu.previousElementSibling.classList.add("open");
            }
        }
    });

    /* ===============================
       ĐĂNG XUẤT → VỀ TRANG CHỌN ROLE
       =============================== */
    const logoutBtn = document.getElementById("btn-logout");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {

            // Xoá trạng thái đăng nhập
            localStorage.clear();

            // Quay về trang chọn role / login
            window.location.href = "../pages/index.html";
        });
    }

});
