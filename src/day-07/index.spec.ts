import {
  findInstructionsOrder,
  findTimedInstructionsOrder,
  findTimeToCompletion,
} from '.'
import { getInput } from '../utils/tests'

describe('part 1', () => {
  describe.each`
    file            | expected                        | skip
    ${'case-1.txt'} | ${'CABDFE'}                     | ${false}
    ${'input.txt'}  | ${'OVXCKZBDEHINPFSTJLUYRWGAMQ'} | ${false}
  `('given $file', ({ file, expected, skip }) => {
    const TEST = skip ? test.skip : test
    let input: string

    beforeEach(async () => {
      input = await getInput(__dirname, file)
    })

    TEST('it finds the order of operations', () => {
      expect(findInstructionsOrder(input)).toEqual(expected)
    })
  })
})
describe('part 2', () => {
  describe.each`
    file            | workers | baseTime | expectedOrder                   | expectedTime | skip
    ${'case-1.txt'} | ${2}    | ${0}     | ${'CABFDE'}                     | ${15}        | ${false}
    ${'input.txt'}  | ${5}    | ${60}    | ${'OVXZCBDEKHPSINTFJLUYRWGAMQ'} | ${955}       | ${false}
  `(
    'given $file',
    ({ file, expectedOrder, expectedTime, skip, workers, baseTime }) => {
      const TEST = skip ? test.skip : test
      let input: string

      beforeEach(async () => {
        input = await getInput(__dirname, file)
      })

      TEST('it finds the order of operations', () => {
        expect(findTimedInstructionsOrder(input, workers, baseTime)).toEqual(
          expectedOrder
        )
      })

      TEST('it finds the amount of time to assemble the sercret device', () => {
        expect(findTimeToCompletion(input, workers, baseTime)).toEqual(
          expectedTime
        )
      })
    }
  )
})
