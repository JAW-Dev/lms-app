class Messenger < ApplicationMailer
  helper :order

  delegate :simple_format, to: 'ActionController::Base.helpers'

  def customer_order_confirmation(order)
    @order = OrderPresenter.new(order)

    mail(
      to: @order.user.email,
      subject: "Order confirmation for \"#{@order.title}\""
    )
  end

  def admin_order_notification(order)
    @order = OrderPresenter.new(order)

    mail(
      to: 'support@admiredleadership.com',
      bcc: 'pat.burke+ald@carney.co',
      subject: "Order received for \"#{@order.title}\""
    )
  end

  def seat_invitation(user_seat)
    @user_seat = user_seat
    @order = OrderPresenter.new(@user_seat.order)
    @rep = ProfilePresenter.new(@order.user.profile)

    mail(
      to: @user_seat.email,
      subject: "You've been given access to \"#{@order.title}\""
    )
  end

  def gift_confirmation(gift)
    order = OrderPresenter.new(gift.order)
    sender = ProfilePresenter.new(order.user.profile)
    subject = gift.anonymous? ? 'Someone' : "#{sender.full_name}"
    subject << ' has sent you a free Admired Leadership behavior video!'

    if !mailgun_active
      mail(
        to: gift.recipient_email,
        subject: subject,
        body: new_user_access_url(user_type: 'gift', g: gift.slug)
      )
    else
      mail(to: gift.recipient_email, subject: subject, body: '')
        .tap do |message|
        message.mailgun_template = 'gift-confirmation'
        message.mailgun_headers = {
          'X-Mailgun-Variables':
            JSON.generate(
              {
                recipient_name: gift&.recipient_name&.titlecase,
                anonymous: gift.anonymous,
                sender_name: gift.anonymous? ? 'Someone' : sender.full_name,
                order_title: order.title,
                gift_access_url:
                  new_user_access_url(user_type: 'gift', g: gift.slug),
                message:
                  (simple_format(gift.message.strip) if gift.message&.presence)
              }
            )
        }
      end
    end
  end

  def admin_invitation(email, invitation = nil)
    existing_user = User.find_by_email(email)
    name = invitation&.name || existing_user&.profile&.first_name

    if !mailgun_active
      mail(
        to: email,
        subject: 'Your Invitation to Admired Leadership',
        body:
          if existing_user.present?
            new_user_session_url
          else
            new_user_registration_url
          end
      )
    else
      mail(
        to: email,
        subject: 'Your Invitation to Admired Leadership',
        body: ''
      ).tap do |message|
        message.mailgun_template = 'invitation'
        message.mailgun_headers = {
          'X-Mailgun-Variables':
            JSON.generate(
              {
                root_url: root_url,
                name: name&.titlecase,
                existing_user: existing_user.present?,
                message:
                  (
                    if invitation&.message&.presence
                      simple_format(invitation&.message.strip)
                    end
                  )
              }
            )
        }
      end
    end
  end

  def welcome(
    email,
    name,
    full_access_invitation = false,
    personalized_message = nil
  )
    mail(to: email, subject: 'Welcome to Admired Leadership', body: '')
      .tap do |message|
      message.mailgun_template = 'welcome'
      message.mailgun_headers = {
        'X-Mailgun-Variables':
          JSON.generate(
            {
              root_url: root_url,
              name: name&.titlecase,
              course_navigation_link: curriculum_course_navigation_url,
              full_access_invitation: full_access_invitation,
              message:
                (
                  if personalized_message&.presence
                    simple_format(personalized_message.strip)
                  end
                )
            }
          )
      }
    end
  end

  def renewal_complete(subscription_order)
    @order = OrderPresenter.new(subscription_order)

    if !mailgun_active
      mail(
        to: @order.user.email,
        subject: 'Your Admired Leadership account has been renewed',
        body: root_url
      )
    else
      mail(
        to: @order.user.email,
        subject: 'Your Admired Leadership account has been renewed',
        body: ''
      ).tap do |message|
        message.mailgun_template = 'renewal-complete'
        message.mailgun_headers = {
          'X-Mailgun-Variables':
            JSON.generate(
              { name: @order.user&.profile&.first_name, root_url: root_url }
            )
        }
      end
    end
  end

  def renewal_reminder(subscription_order)
    @order = OrderPresenter.new(subscription_order)

    if !mailgun_active
      mail(
        to: @order.user.email,
        subject: 'Renew Your Admired Leadership Account',
        body: subscription_details_url
      )
    else
      mail(
        to: @order.user.email,
        subject: 'Renew Your Admired Leadership Account',
        body: ''
      ).tap do |message|
        message.mailgun_template = 'renewal-notice'
        message.mailgun_headers = {
          'X-Mailgun-Variables':
            JSON.generate(
              { name: @order.user&.profile&.first_name, root_url: root_url }
            )
        }
      end
    end
  end

  def initial_h2h_sign_up(user)
    first_name = user.profile&.first_name || ''
    mail(
      to: user.email,
      subject: 'Welcome to Help To Habit!',
      body: ''
    ).tap do |message|
      message.mailgun_template = 'h2h_welcome'
      message.mailgun_headers = {
        'X-Mailgun-Variables': JSON.generate(
          { first_name: first_name }
        )
      }
    end
  end


  def h2h_weekly_recap(habits, week, user, behavior_title)
    first_name = user.profile&.first_name || ''
    mailgun_variables = {
      week: week,
      first_name: first_name,
      behavior_title: behavior_title
    }

    # Add each habit as a separate variable
    (1..7).each do |index|
      if habits[index-1]
        mailgun_variables["help_to_habit_#{index}"] = habits[index-1]
        mailgun_variables["display_setting_#{index}"] = 'block'
      else
        mailgun_variables["display_setting_#{index}"] = 'none'
      end
    end

    mail(
      to: user.email, # Replace this with the recipient's email
      subject: 'Help to Habit Weekly Recap',
      body: ''
    ).tap do |message|
      message.mailgun_template = 'h2h_weekly_recap'
      message.mailgun_headers = {
        'X-Mailgun-Variables': JSON.generate(mailgun_variables)
      }
    end
  end

  def h2h_final(user ,behavior_title)
    mail(
      to: user.email,
      subject: 'Reminders complete for ' + behavior_title,
      body: ''
    ).tap do |message|
      message.mailgun_template = 'h2h_final'
      message.mailgun_headers = {
        'X-Mailgun-Variables': JSON.generate(
          { behavior_title: behavior_title }
        )
      }
    end
  end

  def h2h_opt_out(user)
    mail(
      to: user.email,
      subject: 'How to reactivate Help to Habit reminders',
      body: ''
    ).tap do |message|
      message.mailgun_template = 'h2h_opt_out'
    end
  end
end