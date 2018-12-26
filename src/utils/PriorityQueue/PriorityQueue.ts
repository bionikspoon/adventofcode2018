import Comparator from '../Comparator'
import { MinHeap } from '../Heap'

export default class PriorityQueue<T> extends MinHeap<T> {
  protected compare = new Comparator(
    function compare(this: PriorityQueue<T>, l: T, r: T) {
      if (this.priorities[l.toString()] === this.priorities[r.toString()]) {
        return 0
      }

      return this.priorities[l.toString()] < this.priorities[r.toString()]
        ? -1
        : 1
    }.bind(this)
  )

  private priorities: { [key: string]: number } = {}

  private compareValue = new Comparator(function compareValue(a: T, b: T) {
    if (a === b) return 0

    return a < b ? -1 : 1
  })

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
