import { instructionsToLog, run, runInstructions } from '.'
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
  inputFile       | initialRegistry       | expected                            | skip
  ${'case-1.txt'} | ${[0, 0, 0, 0, 0, 0]} | ${[7, 5, 6, 0, 0, 9]}               | ${false}
  ${'input.txt'}  | ${[0, 0, 0, 0, 0, 0]} | ${[1302, 1026, 1026, 1025, 1, 257]} | ${false}
  ${'input.txt'}  | ${[1, 0, 0, 0, 0, 0]} | ${[1302, 1026, 1026, 1025, 1, 257]} | ${false}
`('given file $inputFile', ({ inputFile, initialRegistry, expected, skip }) => {
  const TEST = skip ? test.skip : test
  let input: string

  beforeEach(async () => {
    input = await getInput(__dirname, inputFile)
  })

  TEST('it returns the registry', () => {
    expect(runInstructions(input, initialRegistry)).toEqual(expected)
  })
})

describe.each`
  ip   | registry              | instruction          | expected
  ${0} | ${[0, 0, 0, 0, 0, 0]} | ${['seti', 5, 0, 1]} | ${[1, [0, 5, 0, 0, 0, 0]]}
  ${1} | ${[0, 5, 0, 0, 0, 0]} | ${['seti', 6, 0, 2]} | ${[2, [1, 5, 6, 0, 0, 0]]}
  ${2} | ${[1, 5, 6, 0, 0, 0]} | ${['addi', 0, 1, 0]} | ${[4, [3, 5, 6, 0, 0, 0]]}
  ${4} | ${[3, 5, 6, 0, 0, 0]} | ${['setr', 1, 0, 0]} | ${[6, [5, 5, 6, 0, 0, 0]]}
  ${6} | ${[5, 5, 6, 0, 0, 0]} | ${['seti', 9, 0, 5]} | ${[7, [6, 5, 6, 0, 0, 9]]}
`(
  'given registry $registry, ip $ip, and instruction $instruction',
  ({ ip, registry, instruction, expected }) => {
    test('it gets the programs next state', () => {
      expect(run(0, ip, instruction, registry)).toEqual(expected)
    })
  }
)
