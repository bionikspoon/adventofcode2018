import R from 'ramda'

const RE_MATCH_LINE = new RegExp(/^(?<op>\+|-)(?<value>\d+)$/, 'um')
const partiallyApplyLine = (line: string) => {
  const match = RE_MATCH_LINE.exec(line)
  if (match === null || match.groups === undefined) return

  const opFn = match.groups.op === '+' ? R.add : R.subtract
  const value = parseInt(match.groups!.value)

  return (n: number) => opFn(n, value)
}

export default function chronalCalibration(input: string) {
  return input
    .trim()
    .split('\n')
    .map(line => line.trim())
    .map(partiallyApplyLine)
    .reduce((acc, fn) => (fn === undefined ? acc : fn(acc)), 0)
}
