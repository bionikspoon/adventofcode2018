import { addIndex, map, pipe, split, trim, unary } from 'ramda'
import { Grid, Point } from './Grid'

export function findLargestFiniteArea(input: string) {
  const grid = toGrid(input)
  return grid.growAll().findSafestArea()
}

export const toGrid = (input: string) =>
  pipe(
    toLines,
    toPoints,
    Grid.fromPoints
  )(input)

const toLines = pipe(
  trim,
  split('\n'),
  map(trim)
)

const enumerate = <T, U>(fn: (item: T[], index: number) => U) =>
  addIndex<T[], U>(map)(fn)

const toPoints = pipe(
  map(
    pipe(
      split(', '),
      map<string, number>(unary(parseInt))
    )
  ),
  enumerate<number, Point>(([x, y], id) => ({
    id: id.toString(),
    x,
    y,
    distance: 0,
  }))
)
