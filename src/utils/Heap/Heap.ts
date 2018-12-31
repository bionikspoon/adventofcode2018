import Comparator from '../Comparator'

export default abstract class Heap<T> {
  protected compare: Comparator<T>
  private heapContainer: T[] = []

  constructor(readonly comparatorFn?: Comparator<T>['compare']) {
    this.compare = new Comparator<T>(comparatorFn)
  }

  public isEmpty() {
    return !this.heapContainer.length
  }

  public poll() {
    if (this.heapContainer.length === 0) return null
    if (this.heapContainer.length === 1) return this.heapContainer.pop()!

    let item
    ;[item, this.heapContainer[0]] = [
      this.heapContainer[0],
      this.heapContainer.pop()!,
    ]

    this.heapifyDown()

    return item
  }

  public peek() {
    return this.heapContainer[0] || null
  }

  public find(value: T, comparator = this.compare) {
    const hits: number[] = []

    for (let i = 0; i < this.heapContainer.length; i++) {
      const potentialHit = this.heapContainer[i]

      if (comparator.equal(potentialHit, value)) hits.push(i)
    }

    return hits
  }

  public add(value: T) {
    this.heapContainer.push(value)
    this.heapifyUp()

    return this
  }

  public remove(value: T, comparator = this.compare) {
    const numberOfItemsToRemove = this.find(value, comparator).length

    for (let i = 0; i < numberOfItemsToRemove; i++) {
      const indexToRemove = this.find(value, comparator).pop()!

      if (indexToRemove === this.heapContainer.length - 1) {
        this.heapContainer.pop()
      } else {
        this.heapContainer[indexToRemove] = this.heapContainer.pop()!
        const parentItem = this.parent(indexToRemove)
        if (
          this.hasLeftChild(indexToRemove) &&
          (!parentItem ||
            this.pairIsInCorrectOrder(
              parentItem,
              this.heapContainer[indexToRemove]
            ))
        ) {
          this.heapifyDown(indexToRemove)
        } else {
          this.heapifyUp(indexToRemove)
        }
      }
    }

    return this
  }

  public toString() {
    return this.heapContainer.toString()
  }

  protected abstract pairIsInCorrectOrder(l: T, r: T): boolean
  private heapifyUp(customStartIndex = this.heapContainer.length - 1) {
    let index = customStartIndex

    while (
      this.hasParent(index) &&
      !this.pairIsInCorrectOrder(this.parent(index), this.heapContainer[index])
    ) {
      this.swap(index, this.getParentIndex(index))
      index = this.getParentIndex(index)
    }
  }

  private heapifyDown(customStartIndex = 0) {
    let index = customStartIndex
    let nextIndex = null

    while (this.hasLeftChild(index)) {
      nextIndex =
        this.hasRightChild(index) &&
        this.pairIsInCorrectOrder(this.rightChild(index), this.leftChild(index))
          ? this.getRightChildIndex(index)
          : this.getLeftChildIndex(index)

      if (
        this.pairIsInCorrectOrder(
          this.heapContainer[index],
          this.heapContainer[nextIndex]
        )
      ) {
        break
      }

      this.swap(index, nextIndex)
      index = nextIndex
    }
  }

  private parent(index: number): T {
    return this.heapContainer[this.getParentIndex(index)]
  }

  private hasParent(index: number): boolean {
    return this.getParentIndex(index) >= 0
  }

  private swap(indexOne: number, indexTwo: number) {
    ;[this.heapContainer[indexOne], this.heapContainer[indexTwo]] = [
      this.heapContainer[indexTwo],
      this.heapContainer[indexOne],
    ]
    return this
  }

  private getParentIndex(index: number): number {
    return Math.floor((index - 1) / 2)
  }

  private hasLeftChild(index: number): boolean {
    return this.getLeftChildIndex(index) < this.heapContainer.length
  }
  private hasRightChild(index: number): boolean {
    return this.getRightChildIndex(index) < this.heapContainer.length
  }
  private leftChild(index: number): T {
    return this.heapContainer[this.getLeftChildIndex(index)]
  }
  private rightChild(index: number): T {
    return this.heapContainer[this.getRightChildIndex(index)]
  }
  private getLeftChildIndex(index: number): number {
    return 2 * index + 1
  }
  private getRightChildIndex(index: number): number {
    return 2 * index + 2
  }
}
