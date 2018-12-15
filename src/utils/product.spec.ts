import { range } from 'ramda'
import product from './product'

test('it returns product of an array', () => {
  expect(product(range(0, 3))).toEqual([
    [0, 0],
    [0, 1],
    [0, 2],
    [1, 0],
    [1, 1],
    [1, 2],
    [2, 0],
    [2, 1],
    [2, 2],
  ])
})

test('it returns product of an array', () => {
  expect(product(['A', 'B', 'C', 'D'])).toEqual([
    ['A', 'A'],
    ['A', 'B'],
    ['A', 'C'],
    ['A', 'D'],
    ['B', 'A'],
    ['B', 'B'],
    ['B', 'C'],
    ['B', 'D'],
    ['C', 'A'],
    ['C', 'B'],
    ['C', 'C'],
    ['C', 'D'],
    ['D', 'A'],
    ['D', 'B'],
    ['D', 'C'],
    ['D', 'D'],
  ])
})
