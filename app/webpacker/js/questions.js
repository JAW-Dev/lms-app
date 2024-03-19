import React, { useState } from "react";
import classNames from "classnames";

// const Question = ({content})

export const QuestionCircle = ({ questions }) => {
  const [selected, setSelected] = useState(0);
  const { description: activeQuestion } = questions[selected];
  const navItems = questions.map((question, index) => (
    <li
      key={question.id}
      className={classNames("circle-nav__item", {
        "circle-nav__item--active": index === selected,
      })}
      onClick={() => setSelected(index)}
      onKeyPress={() => setSelected(index)}
      tabIndex="0"
    >
      <span className="circle-nav__button">{index + 1}</span>
    </li>
  ));
  return (
    <div className="md:my-8 question-circle">
      <div className="question-circle__inner">
        <p>{activeQuestion}</p>
        <ul className="circle-nav">{navItems}</ul>
      </div>
    </div>
  );
};
