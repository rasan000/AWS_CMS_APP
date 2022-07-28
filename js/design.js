"use strict";
//共有するデザイン関係の関数やクラス

//ポップアップウィンドウ
class ModalWindow {
  constructor(area, back, popup, close) {
    this.area = area;
    this.back = back;
    this.popup = popup;
    this.close = close;
  }
  assignment() {
    this.popup.addEventListener(
      "click",
      () => (this.area.style.display = "grid")
    );
    this.close.addEventListener(
      "click",
      () => (this.area.style.display = "none")
    );
    this.back.addEventListener(
      "click",
      () => (this.area.style.display = "none")
    );
  }
}

//トグルウィンドウ
class ToggleWindow {
  constructor(open, close, window, back) {
    this.open = open;
    this.close = close;
    this.window = window;
    this.back = back;
  }
  assignment() {
    this.open.addEventListener("click", () => {
      this.window.classList.remove("d-none");
      this.window.classList.remove("to-left");
      this.window.classList.add("from-left");
    });
    this.close.addEventListener("click", () => {
      this.window.classList.remove("from-left");
      this.window.classList.add("to-left");
    });
  }
}
