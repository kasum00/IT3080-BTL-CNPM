document.addEventListener("DOMContentLoaded", function () {
  const btnLogin = document.getElementById("btn-login");
  const emailInput = document.querySelector('input[type="email"]');      // username
  const passwordInput = document.querySelector('input[type="password"]');

  const API_BASE = (window.API_BASE || "http://localhost:3000").replace(/\/$/, "");

  if (!btnLogin || !emailInput || !passwordInput) {
    console.error("Không tìm thấy nút login hoặc input email/password trong HTML");
    return;
  }

  // đã login thì vào dashboard luôn
  if (localStorage.getItem("accessToken")) {
    window.location.href = "dashboard.html";
    return;
  }

  async function doLogin() {
    const username = emailInput.value.trim();
    const password = passwordInput.value; // không trim password

    if (!username || !password) {
      alert("Vui lòng nhập đầy đủ Email/Username và Mật khẩu");
      return;
    }

    btnLogin.disabled = true;
    const oldText = btnLogin.innerText;
    btnLogin.innerText = "Đang đăng nhập...";

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        alert(data?.message || `Đăng nhập thất bại (HTTP ${res.status})`);
        return;
      }

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("role", data.user?.role || "");

      // tương thích nếu code cũ đọc các key này
      localStorage.setItem("adminId", data.user?.id ?? "");
      localStorage.setItem("adminName", data.user?.username ?? "Admin");
      localStorage.setItem("adminEmail", data.user?.username ?? username);

      window.location.href = "dashboard.html";
    } catch (e) {
      console.error(e);
      alert("Không thể kết nối tới server. Kiểm tra backend đang chạy port 3000.");
    } finally {
      btnLogin.disabled = false;
      btnLogin.innerText = oldText;
    }
  }

  btnLogin.addEventListener("click", doLogin);

  // Enter để login
  [emailInput, passwordInput].forEach((el) => {
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter") doLogin();
    });
  });
});
