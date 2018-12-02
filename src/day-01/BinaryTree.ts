export default class BinaryTree<T> {
  public value: T
  private left: BinaryTree<T> | null
  private right: BinaryTree<T> | null

  constructor(value: T) {
    this.value = value
    this.left = null
    this.right = null
  }

  public insert(value: T) {
    if (value === this.value) {
      throw new Error(`BinaryTree.value already exists: ${value}`)
    }

    if (value < this.value) this.insertNode('left', value)
    if (value > this.value) this.insertNode('right', value)

    return this
  }

  public toArray() {
    return Array.from(this.values())
  }

  private insertNode(key: 'left' | 'right', value: T) {
    if (this[key] === null) {
      this[key] = new BinaryTree(value)
    } else {
      this[key]!.insert(value)
    }

    return this
  }

  private *values(): any {
    if (this.left !== null) yield* this.left.values()

    yield this.value

    if (this.right !== null) yield* this.right.values()
  }
}
