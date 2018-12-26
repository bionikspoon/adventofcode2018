type CompareFn<T> = (l: T, r: T) => 0 | -1 | 1

export default class Comparator<T> {
  private static defaultCompareFunction<T>(l: T, r: T) {
    if (l === r) return 0

    return l < r ? -1 : 1
  }
  private compare: CompareFn<T>
  constructor(fn?: CompareFn<T>) {
    this.compare = fn || Comparator.defaultCompareFunction
  }

  public equal(l: T, r: T) {
    return this.compare(l, r) === 0
  }
  public lessThan(l: T, r: T) {
    return this.compare(l, r) < 0
  }
  public greaterThan(l: T, r: T) {
    return this.compare(l, r) > 0
  }
  public lessThanOrEqual(l: T, r: T) {
    return this.lessThan(l, r) || this.equal(l, r)
  }
  public greaterThanOrEqual(l: T, r: T) {
    return this.greaterThan(l, r) || this.equal(l, r)
  }
  public reverse() {
    const compareOriginal = this.compare
    this.compare = (l, r) => compareOriginal(r, l)
    return this
  }
}
