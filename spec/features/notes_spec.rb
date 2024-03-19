require 'rails_helper'
require 'faker'

feature 'User' do
  before :each do
    @user = create(:user)
    @user.confirm

    @course = create(:curriculum_course)
    @behavior = create(:curriculum_behavior)
    @course.behaviors << @behavior
  end

  scenario 'adds a note to a video', js: true do
    @order = create(:course_order, user: @user)
    @order.courses << @course

    processor = PaymentService.new('SuccessProcessor')
    result = processor.process_sale(@order)

    sign_in @user
    visit curriculum_course_behavior_path(@course, @behavior)

    note = Curriculum::Note.find_or_create_by(user: @user, notable: @behavior)
    content = Faker::Lorem.sentence
    find('.notes__toggle').click
    find('trix-editor').click.set(content)

    expect { note.reload.content }.to become_truthy
    expect { note.reload.content.to_plain_text == content }.to become_truthy
  end

  scenario 'views notes on behaviors' do
    @behavior2 = create(:curriculum_behavior)
    @course.behaviors << @behavior2

    @order = create(:course_order, user: @user)
    @order.courses << @course

    processor = PaymentService.new('SuccessProcessor')
    result = processor.process_sale(@order)

    note1 = create(:curriculum_note, user: @user, notable: @behavior)
    note2 = create(:curriculum_note, user: @user, notable: @behavior2)

    sign_in @user
    visit curriculum_notes_path

    find(:xpath, " //h3[normalize-space()='#{@behavior2.title}']").click

    expect(page).to have_content @course.title
    expect(page).to have_content @behavior.title
    expect(page).to have_content @behavior2.title
    expect(page).to have_content @behavior2.notes.last.content.to_plain_text
  end
end
