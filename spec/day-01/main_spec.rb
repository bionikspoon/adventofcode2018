require 'day-01/main'

describe 'Day 01' do
  it 'sum frequencies' do
    File.open(File.join(File.dirname(__FILE__), './input.txt'), 'r') do |file|
      expect(sum_frequencies(file)).to be 585
    end
  end
end
