"use strict";
//便利ツールたち

exports.module = () => {
  //数字を2桁0埋めに
  function toDoubleDigits(num) {
    num += "";
    if (num.length === 1) {
      num = "0" + num;
    }
    return num;
  }

  //サニタイズなどをまとめて行うクラス
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
        //&は除外
        str = str
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
      return this.str[0].replace(/-/g, "/");
    }

    convertTelephone() {
      return `${this.args[0]}-${this.args[1]}-${this.args[2]}`;
    }
  }

  //検証用クラス
  class Validator {
    constructor() {}
    validateRequired(str) {
      str = str.trim();
      if (!str) {
        throw "入力項目に抜けがある、もしくは空白のみ入力されています";
      }
    }
    validatePassword(str) {
      str = str.trim();
      if (!str) {
        throw "入力項目に抜け、もしくは空白のみ入力されています";
      } else if (!str.match(/^(?=.*[A-Z])(?=.*[.?/-])[a-zA-Z0-9.?/-]{8,}$/)) {
        throw "パスワードが指定の形式で入力されていません";
      }
    }
    validateMail(str) {
      if (!str) {
        throw "入力項目に抜け、もしくは空白のみ入力されています";
      } else if (!str.match(/^.+@artifacture.co.jp$/)) {
        throw "許可されていないメールアドレスです";
      }
    }
  }

  //タイムスタンプと日時を生成するクラス
  class GetDateTime {
    constructor() {
      this.timestamp = Date.now();
      this.datetime = new Date(this.timestamp);
      this.date = `${this.datetime.getFullYear()}/${toDoubleDigits(
        this.datetime.getMonth() + 1
      )}/${toDoubleDigits(this.datetime.getDate())}`;
      this.time = `${this.datetime.getHours()}:${toDoubleDigits(
        this.datetime.getMinutes()
      )}:${toDoubleDigits(this.datetime.getSeconds())}`;
    }
    getTimestamp() {
      return this.timestamp;
    }
    getDate() {
      return this.date;
    }
    getTime() {
      return this.time;
    }
  }
};
