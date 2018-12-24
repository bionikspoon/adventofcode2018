import { add } from 'ramda'
export function predictNextScores(
  recipeIterations: number,
  scoresCount: number
) {
  let scores = [3, 7]
  let elvesPosition = [0, 1]

  while (scores.length < recipeIterations + scoresCount) {
    scores = scores.concat(getNextScores(elvesPosition, scores))
    elvesPosition = elvesPosition.map(nextPosition(scores))
  }

  return scores.slice(recipeIterations, recipeIterations + scoresCount).join('')
}

function nextPosition(
  scores: number[]
): (value: number, index: number, array: number[]) => number {
  return i => (i + scores[i] + 1) % scores.length
}

export function countRecipes(sequence: string) {
  let scores = [3, 7]
  let elvesPosition = [0, 1]
  const offset = elvesPosition.length + sequence.length

  while (
    !scores
      .slice(scores.length - offset)
      .join('')
      .includes(sequence)
  ) {
    scores = scores.concat(getNextScores(elvesPosition, scores))
    elvesPosition = elvesPosition.map(nextPosition(scores))
  }

  return scores.length - sequence.length
}

const unaryParseInt = (s: string) => parseInt(s, 10)
const flipProp: <T>(list: T[]) => (i: number) => T = list => i => list[i]
function toDigits(target: number | string): number[] {
  return target
    .toString()
    .split('')
    .map(unaryParseInt)
}

function getNextScores(elvesPosition: number[], scores: number[]) {
  return toDigits(elvesPosition.map(flipProp(scores)).reduce(add))
}
