import { times } from 'ramda'

export function decodeLicenseWithSum(input: string) {
  return input
    .trim()
    .match(RE_PARSE_LINE)!
    .map(line => parseInt(line.trim()))
    .reduce((tree, n) => tree.build(n), new Node(null))
    .listMeta()
    .reduce((l, r) => l + r)
}

export function decodeLicenseWithIndex(input: string) {
  return input
    .trim()
    .match(RE_PARSE_LINE)!
    .map(line => parseInt(line.trim()))
    .reduce((tree, n) => tree.build(n), new Node(null))
    .listIndexValues()
    .reduce((l, r) => l + r)
}

const RE_PARSE_LINE = /\d+/gmu

class Node {
  private state: 'CREATE_CHILDREN' | 'SET_META_SIZE' | 'ADD_META' | 'DONE' =
    'CREATE_CHILDREN'
  private parent: Node | null
  private children: Node[] = []
  private childrenIterator: IterableIterator<Node> | null = null
  private meta: number[] = []
  private metaSize: number | null = null

  constructor(parent: Node | null) {
    this.parent = parent
  }

  public build(n: number): Node {
    return this[this.state](n)
  }

  public listIndexValues() {
    const result = Array.from(this.iterateIndexedValue())

    return result
  }
  public listMeta() {
    return Array.from(this.iterateMeta())
  }

  private CREATE_CHILDREN(n: number) {
    this.state = 'SET_META_SIZE'
    this.children = times(() => new Node(this), n)
    return this
  }

  private SET_META_SIZE(n: number) {
    this.state = 'ADD_META'
    this.metaSize = n
    this.childrenIterator = this.children.values()

    return this.next()
  }

  private ADD_META(n: number) {
    if (this.meta.length < this.metaSize! - 1) {
      this.meta.push(n)

      return this
    }

    if (this.meta.length < this.metaSize!) {
      this.state = 'DONE'
      this.meta.push(n)

      if (this.parent === null) return this // This is the last node.
      return this.parent!.next()
    }

    throw new Error('Something went wrong')
  }

  private DONE(_: number): Node {
    throw new Error('Something went wrong')
  }

  private next() {
    const { done, value: next } = this.childrenIterator!.next()

    return done ? this : next
  }

  private *iterateIndexedValue(): IterableIterator<number> {
    if (this.meta === null || this.children === null) {
      throw new Error('Something went wrong')
    }

    if (this.children.length === 0) {
      yield* this.meta.values()
      return
    }

    for (const index of this.meta) {
      if (index === 0) continue
      const child = this.children[index - 1]
      if (!child) continue

      yield* child.iterateIndexedValue()
    }
  }

  private *iterateMeta(): IterableIterator<number> {
    if (this.meta === null || this.children === null) {
      throw new Error('Something went wrong')
    }

    yield* this.meta.values()

    for (const child of this.children) {
      yield* child.iterateMeta()
    }
  }
}
