import { findLargestFiniteArea, toGrid } from '.'
import { getInput } from '../utils/tests'

describe('part 1', () => {
  describe.each`
    file           | expected
    ${'input.txt'} | ${17}
  `('#findLargestFiniteArea given $file', ({ file, expected }) => {
    // ${'part-1-case-1.txt'} | ${17}
    let input: string

    beforeEach(async () => {
      input = await getInput(__dirname, file)
    })

    test('it finds the largest area that is not infinite', () => {
      expect(findLargestFiniteArea(input)).toEqual(expected)
    })

    // xtest('it matches snapshot from plotting initial points', () => {
    //   const subject = toGrid(input)

    //   expect(subject.toString()).toMatchSnapshot()
    // })

    // xtest('it matches snapshot after growing', () => {
    //   const subject = toGrid(input).growAll()

    //   expect(subject.toString()).toMatchSnapshot()
    // })
  })
})
