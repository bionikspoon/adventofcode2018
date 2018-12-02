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
  let appenders: number[] = [state]
  let i = 0

  for (const partial of partialsGenerator) {
    if (i >= maxSize)
      throw new Error(`Potential infinite loop, increase maxSize: ${maxSize}`)
    if (!partial)
      throw new Error(`Partial is undefined in partials: ${partials}`)

    state = partial(state)

    if (appenders.includes(state)) return state
    appenders.push(state)
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

export function* cycle<T>(items: Array<T>) {
  if (items.length <= 0)
    throw new Error('Cycle(items): items must have length > 0')
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
