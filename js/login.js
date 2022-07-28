"use strict";

window.addEventListener("DOMContentLoaded", () => {
  const login_button = document.getElementById("login_button");
  const user_id = document.getElementById("user_id");
  const user_password = document.getElementById("user_password");
  const login_message = document.getElementById("login_message");
  const LoginModel = new UserModel();

  if (sessionStorage.getItem("IdToken")) {
    sessionStorage.removeItem("IdToken");
  }
  if (localStorage.getItem("errorMessage")) {
    login_message.innerText = localStorage.getItem("errorMessage");
    localStorage.removeItem("errorMessage");
  }
  login_button.addEventListener("click", () => {
    login_message.innerText = "送信中";
    try {
      LoginModel.setId(user_id.value);
      LoginModel.setPassword(user_password.value);

      fetch(API_URL.login, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(LoginModel),
      })
        .then((response) => response.json())
        .then(async (data) => {
          switch (data.code) {
            case 200:
              sessionStorage.setItem("IdToken", data.IdToken);
              processSuccess(
                login_message,
                "ログインに成功しました。<br>管理画面に遷移します。"
              );
              await new Promise((resolve) => setTimeout(resolve, 1000));
              location.replace("./read.html");
              break;
            default:
              processFailed(login_message, data.message);
              break;
          }
        })
        .catch(() => {
          processFailed(
            login_message,
            "通信エラーが発生しました。<br/>管理者にお問い合わせください"
          );
        });
    } catch (error) {
      processFailed(login_message, error);
    }
  });
});
