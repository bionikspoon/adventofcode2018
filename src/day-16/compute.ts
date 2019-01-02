import {
  add,
  compose,
  converge,
  equals,
  gt,
  identity,
  multiply,
  unapply,
  update,
  useWith,
} from 'ramda'

type BinaryFn = (a: number, b: number) => number
type WithSource = (value: number) => (registry: number[]) => number
const fromRegistry: WithSource = index => registry => registry[index]
const fromValue: WithSource = value => () => value

type DefineOp = (
  opFn: BinaryFn,
  withA: WithSource,
  withB: WithSource
) => (a: number, b: number) => (registry: number[]) => number
const defineOp: DefineOp = (opFn, withA, withB) =>
  compose(
    args => converge(opFn, args),
    useWith(unapply(identity), [withA, withB])
  )

// tslint:disable-next-line no-bitwise
const bitwiseAnd: BinaryFn = (l, r) => l & r
// tslint:disable-next-line no-bitwise
const bitwiseOr: BinaryFn = (l, r) => l | r
const gtBit = compose(
  Number,
  gt
)
const equalsBit = compose(
  Number,
  equals
)

export const ops = {
  addr: defineOp(add, fromRegistry, fromRegistry),
  addi: defineOp(add, fromRegistry, fromValue),
  mulr: defineOp(multiply, fromRegistry, fromRegistry),
  muli: defineOp(multiply, fromRegistry, fromValue),
  banr: defineOp(bitwiseAnd, fromRegistry, fromRegistry),
  bani: defineOp(bitwiseAnd, fromRegistry, fromValue),
  borr: defineOp(bitwiseOr, fromRegistry, fromRegistry),
  bori: defineOp(bitwiseOr, fromRegistry, fromValue),
  setr: defineOp(identity, fromRegistry, fromValue),
  seti: defineOp(identity, fromValue, fromValue),
  gtir: defineOp(gtBit, fromValue, fromRegistry),
  gtri: defineOp(gtBit, fromRegistry, fromValue),
  gtrr: defineOp(gtBit, fromRegistry, fromRegistry),
  eqir: defineOp(equalsBit, fromValue, fromRegistry),
  eqri: defineOp(equalsBit, fromRegistry, fromValue),
  eqrr: defineOp(equalsBit, fromRegistry, fromRegistry),
}

export type OpName = keyof (typeof ops)

export function compute(
  [opName, a, b, c]: [OpName, number, number, number],
  registry: number[]
): number[] {
  const opFn = ops[opName]

  return update(c, opFn(a, b)(registry), registry)
}
