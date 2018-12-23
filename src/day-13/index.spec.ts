import { getInput } from '../utils/tests'
import { findFirstCollision } from '.'

describe('day-13', () => {
  describe.each`
    file            | firstCollision
    ${'case-1.txt'} | ${{ x: 0, y: 3 }}
    ${'case-2.txt'} | ${{ x: 7, y: 3 }}
  `('given $file', ({ file, firstCollision }) => {
    let input: string

    beforeEach(async () => {
      input = await getInput(__dirname, file)
    })

    test('it finds the first collision', () => {
      expect(findFirstCollision(input)).toEqual(firstCollision)
    })
  })
})
