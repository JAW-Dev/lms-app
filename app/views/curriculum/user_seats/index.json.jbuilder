json.remaining @remaining
json.seats do
  json.array! @user_seats, partial: 'curriculum/user_seats/user_seat', as: :seat
end
