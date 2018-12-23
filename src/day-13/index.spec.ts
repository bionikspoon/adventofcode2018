import { findFirstCollision } from '.'
import { getInput } from '../utils/tests'

describe('day-13', () => {
  describe.each`
    file            | firstCollision      | skip
    ${'case-1.txt'} | ${{ x: 0, y: 3 }}   | ${false}
    ${'case-2.txt'} | ${{ x: 7, y: 3 }}   | ${false}
    ${'input.txt'}  | ${{ x: 48, y: 20 }} | ${false}
  `('given $file', ({ file, firstCollision, skip }) => {
    const TEST = skip ? test.skip : test
    let input: string

    beforeEach(async () => {
      input = await getInput(__dirname, file)
    })

    TEST('it finds the first collision', () => {
      expect(findFirstCollision(input)).toEqual(firstCollision)
    })
  })
})
