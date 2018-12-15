import { range } from 'ramda'
import combinations from './combinations'

test('it returns combinations of an array', () => {
  expect(combinations(range(0, 3))).toEqual([[0, 1], [0, 2], [1, 2]])
})

test('it returns combinations of an array', () => {
  expect(combinations(['A', 'B', 'C', 'D'])).toEqual([
    ['A', 'B'],
    ['A', 'C'],
    ['A', 'D'],
    ['B', 'C'],
    ['B', 'D'],
    ['C', 'D'],
  ])
})
