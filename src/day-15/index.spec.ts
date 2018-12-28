import { playRoundsRepr } from '.'
import { getInput } from '../utils/tests'

describe.each`
  file                    | rounds | reprFile                | skip
  ${'case-1-round-0.txt'} | ${0}   | ${'case-1-round-0.txt'} | ${false}
  ${'case-1-round-0.txt'} | ${1}   | ${'case-1-round-1.txt'} | ${false}
  ${'case-1-round-0.txt'} | ${2}   | ${'case-1-round-2.txt'} | ${false}
  ${'case-1-round-0.txt'} | ${3}   | ${'case-1-round-3.txt'} | ${false}
`('given input $file', ({ file, rounds, reprFile, skip }) => {
  const TEST = skip ? test.skip : test
  let input: string
  let repr: string

  beforeEach(async () => {
    input = await getInput(__dirname, file)
    repr = await getInput(__dirname, reprFile)
  })

  TEST(`after ${rounds} round(s) it has a state`, () => {
    expect(playRoundsRepr(input, rounds)).toEqual(repr)
  })
})
