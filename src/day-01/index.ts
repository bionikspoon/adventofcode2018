import R from 'ramda'
import parseLines from '../utils/parseLines'
import BinaryTree from './BinaryTree'
import cycle from './cycle'

// PART 1

export function chronalCalibrationSum(input: string) {
  return toPartial(input).reduce(
    (acc, fn) => (fn === undefined ? acc : fn(acc)),
    0
  )
}

// PART 2

export function chronalCalibrationRepeat(input: string, maxSize = 1000000) {
  let state = 0
  const tree = new BinaryTree(state)
  const checkMaxSize = iterateMaxSize(maxSize)
  const partialsGenerator = cycle(toPartial(input))

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

  throw new Error('Something went wrong')
}

const RE_MATCH_LINE = new RegExp(/^(?<op>\+|-)(?<value>\d+)$/, 'um')
const partiallyApplyLine = (line: string) => {
  const match = RE_MATCH_LINE.exec(line)
  if (match === null || match.groups === undefined) return

  const opFn = match.groups.op === '+' ? R.add : R.subtract
  const value = parseInt(match.groups!.value)

  return (n: number) => opFn(n, value)
}

function* iterateMaxSize(maxSize: number) {
  let i = 0

  while (i < maxSize) {
    yield
    i++
  }

  throw new Error(`Potential infinite loop, increase maxSize: ${maxSize}`)
}

// SHARED

const toPartial = (input: string) => parseLines(input).map(partiallyApplyLine)
