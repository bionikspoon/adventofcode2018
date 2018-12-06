import R from 'ramda'
import Counter from '../utils/Counter'
import parseLines from '../utils/parseLines'

// PART 1
export function checksum(input: string) {
  const counter = new Counter()

  parseLines(input)
    .map(letterCounts)
    .forEach(counts => {
      if (counts.has(2)) counter.add(2)
      if (counts.has(3)) counter.add(3)
    })

  return counter.getValue(2) * counter.getValue(3)
}

export function letterCounts(input: string) {
  return new Set(
    input
      .split('')
      .reduce((counter, letter) => counter.add(letter), new Counter())
      .deleteValue(1)
      .values()
  )
}

// PART 2

export function findTheBox(input: string) {
  const idSet = new Set()

  for (const permutation of getLinePermutations(input)) {
    if (idSet.has(permutation)) return permutation.replace('_', '')

    idSet.add(permutation)
  }

  throw new Error('Could not find the box')
}

function* getLinePermutations(input: string) {
  for (const line of parseLines(input)) {
    for (const permutation of getCharacterPermutations(line).values()) {
      yield permutation
    }
  }
}

export function getCharacterPermutations(input: string) {
  const results = new Set<string>()

  for (const index of R.range(0, input.length)) {
    const nextString = `${input.substr(0, index)}_${input.substr(index + 1)}`
    results.add(nextString)
  }

  return results
}
