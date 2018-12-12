import { findWinningScore } from '.'

describe('part 1', () => {
  describe.each`
    input                                                 | expected      | skip
    ${'9 players; last marble is worth 25 points'}        | ${32}         | ${false}
    ${'10 players; last marble is worth 1618 points'}     | ${8317}       | ${false}
    ${'13 players; last marble is worth 7999 points'}     | ${146373}     | ${false}
    ${'17 players; last marble is worth 1104 points'}     | ${2764}       | ${false}
    ${'21 players; last marble is worth 6111 points'}     | ${54718}      | ${false}
    ${'30 players; last marble is worth 5807 points'}     | ${37305}      | ${false}
    ${'403 players; last marble is worth 71920 points'}   | ${439089}     | ${false}
    ${'403 players; last marble is worth 7192000 points'} | ${3668541094} | ${false}
  `('given $input', ({ input, expected, skip }) => {
    const TEST = skip ? test.skip : test

    TEST(`it has a high score of ${expected}`, () => {
      expect(findWinningScore(input)).toEqual(expected)
    })
  })
})
