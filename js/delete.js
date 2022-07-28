"use strict";

window.addEventListener("DOMContentLoaded", () => {
  const IdToken = sessionStorage.getItem("IdToken");

  const target = document.getElementById("target");
  const target_name = document.getElementById("target_name");
  const delete_target = document.getElementById("delete_target");
  const delete_target_name = document.getElementById("delete_target_name");
  const delete_button = document.getElementById("delete_button");
  const delete_message = document.getElementById("delete_message");

  const popup_button_alert = document.getElementById("popup_button_alert");

  const DeleteModel = new DataModel();

  new ModalWindow(
    document.getElementById("modal_area_alert"),
    document.getElementById("modal_back_alert"),
    popup_button_alert,
    document.getElementById("close_button_alert")
  ).assignment();

  //削除確認

  popup_button_alert.addEventListener("click", () => {
    DeleteModel.setTimeStamp(time_stamp.innerText);
    DeleteModel.setTarget(target.innerText);
    DeleteModel.setTargetName(target_name.value);
    delete_target.innerText = DeleteModel.getTarget();
    delete_target_name.innerText = DeleteModel.getTargetName();
  });

  //削除処理
  delete_button.addEventListener("click", async () => {
    try {
      delete_message.innerText = "削除中";
      await fetch(API_URL.delete, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
          Authorization: IdToken,
          "Content-type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(DeleteModel),
      })
        .then((response) => response.json())
        .then(async (data) => {
          switch (data.code) {
            case 200:
              processSuccess(
                delete_message,
                "削除に成功しました。<br>一覧画面に戻ります"
              );
              await new Promise((resolve) => setTimeout(resolve, 1000));
              window.location.replace("./read.html");
            default:
              processFailed(delete_message, data.message);
              break;
          }
        });
    } catch (error) {
      processFailed(
        delete_message,
        "アクセス許可がありません。<br>管理者にお問い合わせください"
      );
    }
  });
});
