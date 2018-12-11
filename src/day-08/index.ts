import { times } from 'ramda'

export function decodeLicenseWithSum(input: string) {
  return input
    .trim()
    .match(RE_PARSE_LINE)!
    .map(line => parseInt(line.trim()))
    .reduce((tree, n) => tree.add(n), new Node(null))
    .listMeta()
    .reduce((l, r) => l + r)
}

export function decodeLicenseWithIndex(input: string) {
  return input
    .trim()
    .match(RE_PARSE_LINE)!
    .map(line => parseInt(line.trim()))
    .reduce((tree, n) => tree.add(n), new Node(null))
    .listIndexValues()
    .reduce((l, r) => l + r)
}

const RE_PARSE_LINE = /\d+/gmu

class Node {
  private parent: Node | null
  private children: Node[] | null = null
  private childrenIterator: IterableIterator<Node> | null = null
  private meta: number[] | null = null
  private metaSize: number | null = null

  constructor(parent: Node | null) {
    this.parent = parent
  }

  public listIndexValues() {
    const result = Array.from(this.iterateIndexedValue())

    return result
  }
  public listMeta() {
    return Array.from(this.iterateMeta())
  }
  public add(n: number) {
    if (this.children === null) {
      this.children = times(() => new Node(this), n)
      return this
    }

    if (this.meta === null) {
      this.meta = []
      this.metaSize = n
      this.childrenIterator = this.children.values()

      return this.next()
    }

    if (this.meta.length < this.metaSize! - 1) {
      this.meta.push(n)

      return this
    }

    if (this.meta.length < this.metaSize!) {
      this.meta.push(n)

      if (this.parent === null) return this // This is the last node.
      return this.parent!.next()
    }

    throw new Error('Something went wrong')
  }
  protected next() {
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
