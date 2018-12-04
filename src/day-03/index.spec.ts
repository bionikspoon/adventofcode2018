import { findOverlappingClaims, parseClaim } from '.'
import { getInput } from '../utils/tests'

describe('part 1 - #findOverlappingClaims', () => {
  test.each`
    file                   | expected
    ${'part-1-case-1.txt'} | ${4}
    ${'input.txt'}         | ${104241}
  `('it finds the overlapping claims in $file', async ({ file, expected }) => {
    const input = await getInput(__dirname, file)

    expect(findOverlappingClaims(input)).toEqual(expected)
  })
})

describe('#parseClaim', () => {
  test.each`
    claim                     | id    | left   | top    | width | height
    ${'#1 @ 1,3: 4x4'}        | ${1}  | ${1}   | ${3}   | ${4}  | ${4}
    ${'#1 @ 749,666: 27x15'}  | ${1}  | ${749} | ${666} | ${27} | ${15}
    ${'#88 @ 669,877: 11x24'} | ${88} | ${669} | ${877} | ${11} | ${24}
  `(
    'it parses a claim into an object: $claim',
    ({ claim, id, left, top, width, height }) => {
      expect(parseClaim(claim)).toEqual({ id, left, top, width, height })
    }
  )
})
