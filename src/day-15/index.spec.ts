import { playRoundsRepr, simulateBattle } from '.'
import { getInput } from '../utils/tests'

describe.each`
  file        | rounds | skip
  ${'case-1'} | ${0}   | ${false}
  ${'case-1'} | ${1}   | ${false}
  ${'case-1'} | ${2}   | ${false}
  ${'case-1'} | ${3}   | ${false}
  ${'case-2'} | ${0}   | ${false}
  ${'case-2'} | ${1}   | ${false}
  ${'case-2'} | ${2}   | ${false}
  ${'case-2'} | ${23}  | ${false}
  ${'case-2'} | ${24}  | ${false}
  ${'case-2'} | ${25}  | ${false}
  ${'case-2'} | ${26}  | ${false}
  ${'case-2'} | ${27}  | ${false}
  ${'case-2'} | ${28}  | ${false}
  ${'case-2'} | ${47}  | ${false}
  ${'case-3'} | ${0}   | ${false}
  ${'case-3'} | ${38}  | ${false}
  ${'case-4'} | ${0}   | ${false}
  ${'case-4'} | ${47}  | ${false}
  ${'case-5'} | ${0}   | ${false}
  ${'case-5'} | ${36}  | ${false}
  ${'case-6'} | ${0}   | ${false}
  ${'case-6'} | ${55}  | ${false}
  ${'case-7'} | ${0}   | ${false}
  ${'case-7'} | ${21}  | ${false}
  ${'input'}  | ${0}   | ${false}
`('given input $file', ({ file, rounds, skip }) => {
  const TEST = skip ? test.skip : test
  let input: string
  let expected: string

  beforeEach(async () => {
    const inputFile = `${file}.txt`
    const expectedFile = `${file}-round-${rounds
      .toString()
      .padStart(2, '0')}.txt`
    input = await getInput(__dirname, inputFile)
    expected = await getInput(__dirname, expectedFile)
  })

  TEST(`after ${rounds} round(s) it has a state`, () => {
    expect(playRoundsRepr(input, rounds)).toEqual(expected)
  })
})

describe.each`
  file        | rounds | hitPoints | result    | skip
  ${'case-2'} | ${47}  | ${590}    | ${27730}  | ${true}
  ${'case-3'} | ${37}  | ${982}    | ${36334}  | ${false}
  ${'case-4'} | ${46}  | ${859}    | ${39514}  | ${false}
  ${'case-5'} | ${35}  | ${793}    | ${27755}  | ${false}
  ${'case-6'} | ${54}  | ${536}    | ${28944}  | ${false}
  ${'case-7'} | ${20}  | ${937}    | ${18740}  | ${false}
  ${'input'}  | ${98}  | ${2512}   | ${246176} | ${true}
`('given input $file', ({ file, rounds, hitPoints, skip, result }) => {
  const TEST = skip ? test.skip : test
  let input: string

  beforeEach(async () => {
    const inputFile = `${file}.txt`

    input = await getInput(__dirname, inputFile)
  })

  TEST(`battle ends after ${rounds} rounds`, () => {
    expect(simulateBattle(input)).toEqual({ rounds, hitPoints, result })
  })
})
