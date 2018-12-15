export default function combinations<T>(items: T[]): Array<[T, T]> {
  return Array.from(iterateCombinations(items))
}

function* iterateCombinations<T>(items: T[]): IterableIterator<[T, T]> {
  for (let i = 0; i < items.length; i++) {
    const I = items[i]
    for (let j = i + 1; j < items.length; j++) {
      const J = items[j]
      yield [I, J]
    }
  }
}
