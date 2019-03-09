# frozen_string_literal: true

module Day02
  module Part1
    def count_repeats(id)
      counter = Hash.new(0)

      id.each_char { |c| counter[c] += 1 }

      [counter.value?(2), counter.value?(3)]
    end

    def checksum(file)
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
end
