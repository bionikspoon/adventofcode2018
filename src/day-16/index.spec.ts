import { doStuff } from '.'
import { getInput } from '../utils/tests'

describe.each`
  file           | skip
  ${'input.txt'} | ${false}
`('given $file', ({ file, skip }) => {
  const TEST = skip ? test.skip : test
  let input: string

  beforeEach(async () => {
    input = await getInput(__dirname, file)
  })

  TEST('it does stuff', () => {
    expect(doStuff(input)).toEqual({})
  })
})
