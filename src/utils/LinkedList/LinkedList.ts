import LinkedListNode from './LinkedListNode'

export default class LinkedList<T> {
  public static from<T>(items: T[]) {
    return items.reduce((list, item) => list.push(item), new LinkedList<T>())
  }
  public headNode: LinkedListNode<T> | null = null
  public tailNode: LinkedListNode<T> | null = null

  public get head() {
    return this.headNode === null ? null : this.headNode.value
  }
  public get tail() {
    return this.tailNode === null ? null : this.tailNode.value
  }

  public push(value: T) {
    const node = new LinkedListNode(value)
    if (this.headNode === null) {
      this.headNode = node
      this.tailNode = node
      return this
    }

    this.tailNode!.next = node
    this.tailNode = node

    return this
  }

  public unshift(value: T) {
    const node = new LinkedListNode(value, this.headNode)
    this.headNode = node

    if (!this.tailNode) this.tailNode = node

    return this
  }

  public shift() {
    if (this.headNode === null) return null

    const deletedNode = this.headNode
    this.headNode = this.headNode.next

    if (this.tailNode === deletedNode) this.tailNode = null

    return deletedNode.value
  }

  public pop() {
    if (this.headNode === null) return null
    if (this.tailNode === this.headNode) return this.shift()

    const deletedNode = this.tailNode

    let currentNode = this.headNode

    while (currentNode) {
      if (currentNode.next === deletedNode) {
        currentNode.next = null
        this.tailNode = currentNode
        break
      }
      currentNode = currentNode.next!
    }

    return deletedNode!.value
  }

  public find(predicate: (item: T) => boolean) {
    let currentNode = this.headNode

    while (currentNode) {
      if (predicate(currentNode.value)) return currentNode.value

      currentNode = currentNode.next!
    }

    return null
  }
  public findNode(predicate: (item: LinkedListNode<T>) => boolean) {
    let currentNode = this.headNode

    while (currentNode) {
      if (predicate(currentNode)) return currentNode

      currentNode = currentNode.next!
    }

    return null
  }

  public reverse() {
    let currNode = this.headNode
    let prevNode = null
    let nextNode = null

    while (currNode) {
      nextNode = currNode.next

      currNode.next = prevNode

      prevNode = currNode
      currNode = nextNode
    }

    this.tailNode = this.headNode
    this.headNode = prevNode

    return this
  }

  public toString(callback?: (value: T) => string) {
    return this.toNodeArray()
      .map(node => node.toString(callback))
      .toString()
  }

  private toNodeArray() {
    const nodes = []
    let currentNode = this.headNode
    while (currentNode) {
      nodes.push(currentNode)
      currentNode = currentNode.next
    }

    return nodes
  }
}
