class AddVerificationCodeFieldsToProfiles < ActiveRecord::Migration[6.1]
  def change
    add_column :profiles, :verification_code_requests, :integer, default: 0
    add_column :profiles, :last_verification_code_request_at, :datetime
  end
end
