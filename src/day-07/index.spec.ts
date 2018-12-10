import { findInstructionsOrder } from '.'
import { getInput } from '../utils/tests'

describe('part 1', () => {
  describe.each`
    file            | expected    | skip
    ${'case-1.txt'} | ${'CABDFE'} | ${false}
    ${'input.txt'}  | ${'CABDFE'} | ${true}
  `('#findLargestFiniteArea given $file', ({ file, expected, skip }) => {
    const TEST = skip ? test.skip : test
    let input: string

    beforeEach(async () => {
      input = await getInput(__dirname, file)
    })

    TEST('it finds the largest area that is not infinite', () => {
      expect(findInstructionsOrder(input)).toEqual(expected)
    })
  })
})
