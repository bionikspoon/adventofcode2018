import cycle from '../cycle'

test('it cycles an array', () => {
  const generator = cycle([1, 2, 3])

  expect(take(5, generator)).toEqual([1, 2, 3, 1, 2])
})
test('it cycles an array', () => {
  const generator = cycle([1, 2, 3])

  expect(take(1, generator)).toEqual([1])
})

const take = <T>(n: number, gen: IterableIterator<T>) => {
  const results = []

  for (const value of gen) {
    results.push(value)

    if (results.length >= n) break
  }

  return results
}
