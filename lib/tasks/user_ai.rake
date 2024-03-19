# lib/tasks/user_ai.rake

namespace :users do
  desc 'Count users who have signed in in the past 3 months and their last viewed behaviors and notes per month'
  task count_recent: :environment do
    three_months_ago = 3.months.ago
    count = User.where('last_sign_in_at > ?', three_months_ago).count

    # Init behavior and note counts
    behavior_counts = Hash.new(0)
    note_counts = Hash.new(0)

    # Fetch users who have signed in in the past 3 months
    User.where('last_sign_in_at > ?', three_months_ago).each do |user|
      last_behavior = user.viewed_behaviors.order(updated_at: :desc).first
      last_note = user.notes.order(updated_at: :desc).first

      # Increment behavior count if user has viewed any behaviors
      if last_behavior
        month = last_behavior.updated_at.strftime("%B")
        behavior_counts[month] += 1
      end

      # Increment note count if user has updated any notes
      if last_note
        month = last_note.updated_at.strftime("%B")
        note_counts[month] += 1
      end
    end

    File.open('user_behavior_and_note_counts.txt', 'w') do |file|
      file.puts "Number of users logged in the past 3 months: #{count}"
      
      # Write behavior counts per month to the file
      behavior_counts.each do |month, count|
        file.puts "#{month}"
        file.puts "  User last behavior viewed: #{count}"
        file.puts "  User last note updated: #{note_counts[month]}"
      end
    end
  end
end
