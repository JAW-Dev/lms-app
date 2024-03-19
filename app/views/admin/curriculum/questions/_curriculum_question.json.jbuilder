json.extract! curriculum_question,
              :id,
              :behavior_id,
              :title,
              :created_at,
              :updated_at
json.url admin_curriculum_question_url(curriculum_question, format: :json)
