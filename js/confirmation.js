"use strict";

window.addEventListener("DOMContentLoaded", () => {
  const confirmation_id = document.getElementById("confirmation_id");
  const confirmation_code = document.getElementById("confirmation_code");
  const confirmation_button = document.getElementById("confirmation_button");
  const confirmation_message = document.getElementById("confirmation_message");

  const ConfirmationModel = new UserModel();
  confirmation_button.addEventListener("click", async () => {
    confirmation_message.innerText = "送信中";
    document.getElementById("signup_message").innerText = "";
    try {
      ConfirmationModel.setId(confirmation_id.value);
      ConfirmationModel.setCode(confirmation_code.value);

      fetch(API_URL.confirmation, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(ConfirmationModel),
      })
        .then((response) => response.json())
        .then(async (data) => {
          if (data.code === 200) {
            processSuccess(
              confirmation_message,
              "ユーザー登録が完了しました。<br>トップページに遷移します"
            );
            await new Promise((resolve) => setTimeout(resolve, 1000));
            location.replace("./login.html");
          } else {
            processFailed(confirmation_message, data.message);
          }
        })
        .catch((error) => {
          processFailed(
            confirmation_message,
            "通信エラーが発生しました。<br>管理者にお問い合わせください"
          );
        });
    } catch (error) {
      processFailed(confirmation_message, error);
    }
  });
});
