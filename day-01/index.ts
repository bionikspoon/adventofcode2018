import R from 'ramda'

export function chronalCalibration1(input: string) {
  return parseInput(input).reduce(
    (acc, fn) => (fn === undefined ? acc : fn(acc)),
    0
  )
}

export function chronalCalibration2(input: string) {
  const partials = parseInput(input)

  const appenders: any[] = []
  let i = 0
  let state = 0
  while (true) {
    const fn = partials[i]
    if (!fn) throw new Error(`No partials[${i}] for partials: ${partials}`)
    state = fn(state)

    if (appenders.includes(state)) return state

    appenders.push(state)

    if (i >= partials.length - 1) {
      i = 0
    } else {
      i++
    }
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
