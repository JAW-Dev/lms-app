require 'rails_helper'

RSpec.describe NameCleaner do
  it 'returns a correctly formatted name' do
    test_cases = [
      { first: 'JOE', last: 'Fox', correct: 'Joe Fox' },
      { first: 'Lebron', last: 'James', correct: 'Lebron James' },
      { first: 'keegan', last: "o'malley", correct: "Keegan O'Malley" },
      { first: 'JANE', last: 'VAN DER HOUSEN', correct: 'Jane van der Housen' },
      { first: 'JOAN', last: 'Von Dutch', correct: 'Joan von Dutch' },
      { first: 'chico', last: "D'Amico", correct: "Chico D'Amico" },
      { first: 'TOM', last: 'STCLAIR', correct: 'Tom StClair' },
      { first: 'william', last: 'macdonald', correct: 'William MacDonald' },
      { first: 'Jesse', last: "O'hixson", correct: "Jesse O'Hixson" }
    ]

    test_cases.each do |test_names|
      names = NameCleaner.new(test_names[:first], test_names[:last])
      expect("#{names.clean_first_name} #{names.clean_last_name}").to eq(
        test_names[:correct]
      )
    end
  end
end
