import { compute, instructionsToLog } from '.'
import { getInput } from '../utils/tests'

describe.each`
  inputFile       | logFile
  ${'case-1.txt'} | ${'case-1-log.txt'}
`('given file $inputFile', ({ inputFile, logFile }) => {
  let input: string
  let expected: string

  beforeEach(async () => {
    input = await getInput(__dirname, inputFile)
    expected = await getInput(__dirname, logFile)
  })

  test('it matches log', () => {
    expect(instructionsToLog(input)).toEqual(expected)
  })
})

describe.each`
  ip   | registry              | instruction          | expected
  ${0} | ${[0, 0, 0, 0, 0, 0]} | ${['seti', 5, 0, 1]} | ${[1, [0, 5, 0, 0, 0, 0]]}
  ${1} | ${[1, 5, 0, 0, 0, 0]} | ${['seti', 6, 0, 2]} | ${[2, [0, 5, 0, 0, 0, 0]]}
  ${2} | ${[2, 5, 6, 0, 0, 0]} | ${['addi', 0, 1, 0]} | ${[4, [0, 5, 0, 0, 0, 0]]}
  ${4} | ${[4, 5, 6, 0, 0, 0]} | ${['setr', 1, 0, 0]} | ${[6, [0, 5, 0, 0, 0, 0]]}
  ${6} | ${[6, 5, 6, 0, 0, 0]} | ${['seti', 9, 0, 5]} | ${[7, [0, 5, 0, 0, 0, 0]]}
`(
  'given registry $registry, ip $ip, and instruction $instruction',
  ({ ip, registry, instruction, expected }) => {
    test('it gets the programs next state', () => {
      expect(compute(ip, instruction, registry)).toEqual(expected)
    })
  }
)
