import LinkedListNode from './LinkedListNode'

export default class LinkedList<T> {
  public static from<T>(items: T[]) {
    return items.reduce((list, item) => list.append(item), new LinkedList<T>())
  }
  public head: LinkedListNode<T> | null = null
  public tail: LinkedListNode<T> | null = null

  public append(value: T) {
    const node = new LinkedListNode(value)
    if (this.head === null) {
      this.head = node
      this.tail = node
      return this
    }

    this.tail!.next = node
    this.tail = node

    return this
  }

  public prepend(value: T) {
    const node = new LinkedListNode(value, this.head)
    this.head = node

    if (!this.tail) this.tail = node

    return this
  }
  public delete(value: T) {
    return null
  }

  public shift() {
    if (this.head === null) return null

    const deletedNode = this.head
    this.head = this.head.next

    if (this.tail === deletedNode) this.tail = null

    return deletedNode.value
  }

  public pop() {
    if (this.head === null) return null
    if (this.tail === this.head) return this.shift()

    const deletedNode = this.tail

    let currentNode = this.head

    while (currentNode) {
      if (currentNode.next === deletedNode) {
        currentNode.next = null
        this.tail = currentNode
        break
      }
      currentNode = currentNode.next!
    }

    return deletedNode!.value
  }

  public find(predicate: (item: T) => boolean) {
    let currentNode = this.head

    while (currentNode) {
      if (predicate(currentNode.value)) return currentNode.value

      currentNode = currentNode.next!
    }

    return null
  }
  public findNode(predicate: (item: LinkedListNode<T>) => boolean) {
    let currentNode = this.head

    while (currentNode) {
      if (predicate(currentNode)) return currentNode

      currentNode = currentNode.next!
    }

    return null
  }

  public reverse() {
    let currNode = this.head
    let prevNode = null
    let nextNode = null

    while (currNode) {
      nextNode = currNode.next

      currNode.next = prevNode

      prevNode = currNode
      currNode = nextNode
    }

    this.tail = this.head
    this.head = prevNode

    return this
  }

  public toString(callback?: (value: T) => string) {
    return this.toNodeArray()
      .map(node => node.toString(callback))
      .toString()
  }

  private toNodeArray() {
    const nodes = []
    let currentNode = this.head
    while (currentNode) {
      nodes.push(currentNode)
      currentNode = currentNode.next
    }

    return nodes
  }
}
