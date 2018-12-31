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

    traverse(this, () => {
      i++
    })

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

  public find(predicate: (value: T) => boolean) {
    return maybeTransform(
      node => node.value,
      this.findNode(node => predicate(node.value))
    )
  }

  public findNode(predicate: (node: LinkedListNode<T>) => boolean) {
    let currentNode = this.headNode

    while (currentNode) {
      if (predicate(currentNode)) return currentNode

      currentNode = currentNode.next!
    }

    return null
  }

  public deleteWhere(predicate: (value: T) => boolean) {
    let prevNode: LinkedListNode<T> | null = null
    let currNode: LinkedListNode<T> | null = this.headNode

    while (currNode) {
      if (!predicate(currNode.value)) {
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

  public map<U>(callback: (item: T) => U) {
    const newList = new LinkedList<U>()

    traverse(this, value => void newList.push(callback(value)))

    return newList
  }

  public forEach(callback: (item: T) => void) {
    traverse(this, callback)

    return this
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
    const nodes: Array<LinkedListNode<T>> = []

    traverseNodes(this, node => {
      nodes.push(node)
    })

    return nodes
  }
}

function traverseNodes<T>(
  linkedList: LinkedList<T>,
  callback: (node: LinkedListNode<T>) => void
) {
  let currentNode = linkedList.headNode

  while (currentNode) {
    callback(currentNode)
    currentNode = currentNode.next
  }
}

function traverse<T>(linkedList: LinkedList<T>, callback: (value: T) => void) {
  traverseNodes(linkedList, node => callback(node.value))
}

function maybeTransform<T, U>(
  transform: (value: T) => U,
  maybeValue: T | null
) {
  return maybeValue === null ? null : transform(maybeValue)
}
