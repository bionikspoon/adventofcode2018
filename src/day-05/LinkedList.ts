import util from 'util'

export class LinkedList<T> {
  public static from<T>(xs: Array<Node<T>>) {
    const list = new LinkedList<T>()

    for (const x of xs) {
      list.insertEnd(x)
    }

    return list
  }

  public firstNode: Node<T> | null = null
  public lastNode: Node<T> | null = null

  public insertAfter(node: Node<T>, newNode: Node<T>) {
    newNode.prev = node
    if (node.next === null) {
      newNode.next = null
      this.lastNode = newNode
    } else {
      newNode.next = node.next
      node.next.prev = newNode
    }

    node.next = newNode
    return this
  }

  public insertBefore(node: Node<T>, newNode: Node<T>) {
    newNode.next = node
    if (node.prev === null) {
      newNode.prev = null
      this.firstNode = newNode
    } else {
      newNode.prev = node.next
      node.prev.next = newNode
    }

    node.prev = newNode

    return this
  }

  public insertBeginning(newNode: Node<T>) {
    if (this.firstNode === null) {
      this.firstNode = newNode
      this.lastNode = newNode
      newNode.prev = null
      newNode.next = null
    } else {
      this.insertBefore(this.firstNode, newNode)
    }

    return this
  }

  public insertEnd(newNode: Node<T>) {
    if (this.lastNode === null) {
      this.insertBeginning(newNode)
    } else {
      this.insertAfter(this.lastNode, newNode)
    }

    return this
  }

  public remove(node: Node<T>) {
    if (node.prev === null) {
      this.firstNode = node.next
    } else {
      node.prev.next = node.next
    }

    if (node.next === null) {
      this.lastNode = node.prev
    } else {
      node.next.prev = node.prev
    }

    return this
  }

  public inspect(): string {
    return `LinkedList { ${this.firstNode!.join(' -> ')} }`
  }

  public [util.inspect.custom]() {
    return this.inspect()
  }

  public *[Symbol.iterator]() {
    let node = this.firstNode

    while (true) {
      if (node === null) return
      yield node.value
      node = node.next
    }
  }
}

export class Node<T> {
  public value: T

  public prev: Node<T> | null = null
  public next: Node<T> | null = null

  constructor(value: T) {
    this.value = value
  }

  public join(str: string): string {
    if (this.next === null) return this.inspect()

    return `${this.inspect()} ${str} ${this.next.join(str)}`
  }

  public inspect(): string {
    return `Node { ${this.value} }`
  }

  public [util.inspect.custom]() {
    return this.inspect()
  }
}
