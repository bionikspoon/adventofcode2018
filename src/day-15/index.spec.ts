import { playRoundsRepr } from '.'
import { getInput } from '../utils/tests'

describe.each`
  file                    | rounds | reprFile
  ${'case-1-round-0.txt'} | ${0}   | ${'case-1-round-0.txt'}
  ${'case-1-round-0.txt'} | ${1}   | ${'case-1-round-1.txt'}
  ${'case-1-round-0.txt'} | ${2}   | ${'case-1-round-2.txt'}
  ${'case-1-round-0.txt'} | ${3}   | ${'case-1-round-3.txt'}
`('given input $file', ({ file, rounds, reprFile }) => {
  let input: string
  let repr: string

  beforeEach(async () => {
    input = await getInput(__dirname, file)
    repr = await getInput(__dirname, reprFile)
  })

  test('it can move avatars per round', () => {
    expect(playRoundsRepr(input, rounds)).toEqual(repr)
  })
})
