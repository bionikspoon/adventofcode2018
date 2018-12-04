import R from 'ramda'
import parseLines from '../utils/parseLines'

export function findOverlappingClaims(input: string) {
  const tree: { [key: string]: number[] } = {}
  const claims = parseLines(input).map(parseClaim)

  claims.forEach(claim => {
    for (const y of R.range(claim.top, claim.height + claim.top)) {
      for (const x of R.range(claim.left, claim.width + claim.left)) {
        const key = `${x} ${y}`
        const ids = tree[key] || []

        tree[key] = [...ids, claim.id]
      }
    }
  })

  return Array.from(Object.values(tree)).filter(point => point.length > 1)
    .length
}

const RE_PARSE_CLAIM = /^#(?<id>\d+)\s@\s(?<left>\d+),(?<top>\d+):\s(?<width>\d+)x(?<height>\d+)$/gmu

export function parseClaim(claim: string) {
  const match = new RegExp(RE_PARSE_CLAIM).exec(claim)
  if (match === null || match.groups === undefined) {
    throw new Error(`Unknown claim format: ${claim}`)
  }

  return {
    id: parseInt(match.groups.id),
    height: parseInt(match.groups.height),
    width: parseInt(match.groups.width),
    left: parseInt(match.groups.left),
    top: parseInt(match.groups.top),
  }
}
