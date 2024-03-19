require 'sidekiq/web'

Rails.application.routes.draw do
  mount Magic::Link::Engine, at: '/access'

  authenticate :user, lambda { |user| user.has_role?(:admin) } do
    mount Sidekiq::Web => '/sidekiq'
  end

  root to: 'curriculum/courses#index'

  devise_for :users,
             controllers: {
               registrations: :registrations,
               passwords: :passwords,
               sessions: :sessions,
               confirmations: :confirmations,
               omniauth_callbacks: :omniauth_callbacks
             }

  get '/users/access', to: redirect('/v2/users/access')
  get '/help', to: redirect('/v2/contact-us')
  get '/yearly-subscription', to: redirect('/v2/yearly-subscription')
  get '/contact-us', to: redirect('/v2/contact-us')
  get '/program/notes', to: redirect('/v2/program/notes')
  get '/program/events', to: redirect('/v2/program/events')
  get '/users/profile', to: redirect('/v2/users/profile')
  get '/program/course-navigation', to: redirect('/v2/program/course-navigation')
  get '/program/resources/study-groups', to: redirect('/v2/program/resources/study-groups')
  get '/program/resources', to: redirect('/v2/program/resources')
  get '/users/access/me', to: redirect('/v2/users/access/me')
  get '/users/access/team', to: redirect('/v2/users/access/team')
  get '/users/access/nonprofit', to: redirect('/v2/users/access/nonprofit')
  get '/users/access/direct', to: redirect('/v2/users/access/direct')
  get '/program/book-summaries', to: redirect('/v2/program/book-summaries')

  as :user do
    get 'users/confirmed', to: 'confirmations#redirect', as: :user_confirmed
    get 'users/profile', to: 'users#edit', as: :user_profile
    get 'users/access/(:user_type)',
        to: 'users#new',
        as: :new_user_access,
        constraints: EcommConstraint.new
    post 'users/watch/:behavior_id', to: 'users#watch', as: :user_watch
    get 'welcome/confirm' => 'high_voltage/pages#show', :id => 'welcome/confirm'
    get 'welcome/(:user_type)', to: 'curriculum/courses#index', as: :welcome
    get 'yearly-subscription' => 'high_voltage/pages#show',
        :id => 'subscription',
        :as => :subscription_details

    constraints PartnerConstraint.new do
      get '/:partner', to: 'sessions#new', sso: 1
    end
  end

  scope :conferences do
    get '/' => 'high_voltage/pages#show', :id => 'conferences'
    get '/*id' => 'curriculum/conferences#show', :as => :conference
  end

  resources :users, only: %i[edit update]
  resources :help_topics, path: 'help', only: [:index]
  resources :countries, only: [:index]
  resources :states, only: [:index]
  resources :user_quiz_question_answers, only: [:create]
  get 'contact-us' => 'high_voltage/pages#show',
      :id => 'contact',
      :as => :contact

  namespace :curriculum, path: 'program' do
    get 'resources', to: 'resource_categories#index', as: :resource_categories
    get 'book-summaries', to: 'book_summaries#index', as: :book_summaries
    get 'book-summaries/(:slug)',
        to: 'book_summaries#show',
        as: :show_book_summary
    get 'book-summaries/page/(:page)',
        to: 'book_summaries#index',
        as: :book_summaries_page
    get 'course-navigation' => '/high_voltage/pages#show',
        :id => 'course_navigation'
    get 'resources/study-groups' => 'study_groups#show',
        :id => 'resources/study-groups'
    get 'events', to: 'events#index', as: :events
    get 'events/(:slug)', to: 'events#show', as: :show_event

    shallow do
      constraints EcommConstraint.new do
        resources :orders, except: %i[create destroy] do
          member { resources :user_seats, path: 'seats' }
        end
        resources :subscription_orders, only: [:update]
        get 'subscriptions/new', to: 'orders#new', order_type: 'subscription'
      end
    
      get 'webinars/(:path)',
          to:
            redirect { |params, request|
              "/program/AL-Direct/#{request.params[:path]}"
            }
      resources :webinars,
                path: 'AL-Direct',
                only: %i[index new show],
                path_names: {
                  new: :join
                }
    end

    resources :bundles, only: %i[index show] do
      resources :behaviors, only: [:show] do
        shallow do
          resources :notes,
                    except: %i[show index destroy],
                    constraints: NotesConstraint.new
        end
      end
    end

    resources :courses, path: 'modules', only: %i[index show] do
      resources :behaviors, only: [:show] do
        shallow do
          resources :notes,
                    except: %i[show index destroy],
                    constraints: NotesConstraint.new
        end
      end

      member { resource :quiz, only: [:show] }

      resources :user_quiz_results, only: [:create]
    end

    resources :notes, only: [:index], constraints: NotesConstraint.new
  end

  namespace :admin do
    get '/' => 'pages#show', :id => 'admin/dashboard'
    resources :users, except: %i[new create]
    resources :user_invites, except: %i[edit show], path: 'invites'

    namespace :curriculum, path: 'program' do
      resources :webinars
      shallow do
        resources :webinars
        resources :behaviors do
          resources :exercises
          resources :examples
          resources :questions
          resources :behavior_maps
        end
      end

      resources :bundles do
        resources :bundle_courses,
                  only: %i[create index update destroy],
                  path: 'content'
        resources :courses, only: %i[new create]
      end

      resources :courses, path: 'modules' do
        resources :course_behaviors, only: %i[create index update destroy]
        resources :behaviors, only: %i[new create]
        shallow do
          resources :quizzes, path: 'quiz', except: %i[index show] do
            resources :quiz_questions, except: %i[index show] do
              resources :quiz_question_answers, except: %i[index show]
            end
          end
        end
      end

      resources :reports, only: %i[index show]
      resources :orders, only: [:index], constraints: EcommConstraint.new
      resources :behavior_orders,
                only: %i[index edit update],
                path: 'gifts',
                constraints: EcommConstraint.new
    end
  end

  namespace 'api' do
    resources :registrations, only: [:create], constraints: ApiConstraint.new
    namespace 'v1' do
      resources :users, only: [:create], constraints: ApiConstraint.new
      resources :user_profile
      resources :behaviors
      resources :sessions, only: [:create]
      resources :courses, only: [:create]
      resources :vidyard, only: [:create]
    end

    namespace 'v2' do
      resources :registrations, only: [:create]
      namespace 'admin' do
        resources :users do
          collection do
            post 'users'
            post 'user_invites'
            post 'user_details'
            post 'users_details'
            post 'update_user'
            post 'invite_users'
            get 'invitation_data'
            post 'destroy_invites'
            post 'destroy_users'
            post 'resend_invites'
            post 'confirmed_users'
          end
        end
        resources :courses do
          collection do
            get 'get_courses'
          end
        end
        resources :behaviors do
          collection do
            get 'get_behaviors'
          end
          resources :help_to_habit_extras, only: [:create, :update]
        end
        resources :help_to_habits do
          collection do
            post 'create_new'
            post 'delete_help_to_habit'
            post 'update_order'
          end
        end
      end
      resources :courses
      resources :behaviors do
        collection do
          post 'create'
          get 'get_behaviors'
          post 'get_behavior'
        end
      end
      resources :webinars
      resources :users do
        collection do
          get :time_zones
          get :user_access_data
          post :subscribe_to_h2h
          patch :update_h2h
          patch :update_queue_order
          post :watch
          post :set_phone_number
          post :generate_and_save_verification_code
          post :confirm_verification_code
          post :update_user
          post :update_user_data
          post :cancel_subscription
          post :process_resubscription
          post :podcast_cta
        end
      end
      resources :help_to_habits do
        collection do
          get :get_progresses
          get :get_users_progresses
          get :latest_completed_with_behavior_maps
          post :delete_progresses
          post :schedule_habit
          post :receive_sms
        end
      end
      resources :help_to_habit_progresses, only: [:update]
      resources :user_habits do
        collection do
          get 'all'
          post 'behavior_maps'
          get 'user_behavior_maps'
          post 'create_or_destroy'
          post 'get_habit'
        end
      end
      resources :notes do
        collection do
          get 'notes'
          post 'user_note'
          post 'create_note'
          post 'update_note'
          post 'destroy_note'
        end
      end
    end
  end



  get '/404', to: 'errors#not_found'
  get '/422', to: 'errors#unacceptable'
  get '/500', to: 'errors#internal_error'

  get '/v2', to: 'v2#index'
  get '/v2/*path', to: 'v2#index'
end
