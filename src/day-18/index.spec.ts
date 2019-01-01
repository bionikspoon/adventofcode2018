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
  file            | minutes | output
  ${'case-1.txt'} | ${0}    | ${'case-1-00.txt'}
  ${'case-1.txt'} | ${1}    | ${'case-1-01.txt'}
  ${'case-1.txt'} | ${2}    | ${'case-1-02.txt'}
  ${'case-1.txt'} | ${3}    | ${'case-1-03.txt'}
  ${'case-1.txt'} | ${4}    | ${'case-1-04.txt'}
  ${'case-1.txt'} | ${5}    | ${'case-1-05.txt'}
  ${'case-1.txt'} | ${6}    | ${'case-1-06.txt'}
  ${'case-1.txt'} | ${7}    | ${'case-1-07.txt'}
  ${'case-1.txt'} | ${8}    | ${'case-1-08.txt'}
  ${'case-1.txt'} | ${9}    | ${'case-1-09.txt'}
  ${'case-1.txt'} | ${10}   | ${'case-1-10.txt'}
`('given file $file', ({ file, minutes, output }) => {
  let input: string
  let expected: string
  let grid: Grid

  beforeEach(async () => {
    input = await getInput(__dirname, file)
    expected = await getInput(__dirname, output)
  })

  beforeEach(() => {
    grid = toGrid(input)
  })

  describe(`after ${minutes} minutes`, () => {
    test('it has the state', () => {
      expect(grid.print()).toEqual(expected)
    })
  })
})
