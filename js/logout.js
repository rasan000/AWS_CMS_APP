"use strict";

window.addEventListener("DOMContentLoaded", () => {
  const logout_button = document.getElementById("logout_button");
  const logout_button_toggle = document.getElementById("logout_button_toggle");

  logout_button.addEventListener("click", logoutAction);
  if (logout_button_toggle) {
    logout_button_toggle.addEventListener("click", logoutAction);
  }
});

function logoutAction() {
  try {
    sessionStorage.removeItem("IdToken");
    location.replace("./login.html");
  } catch (error) {
    console.log(error);
  }
}
