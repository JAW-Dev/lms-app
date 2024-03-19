class Curriculum::QuizQuestionAnswerPresenter < BasePresenter
  def status_icon
    object.correct? ? 'fas fa-check-square' : 'fas fa-times-square'
  end

  def bg_class(user, quiz_complete)
    classnames = ['answer']
    classnames << 'answer--chosen' if current_user.quiz_answers.include?(object)
    if current_user.quiz_answers.include?(object) && object.correct? &&
         quiz_complete
      classnames << 'answer--correct'
    end
    if current_user.quiz_answers.include?(object) && object.incorrect? &&
         quiz_complete
      classnames << 'answer--incorrect'
    end

    classnames.join(' ')
  end
end
