import { findFirstCollision, findLastCart } from '.'
import { getInput } from '../utils/tests'

describe('day-13/part-01', () => {
  describe.each`
    file                   | firstCollision      | skip
    ${'part-1-case-1.txt'} | ${{ x: 0, y: 3 }}   | ${false}
    ${'part-1-case-2.txt'} | ${{ x: 7, y: 3 }}   | ${false}
    ${'input.txt'}         | ${{ x: 48, y: 20 }} | ${false}
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

describe('day-13/part-02', () => {
  describe.each`
    file                   | lastCart            | skip
    ${'part-2-case-1.txt'} | ${{ x: 6, y: 4 }}   | ${false}
    ${'input.txt'}         | ${{ x: 59, y: 64 }} | ${false}
  `('given $file', ({ file, lastCart, skip }) => {
    const TEST = skip ? test.skip : test
    let input: string

    beforeEach(async () => {
      input = await getInput(__dirname, file)
    })

    TEST('it finds the first collision', () => {
      expect(findLastCart(input)).toEqual(lastCart)
    })
  })
})
