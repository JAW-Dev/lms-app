import "whatwg-fetch";
import throttle from "lodash/throttle";
import { fire } from "@rails/ujs";

require("./action-text");

const notesToggle = document.querySelector(".notes__toggle");
notesToggle.addEventListener("click", () =>
  notesToggle.parentNode.classList.toggle("notes--open")
);

const noteForm = document.querySelector("form");
const syncNote = () => fire(noteForm, "submit");

document.addEventListener("trix-change", throttle(syncNote, 2000));
