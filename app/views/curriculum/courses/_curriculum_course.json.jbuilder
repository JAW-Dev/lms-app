json.extract! curriculum_course, :title, :description, :slug, :created_at
json.behaviors curriculum_course.behaviors.enabled,
               :title,
               :description,
               :slug,
               :created_at
json.url curriculum_course_url(curriculum_course, format: :json)
