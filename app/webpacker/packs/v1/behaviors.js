import React from "react";
import { render } from "react-dom";
import { toggleAccordion } from "../../js/accordion";
import { QuestionCircle } from "../../js/questions";

const { hash: selectedBehavior } = window.location;

if (selectedBehavior.length) {
  const behavior = document.querySelector(selectedBehavior);
  const accordion = behavior.querySelector("[data-accordion]");
  const panel = accordion.nextElementSibling;

  if (accordion && panel) {
    toggleAccordion(accordion, panel);
  }
}

const circleQuestions = document.querySelectorAll(".discussion-questions");
circleQuestions.forEach((circle) => {
  const { questions } = circle.dataset;
  const questionsJSON = JSON.parse(questions);

  render(<QuestionCircle questions={questionsJSON} />, circle);
});
