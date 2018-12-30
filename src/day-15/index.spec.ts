import { playRoundsRepr } from '.'
import { getInput } from '../utils/tests'

describe.each`
  file            | rounds | reprFile                 | skip
  ${'case-1.txt'} | ${0}   | ${'case-1-round-0.txt'}  | ${false}
  ${'case-1.txt'} | ${1}   | ${'case-1-round-1.txt'}  | ${false}
  ${'case-1.txt'} | ${2}   | ${'case-1-round-2.txt'}  | ${false}
  ${'case-1.txt'} | ${3}   | ${'case-1-round-3.txt'}  | ${false}
  ${'case-2.txt'} | ${0}   | ${'case-2-round-00.txt'} | ${false}
  ${'case-2.txt'} | ${1}   | ${'case-2-round-01.txt'} | ${false}
  ${'case-2.txt'} | ${2}   | ${'case-2-round-02.txt'} | ${false}
  ${'case-2.txt'} | ${23}  | ${'case-2-round-23.txt'} | ${false}
  ${'case-2.txt'} | ${24}  | ${'case-2-round-24.txt'} | ${false}
  ${'case-2.txt'} | ${25}  | ${'case-2-round-25.txt'} | ${false}
  ${'case-2.txt'} | ${26}  | ${'case-2-round-26.txt'} | ${false}
  ${'case-2.txt'} | ${27}  | ${'case-2-round-27.txt'} | ${false}
  ${'case-2.txt'} | ${28}  | ${'case-2-round-28.txt'} | ${false}
  ${'case-2.txt'} | ${47}  | ${'case-2-round-47.txt'} | ${false}
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
