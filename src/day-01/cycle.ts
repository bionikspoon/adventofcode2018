export default function* cycle<T>(items: T[]) {
  if (items.length <= 0) {
    throw new Error('Cycle(items): items must have length > 0')
  }

  let i = 0

  while (true) {
    yield items[i]

    if (i >= items.length - 1) {
      i = 0
    } else {
      i++
    }
  }
}
