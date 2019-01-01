import { toGrid } from '.'
import { getInput } from '../utils/tests'
import Grid from './Grid'

describe('given file "case-1.txt"', () => {
  test('it is a grid', async () => {
    const input = await getInput(__dirname, 'case-1.txt')

    expect(toGrid(input)).toBeInstanceOf(Grid)
  })
})

describe.each`
  file            | minutes | stats                                | answer    | output                    | skip
  ${'case-1.txt'} | ${0}    | ${{ '#': 17, '.': 56, '|': 27 }}     | ${459}    | ${'case-1-00.txt'}        | ${false}
  ${'case-1.txt'} | ${1}    | ${{ '#': 12, '.': 48, '|': 40 }}     | ${480}    | ${'case-1-01.txt'}        | ${false}
  ${'case-1.txt'} | ${2}    | ${{ '#': 10, '.': 35, '|': 55 }}     | ${550}    | ${'case-1-02.txt'}        | ${false}
  ${'case-1.txt'} | ${3}    | ${{ '#': 11, '.': 27, '|': 62 }}     | ${682}    | ${'case-1-03.txt'}        | ${false}
  ${'case-1.txt'} | ${4}    | ${{ '#': 13, '.': 22, '|': 65 }}     | ${845}    | ${'case-1-04.txt'}        | ${false}
  ${'case-1.txt'} | ${5}    | ${{ '#': 16, '.': 18, '|': 66 }}     | ${1056}   | ${'case-1-05.txt'}        | ${false}
  ${'case-1.txt'} | ${6}    | ${{ '#': 17, '.': 17, '|': 66 }}     | ${1122}   | ${'case-1-06.txt'}        | ${false}
  ${'case-1.txt'} | ${7}    | ${{ '#': 24, '.': 15, '|': 61 }}     | ${1464}   | ${'case-1-07.txt'}        | ${false}
  ${'case-1.txt'} | ${8}    | ${{ '#': 31, '.': 15, '|': 54 }}     | ${1674}   | ${'case-1-08.txt'}        | ${false}
  ${'case-1.txt'} | ${9}    | ${{ '#': 34, '.': 22, '|': 44 }}     | ${1496}   | ${'case-1-09.txt'}        | ${false}
  ${'case-1.txt'} | ${10}   | ${{ '#': 31, '.': 32, '|': 37 }}     | ${1147}   | ${'case-1-10.txt'}        | ${false}
  ${'input.txt'}  | ${0}    | ${{ '#': 509, '.': 1501, '|': 490 }} | ${249410} | ${'input-00.txt'}         | ${false}
  ${'input.txt'}  | ${10}   | ${{ '#': 546, '.': 858, '|': 1096 }} | ${598416} | ${'input-10.txt'}         | ${false}
  ${'input.txt'}  | ${1000} | ${{ '#': 0, '.': 0, '|': 0 }}        | ${0}      | ${'input-1000000000.txt'} | ${true}
`('given file $file', ({ file, minutes, output, stats, answer, skip }) => {
  let input: string
  let expected: string
  let grid: Grid
  const DESCRIBE = skip ? describe.skip : describe
  beforeAll(async () => {
    input = await getInput(__dirname, file)
    expected = await getInput(__dirname, output)
    grid = toGrid(input)
  })

  DESCRIBE(`after ${minutes} minutes`, () => {
    test('it has the state', () => {
      grid.simulateMinutes(minutes)
      expect(grid.print()).toEqual(expected)
    })

    test('it has stats', () => {
      expect(grid.stats()).toEqual(stats)
    })

    test('it has an answer', () => {
      expect(grid.answer()).toEqual(answer)
    })
  })
})
