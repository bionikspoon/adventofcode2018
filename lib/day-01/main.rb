def sum_frequencies(file)
  sum = 0
  file.each_line do |line|
    sum += line.to_i
  end

  sum
end
