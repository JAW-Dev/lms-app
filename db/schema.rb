# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2023_12_28_003254) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "action_text_rich_texts", force: :cascade do |t|
    t.string "name", null: false
    t.text "body"
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["record_type", "record_id", "name"], name: "index_action_text_rich_texts_uniqueness", unique: true
  end

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.bigint "byte_size", null: false
    t.string "checksum", null: false
    t.datetime "created_at", null: false
    t.string "service_name", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "addresses", force: :cascade do |t|
    t.bigint "order_id", null: false
    t.string "type"
    t.string "line1"
    t.string "line2"
    t.string "city"
    t.bigint "state_id"
    t.bigint "country_id"
    t.string "zip"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "full_name"
    t.string "company_name"
    t.index ["country_id"], name: "index_addresses_on_country_id"
    t.index ["order_id"], name: "index_addresses_on_order_id"
    t.index ["state_id"], name: "index_addresses_on_state_id"
  end

  create_table "companies", force: :cascade do |t|
    t.string "name"
    t.string "line_one"
    t.string "line_two"
    t.string "city"
    t.string "zip"
    t.string "phone"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "slug"
    t.bigint "country_id"
    t.bigint "state_id"
    t.index ["country_id"], name: "index_companies_on_country_id"
    t.index ["slug"], name: "index_companies_on_slug", unique: true
    t.index ["state_id"], name: "index_companies_on_state_id"
  end

  create_table "countries", force: :cascade do |t|
    t.string "name"
    t.string "alpha2"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "curriculum_behavior_encouragements", force: :cascade do |t|
    t.bigint "behavior_id", null: false
    t.bigint "encouragement_id", null: false
    t.integer "position"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["behavior_id"], name: "index_curriculum_behavior_encouragements_on_behavior_id"
    t.index ["encouragement_id"], name: "index_curriculum_behavior_encouragements_on_encouragement_id"
  end

  create_table "curriculum_behavior_maps", force: :cascade do |t|
    t.bigint "behavior_id"
    t.text "description"
    t.string "image"
    t.integer "position"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["behavior_id"], name: "index_curriculum_behavior_maps_on_behavior_id"
  end

  create_table "curriculum_behaviors", force: :cascade do |t|
    t.string "title"
    t.text "description"
    t.string "slug"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.float "video_length", default: 0.0
    t.boolean "enabled", default: false
    t.string "sku"
    t.string "player_uuid"
    t.string "exercise_image"
    t.string "example_image"
    t.integer "price_cents", default: 0, null: false
    t.string "price_currency", default: "USD", null: false
    t.string "audio_uuid"
    t.string "subtitle"
    t.string "poster"
    t.integer "h2h_status", default: 0
  end

  create_table "curriculum_bundle_course_behaviors", force: :cascade do |t|
    t.bigint "bundle_course_id", null: false
    t.bigint "behavior_id", null: false
    t.integer "position"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["behavior_id"], name: "index_curriculum_bundle_course_behaviors_on_behavior_id"
    t.index ["bundle_course_id"], name: "index_curriculum_bundle_course_behaviors_on_bundle_course_id"
  end

  create_table "curriculum_bundle_courses", force: :cascade do |t|
    t.bigint "bundle_id", null: false
    t.bigint "course_id", null: false
    t.integer "position"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["bundle_id"], name: "index_curriculum_bundle_courses_on_bundle_id"
    t.index ["course_id"], name: "index_curriculum_bundle_courses_on_course_id"
  end

  create_table "curriculum_bundles", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.boolean "enabled", default: true
    t.string "sku"
    t.string "slug"
    t.bigint "company_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "image"
    t.string "subheading"
    t.index ["company_id"], name: "index_curriculum_bundles_on_company_id"
  end

  create_table "curriculum_course_behaviors", force: :cascade do |t|
    t.bigint "course_id", null: false
    t.bigint "behavior_id", null: false
    t.integer "position"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "is_additional_behavior", default: false
    t.index ["behavior_id"], name: "index_curriculum_course_behaviors_on_behavior_id"
    t.index ["course_id"], name: "index_curriculum_course_behaviors_on_course_id"
  end

  create_table "curriculum_courses", force: :cascade do |t|
    t.string "title"
    t.text "description"
    t.string "slug"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "position"
    t.boolean "enabled", default: false
    t.string "sku"
    t.string "poster"
    t.jsonb "options"
    t.index ["slug"], name: "index_curriculum_courses_on_slug", unique: true
  end

  create_table "curriculum_encouragements", force: :cascade do |t|
    t.string "title"
    t.boolean "enabled", default: true
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "attribution"
  end

  create_table "curriculum_examples", force: :cascade do |t|
    t.bigint "behavior_id"
    t.integer "position"
    t.text "description"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["behavior_id"], name: "index_curriculum_examples_on_behavior_id"
  end

  create_table "curriculum_exercises", force: :cascade do |t|
    t.bigint "behavior_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "position"
    t.text "description"
    t.string "image"
    t.index ["behavior_id"], name: "index_curriculum_exercises_on_behavior_id"
  end

  create_table "curriculum_notes", force: :cascade do |t|
    t.bigint "user_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "notable_type"
    t.bigint "notable_id"
    t.index ["notable_type", "notable_id"], name: "index_curriculum_notes_on_notable_type_and_notable_id"
    t.index ["user_id"], name: "index_curriculum_notes_on_user_id"
  end

  create_table "curriculum_questions", force: :cascade do |t|
    t.bigint "behavior_id"
    t.integer "position"
    t.text "description"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["behavior_id"], name: "index_curriculum_questions_on_behavior_id"
  end

  create_table "curriculum_quiz_question_answers", force: :cascade do |t|
    t.bigint "quiz_question_id", null: false
    t.text "content"
    t.integer "status", default: 0
    t.integer "position"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["quiz_question_id"], name: "index_curriculum_quiz_question_answers_on_quiz_question_id"
  end

  create_table "curriculum_quiz_questions", force: :cascade do |t|
    t.bigint "quiz_id", null: false
    t.text "content"
    t.integer "position"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["quiz_id"], name: "index_curriculum_quiz_questions_on_quiz_id"
  end

  create_table "curriculum_quizzes", force: :cascade do |t|
    t.bigint "course_id", null: false
    t.text "description"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["course_id"], name: "index_curriculum_quizzes_on_course_id"
  end

  create_table "curriculum_webinars", force: :cascade do |t|
    t.string "audio_uuid"
    t.string "player_uuid"
    t.string "title"
    t.string "subtitle"
    t.text "description"
    t.string "slug"
    t.float "video_length"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.datetime "presented_at"
    t.string "registration_link"
  end

  create_table "friendly_id_slugs", force: :cascade do |t|
    t.string "slug", null: false
    t.integer "sluggable_id", null: false
    t.string "sluggable_type", limit: 50
    t.string "scope"
    t.datetime "created_at"
    t.index ["slug", "sluggable_type", "scope"], name: "index_friendly_id_slugs_on_slug_and_sluggable_type_and_scope", unique: true
    t.index ["slug", "sluggable_type"], name: "index_friendly_id_slugs_on_slug_and_sluggable_type"
    t.index ["sluggable_type", "sluggable_id"], name: "index_friendly_id_slugs_on_sluggable_type_and_sluggable_id"
  end

  create_table "gifts", force: :cascade do |t|
    t.integer "status", default: 0
    t.bigint "order_id", null: false
    t.string "recipient_email"
    t.bigint "user_id"
    t.string "slug"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "anonymous", default: false
    t.string "recipient_name"
    t.text "message"
    t.datetime "expires_at"
    t.integer "valid_for_days"
    t.string "expiry_type", default: "limited"
    t.index ["order_id"], name: "index_gifts_on_order_id"
    t.index ["user_id"], name: "index_gifts_on_user_id"
  end

  create_table "h2_h_progresses", force: :cascade do |t|
    t.bigint "users_id", null: false
    t.bigint "curriculum_behaviors_id", null: false
    t.integer "progress"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "is_active", default: false
    t.index ["curriculum_behaviors_id"], name: "index_h2_h_progresses_on_curriculum_behaviors_id"
    t.index ["users_id"], name: "index_h2_h_progresses_on_users_id"
  end

  create_table "help_to_habit_extras", force: :cascade do |t|
    t.bigint "curriculum_behavior_id", null: false
    t.text "content"
    t.integer "placement"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["curriculum_behavior_id", "placement"], name: "index_h2h_extras_on_curriculum_behavior_id_and_placement", unique: true
    t.index ["curriculum_behavior_id"], name: "index_help_to_habit_extras_on_curriculum_behavior_id"
  end

  create_table "help_to_habit_progresses", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "curriculum_behavior_id", null: false
    t.integer "progress"
    t.boolean "is_active"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "queue_position", default: 0
    t.date "start_date"
    t.boolean "completed"
    t.string "sidekiq_job_id"
    t.index ["curriculum_behavior_id"], name: "index_help_to_habit_progresses_on_curriculum_behavior_id"
    t.index ["user_id"], name: "index_help_to_habit_progresses_on_user_id"
  end

  create_table "help_to_habits", force: :cascade do |t|
    t.text "content"
    t.integer "order"
    t.bigint "curriculum_behavior_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["curriculum_behavior_id"], name: "index_help_to_habits_on_curriculum_behavior_id"
  end

  create_table "order_behaviors", force: :cascade do |t|
    t.bigint "order_id", null: false
    t.bigint "behavior_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["behavior_id"], name: "index_order_behaviors_on_behavior_id"
    t.index ["order_id"], name: "index_order_behaviors_on_order_id"
  end

  create_table "order_courses", force: :cascade do |t|
    t.bigint "order_id", null: false
    t.bigint "course_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["course_id"], name: "index_order_courses_on_course_id"
    t.index ["order_id"], name: "index_order_courses_on_order_id"
  end

  create_table "orders", force: :cascade do |t|
    t.bigint "user_id"
    t.string "transaction_id"
    t.string "processor"
    t.integer "status", default: 0
    t.integer "qty", default: 1
    t.integer "subtotal_cents", default: 0, null: false
    t.string "subtotal_currency", default: "USD", null: false
    t.integer "sales_tax_cents", default: 0, null: false
    t.string "sales_tax_currency", default: "USD", null: false
    t.datetime "sold_at"
    t.text "notes"
    t.string "slug"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "type"
    t.integer "discount_cents", default: 0, null: false
    t.index ["user_id"], name: "index_orders_on_user_id"
  end

  create_table "profiles", force: :cascade do |t|
    t.bigint "user_id"
    t.string "first_name"
    t.string "last_name"
    t.string "avatar"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.jsonb "hubspot", default: {}
    t.boolean "opt_in", default: false
    t.string "phone"
    t.string "company_name"
    t.boolean "opt_out_eop", default: false
    t.string "phone_temp_verification_code"
    t.datetime "phone_temp_verification_code_expiration"
    t.boolean "phone_verified"
    t.integer "verification_code_requests", default: 0
    t.datetime "last_verification_code_request_at"
    t.string "scheduled_time"
    t.index ["user_id"], name: "index_profiles_on_user_id"
  end

  create_table "roles", id: :serial, force: :cascade do |t|
    t.string "name"
    t.string "resource_type"
    t.integer "resource_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["name", "resource_type", "resource_id"], name: "index_roles_on_name_and_resource_type_and_resource_id"
  end

  create_table "states", force: :cascade do |t|
    t.bigint "country_id"
    t.string "name"
    t.string "abbr"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["country_id"], name: "index_states_on_country_id"
  end

  create_table "user_behaviors", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "behavior_id"
    t.integer "status"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["behavior_id"], name: "index_user_behaviors_on_behavior_id"
    t.index ["user_id"], name: "index_user_behaviors_on_user_id"
  end

  create_table "user_habits", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "curriculum_behavior_map_id", null: false
    t.boolean "active", default: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["curriculum_behavior_map_id"], name: "index_user_habits_on_curriculum_behavior_map_id"
    t.index ["user_id"], name: "index_user_habits_on_user_id"
  end

  create_table "user_invite_courses", force: :cascade do |t|
    t.bigint "user_invite_id", null: false
    t.bigint "course_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["course_id"], name: "index_user_invite_courses_on_course_id"
    t.index ["user_invite_id"], name: "index_user_invite_courses_on_user_invite_id"
  end

  create_table "user_invites", force: :cascade do |t|
    t.integer "status", default: 0
    t.string "email"
    t.datetime "invited_at"
    t.bigint "user_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.datetime "expires_at"
    t.string "name"
    t.integer "access_type", default: 0
    t.bigint "invited_by_id"
    t.text "message"
    t.integer "valid_for_days"
    t.integer "discount_cents", default: 0, null: false
    t.string "user_access_type"
    t.boolean "unlimited_gifts"
    t.boolean "opt_out_eop", default: false
    t.text "expiration_type"
    t.text "length_type"
    t.index ["invited_by_id"], name: "index_user_invites_on_invited_by_id"
    t.index ["user_id"], name: "index_user_invites_on_user_id"
  end

  create_table "user_quiz_question_answers", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "quiz_question_id", null: false
    t.bigint "quiz_question_answer_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["quiz_question_answer_id"], name: "index_user_quiz_question_answers_on_quiz_question_answer_id"
    t.index ["quiz_question_id"], name: "index_user_quiz_question_answers_on_quiz_question_id"
    t.index ["user_id"], name: "index_user_quiz_question_answers_on_user_id"
  end

  create_table "user_quiz_results", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "quiz_id", null: false
    t.float "score"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["quiz_id"], name: "index_user_quiz_results_on_quiz_id"
    t.index ["user_id"], name: "index_user_quiz_results_on_user_id"
  end

  create_table "user_seats", force: :cascade do |t|
    t.bigint "user_id"
    t.string "email"
    t.bigint "order_id"
    t.integer "status"
    t.datetime "invited_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["email"], name: "index_user_seats_on_email"
    t.index ["order_id"], name: "index_user_seats_on_order_id"
    t.index ["user_id"], name: "index_user_seats_on_user_id"
  end

  create_table "user_texting_preferences", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.boolean "enabled", default: true
    t.string "time_of_day"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_user_texting_preferences_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet "current_sign_in_ip"
    t.inet "last_sign_in_ip"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "slug"
    t.bigint "company_id"
    t.jsonb "settings", default: {}, null: false
    t.string "sign_in_token"
    t.datetime "sign_in_token_sent_at"
    t.integer "access_type", default: 0
    t.string "customer_id"
    t.string "provider"
    t.string "uid"
    t.string "unconfirmed_email"
    t.string "user_access_type"
    t.boolean "opt_out_eop", default: false
    t.json "user_data", default: {}
    t.boolean "h2h_opt_out", default: false, null: false
    t.index ["company_id"], name: "index_users_on_company_id"
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["settings"], name: "index_users_on_settings", using: :gin
    t.index ["slug"], name: "index_users_on_slug", unique: true
  end

  create_table "users_roles", id: false, force: :cascade do |t|
    t.integer "user_id"
    t.integer "role_id"
    t.index ["user_id", "role_id"], name: "index_users_roles_on_user_id_and_role_id"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "addresses", "countries"
  add_foreign_key "addresses", "orders"
  add_foreign_key "addresses", "states"
  add_foreign_key "companies", "countries"
  add_foreign_key "companies", "states"
  add_foreign_key "curriculum_behavior_encouragements", "curriculum_behaviors", column: "behavior_id"
  add_foreign_key "curriculum_behavior_encouragements", "curriculum_encouragements", column: "encouragement_id"
  add_foreign_key "curriculum_behavior_maps", "curriculum_behaviors", column: "behavior_id"
  add_foreign_key "curriculum_bundle_course_behaviors", "curriculum_behaviors", column: "behavior_id"
  add_foreign_key "curriculum_bundle_course_behaviors", "curriculum_bundle_courses", column: "bundle_course_id"
  add_foreign_key "curriculum_bundle_courses", "curriculum_bundles", column: "bundle_id"
  add_foreign_key "curriculum_bundle_courses", "curriculum_courses", column: "course_id"
  add_foreign_key "curriculum_bundles", "companies"
  add_foreign_key "curriculum_course_behaviors", "curriculum_behaviors", column: "behavior_id"
  add_foreign_key "curriculum_course_behaviors", "curriculum_courses", column: "course_id"
  add_foreign_key "curriculum_examples", "curriculum_behaviors", column: "behavior_id"
  add_foreign_key "curriculum_exercises", "curriculum_behaviors", column: "behavior_id"
  add_foreign_key "curriculum_notes", "users"
  add_foreign_key "curriculum_questions", "curriculum_behaviors", column: "behavior_id"
  add_foreign_key "curriculum_quiz_question_answers", "curriculum_quiz_questions", column: "quiz_question_id"
  add_foreign_key "curriculum_quiz_questions", "curriculum_quizzes", column: "quiz_id"
  add_foreign_key "curriculum_quizzes", "curriculum_courses", column: "course_id"
  add_foreign_key "gifts", "orders"
  add_foreign_key "gifts", "users"
  add_foreign_key "h2_h_progresses", "curriculum_behaviors", column: "curriculum_behaviors_id"
  add_foreign_key "h2_h_progresses", "users", column: "users_id"
  add_foreign_key "help_to_habit_extras", "curriculum_behaviors"
  add_foreign_key "help_to_habit_progresses", "curriculum_behaviors"
  add_foreign_key "help_to_habit_progresses", "users"
  add_foreign_key "help_to_habits", "curriculum_behaviors"
  add_foreign_key "order_behaviors", "curriculum_behaviors", column: "behavior_id"
  add_foreign_key "order_behaviors", "orders"
  add_foreign_key "order_courses", "curriculum_courses", column: "course_id"
  add_foreign_key "order_courses", "orders"
  add_foreign_key "orders", "users"
  add_foreign_key "profiles", "users"
  add_foreign_key "states", "countries"
  add_foreign_key "user_behaviors", "curriculum_behaviors", column: "behavior_id"
  add_foreign_key "user_behaviors", "users"
  add_foreign_key "user_habits", "curriculum_behavior_maps"
  add_foreign_key "user_habits", "users"
  add_foreign_key "user_invite_courses", "curriculum_courses", column: "course_id"
  add_foreign_key "user_invite_courses", "user_invites"
  add_foreign_key "user_invites", "users"
  add_foreign_key "user_invites", "users", column: "invited_by_id"
  add_foreign_key "user_quiz_question_answers", "curriculum_quiz_question_answers", column: "quiz_question_answer_id"
  add_foreign_key "user_quiz_question_answers", "curriculum_quiz_questions", column: "quiz_question_id"
  add_foreign_key "user_quiz_question_answers", "users"
  add_foreign_key "user_quiz_results", "curriculum_quizzes", column: "quiz_id"
  add_foreign_key "user_quiz_results", "users"
  add_foreign_key "user_seats", "orders"
  add_foreign_key "user_seats", "users"
  add_foreign_key "user_texting_preferences", "users"
  add_foreign_key "users", "companies"
end
