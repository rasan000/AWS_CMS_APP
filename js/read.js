"use strict";

window.addEventListener("DOMContentLoaded", () => {
  const read_url = API_URL.read + "?role=customer";
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
  const search_telephone1 = document.getElementById("search_telephone1");
  const search_telephone2 = document.getElementById("search_telephone2");
  const search_telephone3 = document.getElementById("search_telephone3");
  const search_target_button = document.getElementById("search_target_button");
  const search_operator_button = document.getElementById(
    "search_operator_button"
  );
  const search_target_name_button = document.getElementById(
    "search_target_name_button"
  );
  const search_telephone_button = document.getElementById(
    "search_telephone_button"
  );

  const search_target_toggle = document.getElementById("search_target_toggle");
  const search_target_name_toggle = document.getElementById(
    "search_target_name_toggle"
  );
  const search_operator_toggle = document.getElementById(
    "search_operator_toggle"
  );
  const search_telephone1_toggle = document.getElementById(
    "search_telephone1_toggle"
  );
  const search_telephone2_toggle = document.getElementById(
    "search_telephone2_toggle"
  );
  const search_telephone3_toggle = document.getElementById(
    "search_telephone3_toggle"
  );
  const search_target_button_toggle = document.getElementById(
    "search_target_button_toggle"
  );
  const search_target_name_button_toggle = document.getElementById(
    "search_target_name_button_toggle"
  );
  const search_operator_button_toggle = document.getElementById(
    "search_operator_button_toggle"
  );
  const search_telephone_button_toggle = document.getElementById(
    "search_telephone_button_toggle"
  );

  let items = new Array();
  let enable_items = new Array();
  let disable_items = new Array();
  let flags = document.getElementsByName("flag");
  let flag_value = "enable";

  const ReadValidater = new Validater();

  //絞り込み情報の取得
  for (let i of flags) {
    i.addEventListener("change", () => {
      if (i.checked) {
        flag_value = i.value;
        if (flag_value === "enable") {
          createList(
            1,
            enable_items,
            paging_buttons,
            page_count,
            current_page,
            tbody,
            "customer"
          );
        } else if (flag_value === "disable") {
          createList(
            1,
            disable_items,
            paging_buttons,
            page_count,
            current_page,
            tbody,
            "customer"
          );
        } else if (flag_value === "all") {
          createList(
            1,
            items,
            paging_buttons,
            page_count,
            current_page,
            tbody,
            "customer"
          );
        }
      }
    });
  }

  //セッション確認
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

    //要リファクタリング
    all_search_button.addEventListener("click", () => {
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
    search_telephone_button.addEventListener("click", () => {
      read_message.innerText = "通信中";
      const key = "&telephone=";
      try {
        ReadValidater.validateRequired(search_telephone1.value);
        ReadValidater.validateRequired(search_telephone2.value);
        ReadValidater.validateRequired(search_telephone3.value);
        const value = new Converter(
          search_telephone1.value,
          search_telephone2.value,
          search_telephone3.value
        ).convertTelephone();
        readFunction(read_url + key + value);
      } catch (error) {
        processFailed(read_message, error);
      }
    });
    search_telephone_button_toggle.addEventListener("click", () => {
      read_message.innerText = "通信中";
      const key = "&telephone=";
      try {
        ReadValidater.validateRequired(search_telephone1_toggle.value);
        ReadValidater.validateRequired(search_telephone2_toggle.value);
        ReadValidater.validateRequired(search_telephone3_toggle.value);
        const value = new Converter(
          search_telephone1_toggle.value,
          search_telephone2_toggle.value,
          search_telephone3_toggle.value
        ).convertTelephone();
        readFunction(read_url + key + value);
      } catch (error) {
        processFailed(read_message, error);
      }
    });
  }
  ///ここまで

  //読み込み用関数
  function readFunction(url) {
    items = [];
    enable_items = [];
    disable_items = [];
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
        for (let i of items) {
          if (i.info != "退会済み") {
            enable_items.push(i);
          } else {
            disable_items.push(i);
          }
        }
        if (items.length < 1) {
          processFailed(
            read_message,
            "該当する検索結果が<br>ありませんでした。"
          );
        } else {
          createList(
            1,
            enable_items,
            paging_buttons,
            page_count,
            current_page,
            tbody,
            "customer"
          );
          read_message.innerText = "";
        }
      })
      .catch(() => {
        processFailed(
          read_message,
          "アクセス許可がありません。<br>管理者にお問い合わせください"
        );
      });
  }
  //順序反転
  reverse_button.addEventListener("click", () => {
    let array;
    if (flag_value == "enable") {
      array = enable_items;
    } else if (flag_value == "disable") {
      array = disable_items;
    } else if (flag_value == "all") {
      array = items;
    }
    const value = parseInt(document.getElementById("current_button").value);
    if (allow.innerText === "↓") {
      allow.innerText = "↑";
    } else {
      allow.innerText = "↓";
    }
    array.reverse();
    createList(
      value,
      array,
      paging_buttons,
      page_count,
      current_page,
      tbody,
      "customer"
    );
  });
});
