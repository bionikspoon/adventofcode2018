export default function product<T>(items: T[]): Array<[T, T]> {
  return Array.from(iterateProduct(items))
}

function* iterateProduct<T>(items: T[]): IterableIterator<[T, T]> {
  for (const I of items) {
    for (const J of items) {
      yield [I, J]
    }
  }
}
