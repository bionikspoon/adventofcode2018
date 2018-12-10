export default function* combinations<T>(items: T[]): IterableIterator<[T, T]> {
  for (let i = 0; i < items.length; i++) {
    const left = items[i]
    for (let j = i + 1; j < items.length; j++) {
      const right = items[j]
      yield [left, right]
    }
  }
}
