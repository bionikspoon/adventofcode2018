import { reducePolymers } from '.'
import { getInput } from '../utils/tests'

describe('part 1', () => {
  describe.each`
    file                   | count
    ${'part-1-case-1.txt'} | ${10}
    ${'index.txt'}         | ${10886}
  `('given $file', async ({ file, count }) => {
    let input: string

    beforeEach(async () => {
      input = await getInput(__dirname, file)
    })

    test('it matches snapshot', () => {
      expect(reducePolymers(input)).toMatchSnapshot()
    })

    test("it's counts match up", () => {
      expect(reducePolymers(input)).toHaveLength(count)
    })
  })
})
