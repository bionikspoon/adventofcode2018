import { decodeLicense } from '.'
import { getInput } from '../utils/tests'

describe('part 1', () => {
  describe.each`
    file            | expected | skip
    ${'case-1.txt'} | ${138}   | ${false}
    ${'input.txt'}  | ${37262} | ${false}
  `('given $file', ({ file, expected, skip }) => {
    const TEST = skip ? test.skip : test
    let input: string

    beforeEach(async () => {
      input = await getInput(__dirname, file)
    })

    TEST('it can decode and summarize a license', () => {
      expect(decodeLicense(input)).toEqual(expected)
    })
  })
})
