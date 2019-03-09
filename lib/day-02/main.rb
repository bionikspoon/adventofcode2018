# frozen_string_literal: true

module Day02
  module Part1
    # @param id [String]
    def count_repeats(id)
      counter = Hash.new(0)

      id.each_char { |c| counter[c] += 1 }

      [counter.value?(2), counter.value?(3)]
    end

    # @param file [File]
    def checksum(file)
      # @type Array<String>
      repeats = file.each_line.map(&:strip).map { |id| count_repeats(id) }

      Results.new(
        count_if(repeats) { |item| item[0] },
        count_if(repeats) { |item| item[1] }
      )
    end

    def count_if(items)
      items.reduce(0) { |count, item| yield(item) ? count + 1 : count }
    end

    class Results
      attr_reader :two, :three, :checksum
      def initialize(two, three)
        @two = two
        @three = three
        @checksum = two * three
      end
    end
  end

  module Part2
    # @param left [String]
    # @param right [String]
    def similar?(left, right)
      strikes_remaining = 1
      left.each_char
          .zip(right.each_char)
          .each do |(l, r)|
            strikes_remaining -= 1 if l != r
            break false if strikes_remaining.negative?
          end && true
    end

    # @param left [String]
    # @param right [String]
    def find_similarities(left, right)
      left.each_char
          .zip(right.each_char)
          .map { |(l, r)| l if l == r }
          .compact
          .join
    end

    # @param file [File]
    def find_common_chars(file)
      combinations = file.each_line.map(&:strip).combination(2)

      combinations.each do |(l, r)|
        break find_similarities(l, r) if similar?(l, r)
      end
    end
  end
end
