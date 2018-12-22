import { simulateGenerationsRepr } from '.'
import { getInput } from '../utils/tests'

describe.each`
  file            | generations | expected
  ${'case-1.txt'} | ${0}        | ${'...#..#.#..##......###...###...........'}
  ${'case-1.txt'} | ${1}        | ${'...#...#....#.....#..#..#..#...........'}
`('given input $input', ({ file, generations, expected }) => {
  let input: string

  beforeEach(async () => {
    input = await getInput(__dirname, file)
  })

  test(`after ${generations} generation(s) it has a state`, () => {
    expect(simulateGenerationsRepr(input, generations)).toEqual(expected)
  })
})
