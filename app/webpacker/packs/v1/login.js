import "whatwg-fetch";
import "core-js/features/promise";
import { csrfToken } from "@rails/ujs";
import { fetchStatus, showAlert } from "../../js/util";

// const login = document.getElementById("login");
// const loginMsg = document.getElementById("login-msg");
// const loginBtn = document.getElementById("login-btn");
// const loginForm = login.querySelector("form");

// loginForm.addEventListener("submit", (e) => {
//   const passwordField = loginForm.querySelector("[aria-hidden]");
//   if (passwordField.getAttribute("aria-hidden") === "true") {
//     e.preventDefault();
//     const { value: email } = document.getElementById("user_email");

//     loginBtn.setAttribute("disabled", true);

//     fetch("/api/v1/sessions.json", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//         "X-Requested-With": "XMLHttpRequest",
//         "X-CSRF-Token": csrfToken(),
//       },
//       body: JSON.stringify({ user: { email } }),
//     })
//       .then((resp) => fetchStatus(resp))
//       .then((resp) => resp.json())
//       .then(({ access_type: access }) => {
//         if (email.length && access !== "direct_access") {
//           passwordField.setAttribute("aria-hidden", false);
//           passwordField.classList.remove("hidden");
//           passwordField.classList.add(
//             "animate__animated",
//             "animate__fadeInDown",
//             "animate__faster"
//           );
//           passwordField.addEventListener("animationend", () => {
//             passwordField.querySelector("#user_password").focus();
//           });
//         } else {
//           login.classList.add(
//             "animate__animated",
//             "animate__fadeOutLeft",
//             "animate__faster"
//           );
//           login.addEventListener("animationend", () => {
//             login.classList.add("hidden");
//             loginMsg.classList.remove("hidden");
//             loginMsg.classList.add(
//               "animate__animated",
//               "animate__fadeInRight",
//               "animate__faster"
//             );
//           });
//         }
//       })
//       .catch(() => showAlert("Invalid email or password."))
//       .finally(() => loginBtn.removeAttribute("disabled"));
//   }
// });

// document.addEventListener("DOMContentLoaded", function () {
//   const emailField = document.getElementById("email_field");
//   const emailCheck = document.getElementById("email-check");
//   const passwordField = document.getElementById("password_field");
//   let delayTimer;

//   emailField.addEventListener("input", function () {
//     clearTimeout(delayTimer);

//     delayTimer = setTimeout(function () {
//       const email = emailField.value;

//       fetch("/api/v1/sessions.json", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//           "X-Requested-With": "XMLHttpRequest",
//           "X-CSRF-Token": csrfToken(),
//         },
//         body: JSON.stringify({ user: { email } }),
//       })
//         .then(function (response) {
//           if (response.ok) {
//             return response.json();
//           } else {
//             throw new Error("Network response was not ok");
//           }
//         })
//         .then(function (data) {
//           if (data.access_type) {
//             const alertContainer = document.getElementById(
//               "alert-message-container"
//             );
//             passwordField.disabled = false;
//             emailField.parentElement.style.borderColor = "#A7C400";
//             passwordField.parentElement.style.borderColor = "#A7C400";
//             emailCheck.classList.remove("hidden");
//             alertContainer.style.display = "none";
//             emailField.focus();
//           } else {
//             passwordField.disabled = true;
//             emailField.parentElement.style.borderColor = "#dfdfe0";
//             passwordField.parentElement.style.borderColor = "#dfdfe0";
//             emailCheck.classList.add("hidden");
//             alertContainer.style.diplay = "flex";
//             alertMessage.innerText = "Invalid Email";
//             emailField.focus();
//           }
//         })
//         .catch(function (error) {
//           const alertContainer = document.getElementById(
//             "alert-message-container"
//           );
//           const alertMessage = document.getElementById("alert-message");
//           passwordField.disabled = true;
//           emailField.parentElement.style.borderColor = "#dfdfe0";
//           passwordField.parentElement.style.borderColor = "#dfdfe0";
//           emailCheck.classList.add("hidden");
//           alertContainer.style.display = "flex";
//           alertMessage.innerText = "Invalid Email";
//           emailField.focus();
//         });
//     }, 1000);
//   });
// });

document.addEventListener("DOMContentLoaded", function() {
    const togglePassword = document.getElementById("toggle-password");
    const passwordField = document.getElementById("password_field");

    togglePassword.addEventListener("click", function() {
        if (passwordField.type === "password") {
        passwordField.type = "text";
        } else {
        passwordField.type = "password";
        }
    });
});