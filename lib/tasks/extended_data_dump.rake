namespace :data do
  desc 'Extended dump of course data to file'
  task extended_dump: :environment do
    File.open('extended_course_data.txt', 'w') do |file|
      Curriculum::Course.includes(:behaviors).order(:position).each do |course|
        file.puts "Course ID: #{course.id}, Course Title: #{course.title}, Course Position: #{course.position}"
        course.behaviors.each do |behavior|
          file.puts "  Behavior ID: #{behavior.id}, Behavior Title: #{behavior.title}, Player UUID: #{behavior.player_uuid}"

          file.puts "       Behavior Maps"
          behavior.behavior_maps.each do |behavior_map|
            file.puts "         Behavior Map ID: #{behavior_map.id}, Position: #{behavior_map.position}, Description: #{behavior_map.description}"
          end

          file.puts "       Questions"
          behavior.questions.each do |question|
            file.puts "         Question ID: #{question.id}, Position: #{question.position}, Description: #{question.description}"
          end

          file.puts "       Examples"
          behavior.examples.each do |example|
            file.puts "         Example ID: #{example.id}, Position: #{example.position}, Description: #{example.description}"
          end

          file.puts "       Exercises"
          behavior.exercises.each do |exercise|
            file.puts "         Exercise ID: #{exercise.id}, Position: #{exercise.position}, Description: #{exercise.description}"
          end
        end
      end
    end
  end
end
