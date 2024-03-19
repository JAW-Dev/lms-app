json.extract! seat, :id, :email, :status
json.invited_at l(seat.invited_at, format: :short_with_year)
if seat&.user&.confirmed?
  json.activated_at l(seat.user.confirmed_at, format: :short_with_year)
end
