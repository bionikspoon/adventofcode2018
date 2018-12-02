import R from 'ramda'

export default class Counter {
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
