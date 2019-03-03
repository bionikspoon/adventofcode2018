require 'day-01/main'

describe Sample do
  it 'says hello' do
    sample = Sample.new
    expect(sample.hello).to be nil
  end
end
