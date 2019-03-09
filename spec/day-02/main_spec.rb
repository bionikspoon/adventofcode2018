# frozen_string_literal: true

require 'day-02/main'

describe Day02::Part1 do
  include Day02::Part1

  describe '#count_repeats' do
    def self.test_count_repeats(input, expected)
      context "given input '#{input}'" do
        it 'counts repeat characters' do
          expect(count_repeats(input)).to eq expected
        end
      end
    end

    test_count_repeats('abcdef', [false, false])
    test_count_repeats('bababc', [true, true])
    test_count_repeats('abbcde', [true, false])
    test_count_repeats('abcccd', [false, true])
    test_count_repeats('aabcdd', [true, false])
    test_count_repeats('abcdee', [true, false])
    test_count_repeats('ababab', [false, true])
  end

  describe '#checksum' do
    def self.test_checksum(case_name, two, three, checksum)
      context "given input '#{case_name}'" do
        subject(:results) do
          input = with_input(case_name)
          checksum(input)
        end

        it "has '#{two}' ids with 2 repeats" do
          expect(results.two).to eql two
        end
        it "has '#{three}' ids with 3 repeats" do
          expect(results.three).to eql three
        end
        it "has a checksum of '#{checksum}'" do
          expect(results.checksum).to eql checksum
        end
      end
    end

    test_checksum('part-1-case-1.txt', 4, 3, 12)
    test_checksum('input.txt', 250, 24, 6000)
  end
end

def with_input(name)
  File.open(File.join(File.dirname(__FILE__), '__case__', name))
end
