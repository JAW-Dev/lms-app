document.body.addEventListener("ajax:success", (event) => {
  const [data] = event.detail;
  const { answer_id: id, question_id: question, _status } = data;
  const answers = document
    .getElementById(`question-${question}`)
    .querySelectorAll("ol li a");
  answers.forEach((answer) => answer.classList.remove("answer--chosen"));
  document.getElementById(`answer-${id}`).classList.add("answer--chosen");

  const allQuestions = document.querySelectorAll(".quiz-question");
  const allAnswers = document.querySelectorAll(".answer--chosen");

  if (allQuestions.length === allAnswers.length) {
    document.getElementById("quiz-submit").classList.remove("hidden");
  }
});

document.body.addEventListener("ajax:error", () => {
  // eslint-disable-next-line no-alert
  alert("An error occurred with this question. Please try again.");
});
