import {
  crushPolymers,
  hasReaction,
  reduceCrushedPolymers,
  reducePolymers,
} from '.'
import { getInput } from '../utils/tests'

describe('part 1', () => {
  describe.each`
    file            | count
    ${'case-1.txt'} | ${10}
    ${'index.txt'}  | ${10886}
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

  describe('#hasReaction', () => {
    test.each`
      l      | r      | expected
      ${'a'} | ${'a'} | ${false}
      ${'a'} | ${'C'} | ${false}
      ${'C'} | ${'a'} | ${false}
      ${'C'} | ${'C'} | ${false}
      ${'c'} | ${'C'} | ${true}
      ${'C'} | ${'c'} | ${true}
    `('given $l, $r it is $expected', ({ l, r, expected }) => {
      expect(hasReaction(l, r)).toEqual(expected)
    })
  })
})

describe('part 2', () => {
  describe.each`
    file            | expected
    ${'case-1.txt'} | ${4}
    ${'index.txt'}  | ${4684}
  `('given $file', async ({ file, expected }) => {
    let input: string

    beforeEach(async () => {
      input = await getInput(__dirname, file)
    })

    test('it finds the shortest polymer', () => {
      expect(reduceCrushedPolymers(input)).toEqual(expected)
    })
  })
})

describe('#crushPolymers', () => {
  const polymer = 'dabAcCaCBAcCcaDA'
  test.each`
    char   | expected
    ${'a'} | ${'dbcCCBcCcD'}
    ${'b'} | ${'daAcCaCAcCcaDA'}
    ${'c'} | ${'dabAaBAaDA'}
    ${'d'} | ${'abAcCaCBAcCcaA'}
  `('it can crush $char of polymer', ({ char, expected }) => {
    expect(crushPolymers(char, polymer)).toEqual(expected)
  })
})
