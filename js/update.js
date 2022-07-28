"use strinct";

window.addEventListener("DOMContentLoaded", () => {
  const IdToken = sessionStorage.getItem("IdToken");

  const target = document.getElementById("target");
  const target_name = document.getElementById("target_name");
  const gender = document.getElementById("gender");
  const gender1 = document.getElementById("gender1");
  const gender2 = document.getElementById("gender2");
  const gender3 = document.getElementById("gender3");
  const telephone1 = document.getElementById("telephone1");
  const telephone2 = document.getElementById("telephone2");
  const telephone3 = document.getElementById("telephone3");
  const info = document.getElementById("info");
  const info1 = document.getElementById("info1");
  const info2 = document.getElementById("info2");
  const birthday = document.getElementById("birthday");
  const memo = document.getElementById("memo");
  const date = document.getElementById("date");
  const time = document.getElementById("time");
  const operator = document.getElementById("operator");
  const time_stamp = document.getElementById("time_stamp");

  const update_target = document.getElementById("update_target");
  const update_target_name = document.getElementById("update_target_name");
  const update_gender = document.getElementById("update_gender");
  const update_info = document.getElementById("update_info");
  const update_telephone = document.getElementById("update_telephone");
  const update_birthday = document.getElementById("update_birthday");
  const update_memo = document.getElementById("update_memo");
  const update_button = document.getElementById("update_button");

  const popup_button = document.getElementById("popup_button");

  const read_message = document.getElementById("read_message");
  const update_message = document.getElementById("update_message");

  const UpdateModel = new DataModel();

  if (IdToken === null || IdToken === undefined) {
    localStorage.setItem = ("errorMessage", "セッション情報がありません");
    location.href = "./login.html";
  } else {
    new ModalWindow(
      document.getElementById("modal_area"),
      document.getElementById("modal_back"),
      popup_button,
      document.getElementById("close_button")
    ).assignment();

    //read.htmlから顧客IDが送られてくる
    const queryString = window.location.search;

    fetch(`${API_URL.read}${queryString}`, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      headers: {
        Authorization: IdToken,
        "Content-Type": "application/json;charset=utf-8",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        for (const items of data.Items) {
          target.innerText = items.target;
          target_name.value = items.target_name;
          switch (items.info) {
            case "在籍中":
              info1.setAttribute("selected", "true");
              break;
            case "退会済み":
              info2.setAttribute("selected", "true");
              break;
            default:
              break;
          }

          switch (items.gender) {
            case "男性":
              gender1.setAttribute("selected", "true");
              break;
            case "女性":
              gender2.setAttribute("selected", "true");
              break;
            case "その他":
              gender3.setAttribute("selected", "true");
              break;
            default:
              break;
          }
          telephone1.value = items.telephone.split("-", 3)[0];
          telephone2.value = items.telephone.split("-", 3)[1];
          telephone3.value = items.telephone.split("-", 3)[2];
          birthday.value = encodeCalender(items.birthday);
          memo.value = items.memo;
          date.innerText = items.date;
          time.innerText = items.time;
          operator.innerText = items.operator;
          time_stamp.innerText = items.time_stamp;
        }
      })

      .catch(() => {
        processFailed(read_message, "データの読み取りに失敗しました");
      });
  }

  //更新チェック
  popup_button.addEventListener("click", () => {
    try {
      UpdateModel.setTimeStamp(time_stamp.innerText);
      UpdateModel.setTarget(target.innerText);
      UpdateModel.setTargetName(target_name.value);
      UpdateModel.setTelephone(
        telephone1.value,
        telephone2.value,
        telephone3.value
      );
      UpdateModel.setInfo(info.value);
      UpdateModel.setBirthday(birthday.value);
      UpdateModel.setMemo(memo.value);
      UpdateModel.setGender(gender.value);

      update_target.innerText = UpdateModel.getTarget();
      update_target_name.innerText = UpdateModel.getTargetName();
      update_gender.innerText = UpdateModel.getGender();
      update_info.innerText = UpdateModel.getInfo();
      update_telephone.innerText = UpdateModel.getTelephone();
      update_birthday.innerText = UpdateModel.getBirthday();
      update_memo.innerText = UpdateModel.getMemo();
    } catch (error) {
      processFailed(read_message, error);
      document.getElementById("modal_area").style.display = "none";
    }
  });

  //更新処理
  update_button.addEventListener("click", () => {
    update_message.innerText = "送信中。";
    document.getElementById("delete_message").innerText = "";
    fetch(API_URL.update, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        Authorization: IdToken,
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(UpdateModel),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          processSuccess(update_message, "更新に成功しました");
          document.getElementById("close_button").value = "閉じる";
        } else {
          processFailed(update_message, data.message);
        }
      })

      //エラーはすべて通信エラーが返ってくる決まり
      .catch(() => {
        processFailed(update_message, "通信エラーが発生しました");
      });
  });
});
