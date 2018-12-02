import { checksum, letterCounts } from '..'
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

describe('#checksum', () => {
  test.each`
    file                   | expected
    ${'part-1-case-1.txt'} | ${12}
    ${'input.txt'}         | ${6000}
  `('it calculates the letterCounts for $file', async ({ file, expected }) => {
    const input = await getInput(__dirname, file)

    expect(checksum(input)).toEqual(expected)
  })
})
