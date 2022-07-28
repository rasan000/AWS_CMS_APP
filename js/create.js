"use strict";

window.addEventListener("DOMContentLoaded", () => {
  const IdToken = sessionStorage.getItem("IdToken");

  //セッション確認
  if (IdToken === null || IdToken === undefined) {
    localStorage.setItem = ("errorMessage", "セッション情報がありません");
    location.href = "./login.html";
  } else {
    const check_target = document.getElementById("check_target");
    const check_target_name = document.getElementById("check_target_name");
    const check_gender = document.getElementById("check_gender");
    const check_telephone = document.getElementById("check_telephone");
    const check_birthday = document.getElementById("check_birthday");
    const check_memo = document.getElementById("check_memo");

    const target = document.getElementById("target");
    const target_name = document.getElementById("target_name");
    const gender = document.getElementById("gender");
    const telephone1 = document.getElementById("telephone1");
    const telephone2 = document.getElementById("telephone2");
    const telephone3 = document.getElementById("telephone3");
    const birthday = document.getElementById("birthday");
    const memo = document.getElementById("memo");

    const create_message = document.getElementById("create_message");
    const check_message = document.getElementById("check_message");

    const popup_button = document.getElementById("popup_button");
    const create_button = document.getElementById("create_button");

    let CreateModel = new DataModel();

    new ModalWindow(
      document.getElementById("modal_area"),
      document.getElementById("modal_back"),
      document.getElementById("popup_button"),
      document.getElementById("close_button")
    ).assignment();

    popup_button.addEventListener("click", () => {
      check_message.innerText = "";
      create_message.innerText = "";
      try {
        CreateModel.setTarget(target.value);
        CreateModel.setTargetName(target_name.value);
        CreateModel.setTelephone(
          telephone1.value,
          telephone2.value,
          telephone3.value
        );
        CreateModel.setBirthday(birthday.value);
        CreateModel.setMemo(memo.value);
        CreateModel.setGender(gender.value);

        check_target.innerText = CreateModel.getTarget();
        check_target_name.innerText = CreateModel.getTargetName();
        check_gender.innerText = CreateModel.getGender();
        check_telephone.innerText = CreateModel.getTelephone();
        check_birthday.innerText = CreateModel.getBirthday();
        check_memo.innerText = CreateModel.getMemo();
      } catch (error) {
        processFailed(check_message, error);
        document.getElementById("modal_area").style.display = "none";
      }
    });

    create_button.addEventListener("click", async () => {
      check_message.innerText = "";
      create_message.innerText = "送信中";
      fetch(API_URL.create, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
          Authorization: IdToken,
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(CreateModel),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data.code === 200) {
            processSuccess(
              create_message,
              "ユーザーの追加に<br>成功しました。"
            );
            document.getElementById("close_button").value = "閉じる";
          } else {
            processFailed(create_message, data.message);
          }
        })
        .catch(() => {
          processFailed(
            create_message,
            "アクセス許可がありません。<br>管理者にお問い合わせください"
          );
        });
    });
  }
});
