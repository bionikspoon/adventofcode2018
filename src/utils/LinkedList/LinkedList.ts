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

  public get length() {
    let i = 0
    let currentNode = this.headNode
    while (currentNode) {
      i++
      currentNode = currentNode.next
    }

    return i
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

  public deleteWhere(pred: (value: T) => boolean) {
    let prevNode: LinkedListNode<T> | null = null
    let currNode: LinkedListNode<T> | null = this.headNode

    while (currNode) {
      if (!pred(currNode.value)) {
        prevNode = currNode
        currNode = currNode.next
        continue
      }

      if (prevNode === null) {
        this.shift()
        currNode = this.headNode
      } else if (currNode === this.tailNode) {
        this.pop()
        currNode = prevNode.next
      } else {
        prevNode.next = currNode.next
        currNode = prevNode.next
      }
    }

    return this
  }

  public map<U>(fn: (item: T) => U) {
    const newList = new LinkedList<U>()

    let currentNode = this.headNode

    while (currentNode) {
      newList.push(fn(currentNode.value))
      currentNode = currentNode.next!
    }
    return newList
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

  public includes(value: T) {
    let currentNode = this.headNode

    while (currentNode) {
      if (currentNode.value === value) return true
      currentNode = currentNode.next!
    }

    return false
  }

  public clear() {
    this.headNode = null
    this.tailNode = null

    return this
  }

  public toString(callback?: (value: T) => string) {
    return this.toNodeArray()
      .map(node => node.toString(callback))
      .toString()
  }

  public toArray() {
    return this.toNodeArray().map(node => node.value)
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
