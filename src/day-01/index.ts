import R from 'ramda'

export function chronalCalibrationSum(input: string) {
  return parseInput(input).reduce(
    (acc, fn) => (fn === undefined ? acc : fn(acc)),
    0
  )
}

export function chronalCalibrationRepeat(input: string, maxSize = 1000000) {
  let state = 0
  const tree = new BinaryTree(state)
  const checkMaxSize = iterateMaxSize(maxSize)
  const partialsGenerator = cycle(parseInput(input))

  for (const partial of partialsGenerator) {
    if (!partial) continue

    state = partial(state)

    try {
      tree.insert(state)
    } catch (error) {
      return state
    }

    checkMaxSize.next()
  }
}

const RE_MATCH_LINE = new RegExp(/^(?<op>\+|-)(?<value>\d+)$/, 'um')
const partiallyApplyLine = (line: string) => {
  const match = RE_MATCH_LINE.exec(line)
  if (match === null || match.groups === undefined) return

  const opFn = match.groups.op === '+' ? R.add : R.subtract
  const value = parseInt(match.groups!.value)

  return (n: number) => opFn(n, value)
}

const parseInput = (input: string) =>
  input
    .trim()
    .split('\n')
    .map(line => line.trim())
    .map(partiallyApplyLine)

export function* cycle<T>(items: T[]) {
  if (items.length <= 0) {
    throw new Error('Cycle(items): items must have length > 0')
  }

  let i = 0

  while (true) {
    yield items[i]

    if (i >= items.length - 1) {
      i = 0
    } else {
      i++
    }
  }
}

function* iterateMaxSize(maxSize: number) {
  let i = 0

  while (i < maxSize) {
    yield
    i++
  }

  throw new Error(`Potential infinite loop, increase maxSize: ${maxSize}`)
}

export class BinaryTree<T> {
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
