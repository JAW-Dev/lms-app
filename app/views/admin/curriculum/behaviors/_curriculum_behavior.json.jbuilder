json.extract! curriculum_behavior,
              :id,
              :course_id,
              :title,
              :description,
              :created_at,
              :updated_at
json.url curriculum_behavior_url(curriculum_behavior, format: :json)
