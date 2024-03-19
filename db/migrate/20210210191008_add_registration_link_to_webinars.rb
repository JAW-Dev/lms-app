class AddRegistrationLinkToWebinars < ActiveRecord::Migration[6.0]
  def change
    add_column :curriculum_webinars, :registration_link, :string
  end
end
