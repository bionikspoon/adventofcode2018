import Heap from './Heap'

export default class MinHeap<T> extends Heap<T> {
  protected pairIsInCorrectOrder(l: T, r: T): boolean {
    return this.compare.lessThanOrEqual(l, r)
  }
}
