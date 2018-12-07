import util from 'util'

export function reducePolymers(input: string) {
  const list = LinkedList.from(input.trim().split(''))

  let node = list.firstNode

  while (true) {
    if (node === null) break

    if (hasReaction(node)) {
      if (node === list.firstNode) {
        list.remove(list.firstNode!)
        list.remove(list.firstNode!)
        node = list.firstNode
      } else {
        node = node.prev
        list.remove(node!.next!)
        list.remove(node!.next!)
      }
    } else {
      node = node.next
    }
  }

  return Array.from(list).join('')
}

function hasReaction(l: Node<string>) {
  if (l.next === null) return false

  const r = l.next

  if (l.value.toLowerCase() !== r.value.toLowerCase()) return false
  if (isLowerCase(l.value) && isUpperCase(r.value)) return true
  if (isUpperCase(l.value) && isLowerCase(r.value)) return true

  return false
}

function isLowerCase(text: string) {
  return text.toLowerCase() === text
}

function isUpperCase(text: string) {
  return text.toUpperCase() === text
}

export class LinkedList<T> {
  public static from<T>(xs: T[]) {
    const list = new LinkedList<T>()

    for (const x of xs) {
      list.insertEnd(new Node(x))
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
    return `LinkedList { ${this.firstNode!.inspectJoin(' -> ')} }`
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

  public inspectJoin(str: string): string {
    if (this.next === null) return this.inspect()

    return `${this.inspect()} ${str} ${this.next.inspectJoin(str)}`
  }

  public inspect(): string {
    return `Node { ${this.value} }`
  }

  public [util.inspect.custom]() {
    return this.inspect()
  }
}
