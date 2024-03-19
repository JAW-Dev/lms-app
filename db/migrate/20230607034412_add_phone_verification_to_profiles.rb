class AddPhoneVerificationToProfiles < ActiveRecord::Migration[6.1]
  def change
    add_column :profiles, :phone_temp_verification_code, :string
    add_column :profiles, :phone_temp_verification_code_expiration, :datetime
    add_column :profiles, :phone_verified, :boolean
  end
end
