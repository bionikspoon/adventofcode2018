import { findLargestFiniteArea, findMostConnectedRegion } from '.'
import { getInput } from '../utils/tests'

describe('part 1', () => {
  describe.each`
    file            | expected | skip
    ${'case-1.txt'} | ${17}    | ${false}
    ${'input.txt'}  | ${3569}  | ${true}
  `('#findLargestFiniteArea given $file', ({ file, expected, skip }) => {
    const TEST = skip ? test.skip : test
    let input: string

    beforeEach(async () => {
      input = await getInput(__dirname, file)
    })

    TEST('it finds the largest area that is not infinite', () => {
      expect(findLargestFiniteArea(input)).toEqual(expected)
    })
  })
})

describe('part 2', () => {
  describe.each`
    file            | limit    | expected | skip
    ${'case-1.txt'} | ${32}    | ${16}    | ${false}
    ${'input.txt'}  | ${10000} | ${48978} | ${false}
  `(
    '#findMostConnectedRegion given $file',
    ({ file, expected, skip, limit }) => {
      const TEST = skip ? test.skip : test
      let input: string

      beforeEach(async () => {
        input = await getInput(__dirname, file)
      })

      TEST('it finds the most connected region', () => {
        expect(findMostConnectedRegion(input, limit)).toEqual(expected)
      })
    }
  )
})
