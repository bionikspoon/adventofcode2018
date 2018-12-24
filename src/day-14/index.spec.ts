import { countRecipes, predictNextScores } from '.'

describe.each`
  after     | expected        | skip
  ${9}      | ${'5158916779'} | ${false}
  ${5}      | ${'0124515891'} | ${false}
  ${18}     | ${'9251071085'} | ${false}
  ${2018}   | ${'5941429882'} | ${false}
  ${147061} | ${'2145581131'} | ${true}
`('given after $after recipes', ({ after, expected, skip }) => {
  const TEST = skip ? test.skip : test

  TEST(`it predicts the next ${expected.length} scores`, () => {
    expect(predictNextScores(after, expected.length)).toEqual(expected)
  })
})

describe.each`
  sequence    | expected  | skip
  ${'51589'}  | ${9}      | ${false}
  ${'01245'}  | ${5}      | ${false}
  ${'92510'}  | ${18}     | ${false}
  ${'59414'}  | ${2018}   | ${false}
  ${'147061'} | ${147061} | ${true}
`('given sequence $sequence ', ({ expected, skip, sequence }) => {
  const TEST = skip ? test.skip : test

  TEST(`it counts the number of iterations to find sequence`, () => {
    expect(countRecipes(sequence)).toEqual(expected)
  })
})
