"use strict";
//文字列加工、時刻取得、検証等共有して多用するタイプの関数やクラス

//レスポンス表示用関数
function processSuccess(parent, message) {
  parent.innerText = "";
  const span = document.createElement("span");
  span.classList.add("success");
  span.innerHTML = message;
  parent.appendChild(span);
}

function processFailed(parent, message) {
  parent.innerText = "";
  const span = document.createElement("span");
  span.classList.add("failed");
  span.innerHTML = message;
  parent.append(span);
}

//数字を2桁0埋めにする関数
function toDoubleDigits(num) {
  num += "";
  if (num.length === 1) {
    num = "0" + num;
  }
  return num;
}

//input type=dateで表示できる形式に変換する
function encodeCalender(str) {
  return str.replace(/\//g, "-");
}

//半角変換などをまとめて行うクラス
class Converter {
  constructor(...args) {
    //コードシフト
    this.args = args;
    let i = 0;
    for (let str of args) {
      str = str.replace(/[Ａ-Ｚａ-ｚ０-９！-～]/g, (tmp) => {
        return String.fromCharCode(tmp.charCodeAt(0) - 0xfee0);
      });

      // コードシフトで処理しきれない分
      str = str
        .replace(/”/g, '"')
        .replace(/’/g, "'")
        .replace(/‘/g, "`")
        .replace(/￥/g, "\\")
        .replace(/　/g, " ")
        .replace(/〜/g, "~");

      //空白削除
      str = str.trim().replace(/ /g, "");
      //禁止文字だが無理やり送られてきた際のためにサニタイズ
      str = str
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      this.args[i] = str;
      i++;
    }
  }
  getValues() {
    return this.args;
  }
  getValue() {
    return this.args[0];
  }
  convertDate() {
    return this.args[0].replace(/-/g, "/");
  }

  convertTelephone() {
    return `${this.args[0]}-${this.args[1]}-${this.args[2]}`;
  }
}

//検証用クラス、一部の文字は入力禁止とする
class Validater {
  constructor() {}
  validateRequired(str) {
    str = str.trim();
    if (!str) {
      throw "入力項目に抜け、もしくは<br>空白のみ入力されています";
    } else if (!str.match(/^.{0,30}/)) {
      throw "入力は３０文字以内に<br>収めてください";
    } else if (str.match(/[<>*"'&]/g)) {
      throw "禁止されている文字が<br>入力されています";
    }
  }
  validatePassword(str) {
    str = str.trim();
    if (!str) {
      throw "入力項目に抜けもしくは<br>空白のみ入力されています";
    } else if (!str.match(/^.{0,30}/)) {
      throw "入力は３０文字以内に<br>収めてください";
    } else if (str.match(/[&<>*"']/g)) {
      throw "禁止されている文字が<br>入力されています";
    } else if (
      !str.match(/^(?=.*?[a-z])(?=.*?\d)(?=.*?[!-\/:-@[-`{-~])([!-~]*)$/)
    ) {
      throw "パスワードが指定の形式で<br>入力されていません";
    }
  }
  validateMail(str) {
    if (!str) {
      throw "入力項目に抜け、もしくは<br>空白のみ入力されています";
    } else if (!str.match(/^.{0,30}/)) {
      throw "入力は３０文字以内に<br>収めてください";
    } else if (str.match(/[<>*"'&]/g)) {
      throw "禁止されている文字が<br>入力されています";
    } else if (!str.match(/^.+@artifacture.co.jp$/)) {
      throw "許可されていない<br>メールアドレスです";
    }
  }
}

//タイムスタンプと日時を生成するクラス
class GetDateTime {
  constructor() {
    this.time_stamp = Date.now();
    this.datetime = new Date(this.time_stamp);
    this.date = `${this.datetime.getFullYear()}/${toDoubleDigits(
      this.datetime.getMonth() + 1
    )}/${toDoubleDigits(this.datetime.getDate())}`;
    this.time = `${this.datetime.getHours()}:${toDoubleDigits(
      this.datetime.getMinutes()
    )}:${toDoubleDigits(this.datetime.getSeconds())}`;
  }
  getTimeStamp() {
    return this.time_stamp;
  }
  getDate() {
    return this.date;
  }
  getTime() {
    return this.time;
  }
}

//td作成
class CreateCell {
  constructor(class_name, value) {
    this.class_name = class_name;
    this.value = value;
    if (this.value === undefined) {
      this.value = "...";
    } else if (this.value.length > 15) {
      this.value = this.value.slice(15) + "...";
    }
  }

  execute() {
    //td作成
    const cell = document.createElement("td");
    cell.classList.add(this.class_name);
    cell.innerText = this.value;
    return cell;
  }
  executeLink() {
    //リンク付きtd作成
    const cell = document.createElement("td");
    const link = document.createElement("a");
    cell.classList.add(this.class_name);
    link.setAttribute(
      "href",
      `./update.html?role=customer&target=${this.value}`
    );
    link.classList.add("td-link");
    link.innerText = this.value;
    cell.appendChild(link);
    return cell;
  }
}

//tr作成
class CreateRow {
  constructor(count, array) {
    this.count = count;
    this.array = array;
  }
  //ログ用
  executeLog() {
    const tr = document.createElement("tr");
    tr.classList.add("log-data");
    if (this.array[this.count]["crud"] == "delete") {
      tr.classList.add("log-delete");
    } else if (this.array[this.count]["crud"] == "create") {
      tr.classList.add("log-create");
    } else if (this.array[this.count]["crud"] == "update") {
      tr.classList.add("log-update");
    }
    tr.appendChild(new CreateCell("l-no", this.count + 1).execute());
    tr.appendChild(
      new CreateCell(
        "l-time-stamp",
        this.array[this.count]["time_stamp"]
      ).execute()
    );
    tr.appendChild(
      new CreateCell("l-date", this.array[this.count]["date"]).execute()
    );
    tr.appendChild(
      new CreateCell("l-time", this.array[this.count]["time"]).execute()
    );
    tr.appendChild(
      new CreateCell("l-operator", this.array[this.count]["operator"]).execute()
    );
    tr.appendChild(
      new CreateCell("l-target", this.array[this.count]["target"]).execute()
    );
    tr.appendChild(
      new CreateCell("l-crud", this.array[this.count]["crud"]).execute()
    );
    tr.appendChild(
      new CreateCell(
        "l-target-name",
        this.array[this.count]["target_name"]
      ).execute()
    );
    tr.appendChild(
      new CreateCell(
        "l-telephone",
        this.array[this.count]["telephone"]
      ).execute()
    );
    tr.appendChild(
      new CreateCell("l-gender", this.array[this.count]["gender"]).execute()
    );
    tr.appendChild(
      new CreateCell("l-birthday", this.array[this.count]["birthday"]).execute()
    );
    tr.appendChild(
      new CreateCell("l-memo", this.array[this.count]["memo"]).execute()
    );
    tr.appendChild(
      new CreateCell("l-info", this.array[this.count]["info"]).execute()
    );
    return tr;
  }
  //customer用
  executeCustomer() {
    const tr = document.createElement("tr");
    tr.classList.add("customer-data");
    if (this.array[this.count]["info"] == "退会済み") {
      tr.classList.add("customer-delete");
    }
    tr.appendChild(new CreateCell("t-no", this.count + 1).execute());
    tr.appendChild(
      new CreateCell("t-target", this.array[this.count]["target"]).executeLink()
    );
    tr.appendChild(
      new CreateCell(
        "target-name",
        this.array[this.count]["target_name"]
      ).execute()
    );
    tr.appendChild(
      new CreateCell(
        "t-telephone",
        this.array[this.count]["telephone"]
      ).execute()
    );
    tr.appendChild(
      new CreateCell("t-gender", this.array[this.count]["gender"]).execute()
    );
    tr.appendChild(
      new CreateCell("t-birthday", this.array[this.count]["birthday"]).execute()
    );

    tr.appendChild(
      new CreateCell("t-memo", this.array[this.count]["memo"]).execute()
    );
    tr.appendChild(
      new CreateCell("t-info", this.array[this.count]["info"]).execute()
    );
    tr.appendChild(
      new CreateCell("t-operator", this.array[this.count]["operator"]).execute()
    );
    tr.appendChild(
      new CreateCell("t-date", this.array[this.count]["date"]).execute()
    );
    return tr;
  }
}

//tbody及び各種ボタン作成
function createList(
  current,
  array,
  parent,
  all_count_message,
  from_end,
  tbody,
  method
) {
  parent.innerText = "";
  //件数表示
  all_count_message.innerText = `全${array.length}件`;
  const page_count = parseInt(array.length / 20) + 1;
  //始点と終点
  let count_start = current - 2;
  let count_end = current + 2;
  //始点の調整
  if (page_count <= 5) {
    count_start = 1;
    count_end = page_count;
  } else {
    if (count_start < 1) {
      count_start = 1;
      count_end = 5;
    } else if (count_end > page_count) {
      count_start = page_count - 4;
      count_end = page_count;
    }
  }
  //配列から抜き出す個数の指定
  let array_start = (current - 1) * 20;
  let array_end = current * 20;
  if (array_end > array.length) {
    array_end = array.length;
  }
  from_end.innerText = `${array_start + 1}件目~${array_end}件目`;
  //リスト作成
  if (method === "log") {
    createLogList(array_start, array_end, array, tbody);
  } else if (method === "customer") {
    createCustomerList(array_start, array_end, array, tbody);
  }
  //ページングボタンの挿入
  for (let i = count_start; i <= count_end; i++) {
    const button = document.createElement("input");
    button.setAttribute("type", "button");
    button.classList.add("button");
    button.classList.add("paging");
    button.value = i;
    button.addEventListener("click", (e) => {
      createList(
        parseInt(e.target.value),
        array,
        parent,
        all_count_message,
        from_end,
        tbody,
        method
      );
    });
    if (current === i) {
      button.setAttribute("id", "current_button");
      button.classList.add("current");
    }
    parent.appendChild(button);
  }
}
//ログ
function createLogList(start, end, array, parent) {
  parent.innerText = "";
  for (let i = start; i < end; i++) {
    parent.appendChild(new CreateRow(i, array).executeLog());
  }
}
//顧客リスト
function createCustomerList(start, end, array, parent) {
  parent.innerText = "";
  for (let i = start; i < end; i++) {
    parent.appendChild(new CreateRow(i, array).executeCustomer());
  }
}
