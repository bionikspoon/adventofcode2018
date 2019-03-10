# frozen_string_literal: true

require 'day-01/main'

describe 'Day 01' do
  describe 'Part 1' do
    def self.test_sum_frequencies(case_name, expected)
      context "given input '#{case_name}'" do
        it "has a frequency sum of #{expected}" do
          with_input(case_name) do |file|
            expect(sum_frequencies(file)).to eq expected
          end
        end
      end
    end

    test_sum_frequencies 'input.txt', 585
    test_sum_frequencies 'part-1-case-1.txt', 3
    test_sum_frequencies 'part-1-case-2.txt', 0
    test_sum_frequencies 'part-1-case-3.txt', -6
  end

  describe 'Part 2' do
    def self.test_find_duplicate(case_name, expected)
      context "given input '#{case_name}'" do
        it "finds the first duplicate frequency of #{expected}" do
          with_input(case_name) do |file|
            expect(find_duplicate(file)).to eq expected
          end
        end
      end
    end

    test_find_duplicate 'input.txt', 83_173
    test_find_duplicate 'part-2-case-1.txt', 0
    test_find_duplicate 'part-2-case-2.txt', 10
    test_find_duplicate 'part-2-case-3.txt', 5
    test_find_duplicate 'part-2-case-4.txt', 14
  end

  def with_input(name)
    File.open(File.join(File.dirname(__FILE__), '__case__', name)) do |file|
      yield file
    end
  end
end
