import {
  checksum,
  findTheBox,
  getCharacterPermutations,
  letterCounts,
} from '..'
import { getInput } from '../../utils/tests'

describe('#letterCounts', () => {
  test.each`
    input       | expected
    ${'abcdef'} | ${new Set([])}
    ${'bababc'} | ${new Set([2, 3])}
    ${'abbcde'} | ${new Set([2])}
    ${'abcccd'} | ${new Set([3])}
    ${'aabcdd'} | ${new Set([2])}
    ${'abcdee'} | ${new Set([2])}
    ${'ababab'} | ${new Set([3])}
    ${'ababac'} | ${new Set([2, 3])}
  `('it calculates the letterCounts for $input', ({ input, expected }) => {
    expect(letterCounts(input)).toEqual(expected)
  })
})

describe('part 1 - #checksum', () => {
  test.each`
    file                   | expected
    ${'part-1-case-1.txt'} | ${12}
    ${'input.txt'}         | ${6000}
  `('it calculates the letterCounts for $file', async ({ file, expected }) => {
    const input = await getInput(__dirname, file)

    expect(checksum(input)).toEqual(expected)
  })
})

describe('part 2 - #findTheBox', () => {
  test.each`
    file                   | expected
    ${'part-2-case-1.txt'} | ${'fgij'}
    ${'input.txt'}         | ${'pbykrmjmizwhxlqnasfgtycdv'}
  `('it calculates the letterCounts for $file', async ({ file, expected }) => {
    const input = await getInput(__dirname, file)

    expect(findTheBox(input)).toEqual(expected)
  })
})

describe('getCharacterPermutations', () => {
  test.each`
    input      | expected
    ${'abcde'} | ${new Set(['_bcde', 'a_cde', 'ab_de', 'abc_e', 'abcd_'])}
  `(
    'it calculates the permutations for replacing each letter of$input',
    ({ input, expected }) => {
      expect(getCharacterPermutations(input)).toEqual(expected)
    }
  )
})
