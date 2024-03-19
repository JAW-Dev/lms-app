json.extract! curriculum_exercise,
              :id,
              :behavior_id,
              :title,
              :created_at,
              :updated_at
json.url admin_curriculum_exercise_url(curriculum_exercise, format: :json)
