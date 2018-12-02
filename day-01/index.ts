import R from 'ramda'

export function chronalCalibrationSum(input: string) {
  return parseInput(input).reduce(
    (acc, fn) => (fn === undefined ? acc : fn(acc)),
    0
  )
}

export function chronalCalibrationRepeat(input: string, maxSize = 1000000) {
  const partials = parseInput(input)
  const partialsGenerator = cycle(partials)

  let state = 0
  let i = 0
  const tree = new BinaryTree(state)

  for (const partial of partialsGenerator) {
    if (i >= maxSize) {
      throw new Error(`Potential infinite loop, increase maxSize: ${maxSize}`)
    }
    if (!partial) {
      throw new Error(`Partial is undefined in partials: ${partials}`)
    }

    state = partial(state)

    try {
      tree.insert(state)
    } catch (error) {
      return state
    }

    i++
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

    if (value < this.value) {
      if (this.left === null) {
        this.left = new BinaryTree(value)
      } else {
        this.left.insert(value)
      }
    }

    if (value > this.value) {
      if (this.right === null) {
        this.right = new BinaryTree(value)
      } else {
        this.right.insert(value)
      }
    }

    return this
  }

  public toArray() {
    return Array.from(this.values())
  }

  private *values(): any {
    if (this.left !== null) yield* this.left.values()

    yield this.value

    if (this.right !== null) yield* this.right.values()
  }
}
