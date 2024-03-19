json.extract! curriculum_course,
              :id,
              :title,
              :description,
              :created_at,
              :updated_at
json.url admin_curriculum_course_url(curriculum_course, format: :json)
