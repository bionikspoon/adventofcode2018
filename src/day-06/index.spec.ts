import { findLargestFiniteArea } from '.'
import { getInput } from '../utils/tests'

describe('part 1', () => {
  describe.each`
    file                   | expected | skip
    ${'part-1-case-1.txt'} | ${17}    | ${false}
    ${'input.txt'}         | ${3569}  | ${true}
  `('#findLargestFiniteArea given $file', ({ file, expected, skip }) => {
    const testFn = skip ? test.skip : test
    let input: string

    beforeEach(async () => {
      input = await getInput(__dirname, file)
    })

    testFn('it finds the largest area that is not infinite', () => {
      expect(findLargestFiniteArea(input)).toEqual(expected)
    })
  })
})
