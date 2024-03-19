# lib/tasks/update_gift_expiry.rake

namespace :gift do
  desc 'Update expires_at for redeemed gifts to 1 year ahead of updated_at'
  task update_expiry: :environment do
    
    # Counter to keep track of the number of Gifts that were adjusted
    adjusted_gifts_count = 0

    # Find all Gift objects with the status of 'redeemed'
    Gift.redeemed.find_each do |gift|
      # Set the expires_at field to be 1 year ahead of the updated_at value
      new_expires_at = gift.updated_at + 1.year
      gift.expires_at = new_expires_at
      
      # Save the changes to the database
      if gift.save
        # Increment the counter by 1
        adjusted_gifts_count += 1
      else
        puts "Failed to update Gift with ID #{gift.id}. Errors: #{gift.errors.full_messages.join(', ')}"
      end
    end 
    
    # Display the number of Gifts that were adjusted
    puts "Number of Gifts that were adjusted: #{adjusted_gifts_count}"
  end
end
