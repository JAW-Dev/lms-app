json.extract! curriculum_behavior_map,
              :id,
              :behavior_id,
              :title,
              :created_at,
              :updated_at
json.url admin_curriculum_behavior_map_url(
           curriculum_behavior_map,
           format: :json
         )
