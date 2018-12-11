import { decodeLicenseWithIndex, decodeLicenseWithSum } from '.'
import { getInput } from '../utils/tests'

describe.each`
  file            | part1    | part2
  ${'case-1.txt'} | ${138}   | ${66}
  ${'input.txt'}  | ${37262} | ${20839}
`('given $file', ({ file, part1, part2 }) => {
  let input: string

  beforeEach(async () => {
    input = await getInput(__dirname, file)
  })

  describe('#decodeLicenseWithSum', () => {
    test('it can decode and summarize a license', () => {
      expect(decodeLicenseWithSum(input)).toEqual(part1)
    })
  })

  describe('#decodeLicenseWithIndex', () => {
    test('it can decode and summarize a license', () => {
      expect(decodeLicenseWithIndex(input)).toEqual(part2)
    })
  })
})
