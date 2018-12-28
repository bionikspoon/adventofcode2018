import Comparator from '../Comparator'
import { MinHeap } from '../Heap'

export default class PriorityQueue<T> extends MinHeap<T> {
  public priorities: { [key: string]: number } = {}
  protected compare: Comparator<T>

  private compareValue = new Comparator(function compareValue(a: T, b: T) {
    if (a === b) return 0

    return a < b ? -1 : 1
  })

  constructor(compareFn?: (l: T, R: T) => 0 | -1 | 1) {
    super()

    this.compare = new Comparator((compareFn || defaultCompareFn).bind(this))

    function defaultCompareFn(this: PriorityQueue<T>, l: T, r: T) {
      if (this.priorities[l.toString()] === this.priorities[r.toString()]) {
        return 0
      }

      return this.priorities[l.toString()] < this.priorities[r.toString()]
        ? -1
        : 1
    }
  }

  public add(item: T, priority = 0) {
    this.priorities[item.toString()] = priority
    super.add(item)
    return this
  }

  public changePriority(item: T, priority: number) {
    this.remove(item, this.compareValue)
    this.add(item, priority)

    return this
  }

  public hasValue(item: T) {
    return this.findByValue(item).length > 0
  }

  private findByValue(item: T) {
    return this.find(item, this.compareValue)
  }
}
