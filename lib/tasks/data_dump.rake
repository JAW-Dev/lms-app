namespace :data do
  desc 'Dump course data to file'
  task dump: :environment do
    File.open('course_data.txt', 'w') do |file|
      Curriculum::Course.includes(:behaviors).order(:position).each do |course|
        file.puts "Course ID: #{course.id}, Course Title: #{course.title}, Course Position: #{course.position}"
        course.behaviors.each do |behavior|
          file.puts "  Behavior ID: #{behavior.id}, Behavior Title: #{behavior.title}, Player UUID: #{behavior.player_uuid}"
        end
      end
    end
  end
end