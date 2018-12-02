import R from 'ramda'

export function checksum(input: string) {
  const counter = new Counter()

  input
    .trim()
    .split('\n')
    .map(line => letterCounts(line.trim()))
    .forEach(counts => {
      if (counts.has(2)) counter.add(2)
      if (counts.has(3)) counter.add(3)
    })

  return counter.getValue(2) * counter.getValue(3)
}

export function letterCounts(input: string) {
  return new Set(
    input
      .split('')
      .reduce((counter, letter) => counter.add(letter), new Counter())
      .deleteValue(1)
      .values()
  )
}

class Counter {
  private counts: { [key: string]: number }

  constructor() {
    this.counts = {}
  }

  public add(value: string | number) {
    const count = this.counts[value] ? this.counts[value] + 1 : 1

    this.counts = { ...this.counts, [value]: count }
    return this
  }

  public deleteValue(v: number) {
    this.counts = R.reject(R.equals(v), this.counts)

    return this
  }

  public getValue(key: string | number) {
    if (!this.counts[key]) return 0

    return this.counts[key]
  }

  public values() {
    return Object.values(this.counts)
  }
}
