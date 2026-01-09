document.addEventListener("DOMContentLoaded", function () {

    const btnAdmin = document.getElementById("btn-admin");

    btnAdmin.addEventListener("click", function () {
        // Chuyển sang trang đăng nhập Ban quản lý
        window.location.href = "login-admin.html";
    });

});
