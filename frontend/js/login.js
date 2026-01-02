/* =====================================
   LOGIN – BAN QUẢN LÝ (AUTO VÀO TRANG CHỦ)
   ===================================== */

document.addEventListener("DOMContentLoaded", function () {

    const btnLogin = document.getElementById("btn-login");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    if (!btnLogin || !emailInput || !passwordInput) {
        console.error("Vui lòng điền thông tin");
        return;
    }

    btnLogin.addEventListener("click", function () {

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        /* ===== VALIDATE CƠ BẢN ===== */
        if (email === "" || password === "") {
            alert("Vui lòng nhập đầy đủ Email và Mật khẩu");
            return;
        }

        /* =====================================
           GIẢ LẬP LOGIN THÀNH CÔNG
           (Sau này thay bằng API + SQL)
           ===================================== */

        // Ví dụ dữ liệu trả về từ SQL
        const adminFromSQL = {
            id: 1,
            name: "Phú Trần",
            email: email
        };

        /* ===== LƯU THÔNG TIN ĐĂNG NHẬP ===== */
        localStorage.setItem("adminId", adminFromSQL.id);
        localStorage.setItem("adminName", adminFromSQL.name);
        localStorage.setItem("adminEmail", adminFromSQL.email);
        localStorage.setItem("isLoggedIn", "true");

        /* ===== AUTO CHUYỂN SANG TRANG CHỦ ===== */
        window.location.href = "dashboard.html";
    });

});
