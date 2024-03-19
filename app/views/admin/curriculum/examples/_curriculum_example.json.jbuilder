json.extract! curriculum_example,
              :id,
              :behavior_id,
              :title,
              :created_at,
              :updated_at
json.url admin_curriculum_example_url(curriculum_example, format: :json)
