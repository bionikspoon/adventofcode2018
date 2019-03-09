# frozen_string_literal: true

def sum_frequencies(file)
  file.each_line.map(&:to_i).sum
end

def find_duplicate(file)
  running_total = 0
  visited = { 0 => true }
  changes = file.each_line.map(&:to_i)

  changes.cycle.each do |change|
    running_total += change
    break if visited[running_total]

    visited[running_total] = true
  end

  running_total
end
