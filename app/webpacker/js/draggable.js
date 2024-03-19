import "whatwg-fetch";
import "core-js/features/promise";
import "core-js/features/array/from";
import { csrfToken } from "@rails/ujs";
import { fetchStatus } from "./util";

export const setupDragDrop = () => {
  const startDrag = (event) => {
    event.currentTarget.classList.add("draggable--dragging");
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text", event.currentTarget.id);
  };

  const stopDrag = (event) => {
    event.currentTarget.classList.remove("draggable--dragging");
  };

  const allowDrop = (event) => {
    event.preventDefault();
    event.currentTarget.classList.add("droppable--hover");
  };

  const stopDrop = (event) => {
    event.currentTarget.classList.remove("droppable--hover");
  };

  const drop = (event) => {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const dragElement = document.getElementById(data);
    const { type, id: objectId } = dragElement.dataset;
    const [singular, plural] = type.split("|");
    const dropElement = event.currentTarget;
    const dragElementIndex = Array.from(
      dropElement.parentNode.children
    ).indexOf(dragElement);
    const dropElementIndex = Array.from(
      dropElement.parentNode.children
    ).indexOf(dropElement);
    const position =
      dragElementIndex > dropElementIndex ? "beforebegin" : "afterend";
    dropElement.insertAdjacentElement(position, dragElement);
    dropElement.classList.remove("droppable--hover");

    if (dragElementIndex !== dropElementIndex) {
      fetch(`/admin/program/${plural}/${objectId}.json`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRF-Token": csrfToken(),
        },
        body: JSON.stringify({
          [`curriculum_${singular}`]: {
            position: dropElementIndex + 1,
          },
        }),
      })
        .then((resp) => fetchStatus(resp))
        .catch((error) => {
          console.log("request failed", error);
        });
    }
  };

  const draggables = document.querySelectorAll("[draggable]");
  draggables.forEach((draggable) => {
    draggable.addEventListener("dragstart", startDrag);
    draggable.addEventListener("dragend", stopDrag);
    draggable.addEventListener("dragleave", stopDrop);
  });

  const droppables = document.querySelectorAll(".droppable");
  droppables.forEach((droppable) => {
    droppable.addEventListener("dragover", allowDrop);
    droppable.addEventListener("drop", drop);
  });
};
