"use strict";

window.addEventListener("DOMContentLoaded", () => {
  const user_id = document.getElementById("user_id");
  const user_name = document.getElementById("user_name");
  const user_mail = document.getElementById("user_mail");
  const user_password = document.getElementById("user_password");
  const signup_button = document.getElementById("signup_button");
  const signup_message = document.getElementById("signup_message");

  new ModalWindow(
    document.getElementById("modal_area"),
    document.getElementById("modal_back"),
    document.getElementById("popup_button"),
    document.getElementById("close_button")
  ).assignment();

  new ModalWindow(
    document.getElementById("modal_area_signup"),
    document.getElementById("modal_back_signup"),
    document.getElementById("popup_button_signup"),
    document.getElementById("close_button_signup")
  ).assignment();

  const SignupModel = new UserModel();
  signup_button.addEventListener("click", async () => {
    signup_message.innerText = "送信中";
    document.getElementById("confirmation_message").innerText = "";
    try {
      SignupModel.setId(user_id.value);
      SignupModel.setName(user_name.value);
      SignupModel.setMail(user_mail.value);
      SignupModel.setPassword(user_password.value);

      fetch(API_URL.signup, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(SignupModel),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.code === 200) {
            document.getElementById("popup_button_signup").click();
            signup_message.innerText = "";
          } else {
            processFailed(signup_message, data.message);
          }
        })
        .catch(() => {
          processFailed(
            signup_message,
            "通信エラーが発生しました。<br>管理者にお問い合わせください"
          );
        });
    } catch (error) {
      processFailed(signup_message, error);
    }
  });
});
