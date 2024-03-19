require("trix");
require("@rails/actiontext");

document.addEventListener("trix-initialize", () => {
  const numList = document.querySelector(
    "trix-toolbar .trix-button--icon-number-list"
  );
  numList.insertAdjacentHTML(
    "afterend",
    '<button type="button" class="trix-button trix-button--print" title="Print" tabindex="-1"><i class="far fa-print"></i></button>'
  );

  const printNotes = document.querySelector(".trix-button--print");
  printNotes.addEventListener("click", () => window.print());
});
