"use strict";

window.addEventListener("DOMContentLoaded", () => {
  const read_url = API_URL.read + "?role=log";
  const IdToken = sessionStorage.getItem("IdToken");
  const page_count = document.getElementById("page_count");
  const current_page = document.getElementById("current_page");
  const paging_buttons = document.getElementById("paging_buttons");
  const tbody = document.querySelector("tbody");
  const reverse_button = document.getElementById("reverse_button");
  const allow = document.getElementById("allow");

  const all_search_button = document.getElementById("all_search_button");
  const read_message = document.getElementById("read_message");

  const search_target = document.getElementById("search_target");
  const search_target_name = document.getElementById("search_target_name");
  const search_operator = document.getElementById("search_operator");
  const search_date = document.getElementById("search_date");
  const search_target_button = document.getElementById("search_target_button");
  const search_operator_button = document.getElementById(
    "search_operator_button"
  );
  const search_target_name_button = document.getElementById(
    "search_target_name_button"
  );
  const search_date_button = document.getElementById("search_date_button");

  const search_target_toggle = document.getElementById("search_target_toggle");
  const search_target_name_toggle = document.getElementById(
    "search_target_name_toggle"
  );
  const search_operator_toggle = document.getElementById(
    "search_operator_toggle"
  );
  const search_date_toggle = document.getElementById("search_date_toggle");

  const search_target_button_toggle = document.getElementById(
    "search_target_button_toggle"
  );
  const search_target_name_button_toggle = document.getElementById(
    "search_target_name_button_toggle"
  );
  const search_operator_button_toggle = document.getElementById(
    "search_operator_button_toggle"
  );
  const search_date_button_toggle = document.getElementById(
    "search_date_button_toggle"
  );

  let items = new Array();
  const ReadValidater = new Validater();

  if (IdToken === null || IdToken === undefined) {
    localStorage.setItem = ("errorMessage", "セッション情報がありません");
    location.href = "./login.html";
  } else {
    new ToggleWindow(
      document.getElementById("open_search_button"),
      document.getElementById("close_search_button"),
      document.getElementById("toggle_search_window")
    ).assignment();

    new ToggleWindow(
      document.getElementById("open_nav_button"),
      document.getElementById("close_nav_button"),
      document.getElementById("toggle_nav_window")
    ).assignment();

    //要リファクタリング、可能であればまとめること
    all_search_button.addEventListener("click", async () => {
      read_message.innerText = "通信中";
      try {
        readFunction(read_url);
      } catch (error) {
        processFailed(read_message, error);
      }
    });
    search_operator_button.addEventListener("click", () => {
      read_message.innerText = "通信中";
      const key = "&operator=";
      try {
        ReadValidater.validateRequired(search_operator.value);
        const value = new Converter(search_operator.value).getValue();
        readFunction(read_url + key + value);
        read_message.innerText = "";
      } catch (error) {
        processFailed(read_message, error);
      }
    });
    search_operator_button_toggle.addEventListener("click", () => {
      read_message.innerText = "通信中";
      const key = "&operator=";
      try {
        ReadValidater.validateRequired(search_operator_toggle.value);
        const value = new Converter(search_operator_toggle.value).getValue();
        readFunction(read_url + key + value);
      } catch (error) {
        processFailed(read_message, error);
      }
    });
    search_target_button.addEventListener("click", () => {
      read_message.innerText = "通信中";
      const key = "&target=";
      try {
        ReadValidater.validateRequired(search_target.value);
        const value = new Converter(search_target.value).getValue();
        readFunction(read_url + key + value);
      } catch (error) {
        processFailed(read_message, error);
      }
    });
    search_target_button_toggle.addEventListener("click", () => {
      read_message.innerText = "通信中";
      const key = "&target=";
      try {
        ReadValidater.validateRequired(search_target_toggle.value);
        const value = new Converter(search_target_toggle.value).getValue();
        readFunction(read_url + key + value);
      } catch (error) {
        processFailed(read_message, error);
      }
    });
    search_target_name_button.addEventListener("click", () => {
      read_message.innerText = "通信中";
      const key = "&target_name=";
      try {
        ReadValidater.validateRequired(search_target_name.value);
        const value = new Converter(search_target_name.value).getValue();
        readFunction(read_url + key + value);
      } catch (error) {
        processFailed(read_message, error);
      }
    });
    search_target_name_button_toggle.addEventListener("click", () => {
      read_message.innerText = "通信中";
      const key = "&target_name=";
      try {
        ReadValidater.validateRequired(search_target_name_toggle.value);
        const value = new Converter(search_target_name_toggle.value).getValue();
        readFunction(read_url + key + value);
      } catch (error) {
        processFailed(read_message, error);
      }
    });
    search_date_button.addEventListener("click", () => {
      read_message.innerText = "通信中";
      const key = "&date=";
      try {
        ReadValidater.validateRequired(search_date.value);
        const value = new Converter(search_date.value).convertDate();
        readFunction(read_url + key + value);
      } catch (error) {
        processFailed(read_message, error);
      }
    });
    search_date_button_toggle.addEventListener("click", () => {
      read_message.innerText = "通信中";
      const key = "&date=";
      try {
        ReadValidater.validateRequired(search_date_toggle.value);
        const value = new Converter(search_date_toggle.value).convertDate();
        readFunction(read_url + key + value);
      } catch (error) {
        processFailed(read_message, error);
      }
    });
  }
  //ここまで//

  //読み込み用
  function readFunction(url) {
    items = [];
    fetch(url, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      headers: {
        Authorization: IdToken,
        "Content-Type": "application/json; charset=utf-8",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        items = data.Items;
        if (items.length < 1) {
          processFailed(
            read_message,
            "該当する検索結果が<br>ありませんでした。"
          );
        } else {
          createList(
            1,
            items,
            paging_buttons,
            page_count,
            current_page,
            tbody,
            "log"
          );
          read_message.innerText = "";
        }
      })
      .catch(() => {
        processFailed(
          read_message,
          "通信エラーです。<br>もう一度ログインしなおしてください"
        );
      });
  }
  //順序反転
  reverse_button.addEventListener("click", () => {
    const value = parseInt(document.getElementById("current_button").value);
    if (allow.innerText === "↓") {
      allow.innerText = "↑";
    } else {
      allow.innerText = "↓";
    }
    items.reverse();
    createList(
      value,
      items,
      paging_buttons,
      page_count,
      current_page,
      tbody,
      "log"
    );
  });
});
