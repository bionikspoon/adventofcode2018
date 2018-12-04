import R from 'ramda'
import parseLines from '../utils/parseLines'

// PART 1
export function findOverlappingClaimsCount(input: string) {
  const claims = parseLines(input).map(parseClaim)
  const tree = buildTree(claims)

  return Array.from(Object.values(tree)).filter(point => point.length > 1)
    .length
}

// PART 2
export function findNonOverlappingClaimIds(input: string) {
  const claims = parseLines(input).map(parseClaim)
  const tree = buildTree(claims)
  const overlappingClaims = new Set<number>(
    R.unnest(Array.from(Object.values(tree)).filter(point => point.length > 1))
  )

  return claims.map(claim => claim.id).filter(id => !overlappingClaims.has(id))
}

// SHARED
function buildTree(claims: IClaim[]) {
  const tree: { [key: string]: number[] } = {}
  claims.forEach(claim => {
    for (const y of R.range(claim.top, claim.height + claim.top)) {
      for (const x of R.range(claim.left, claim.width + claim.left)) {
        const key = `${x} ${y}`
        const ids = tree[key] || []

        tree[key] = [...ids, claim.id]
      }
    }
  })

  return tree
}

interface IClaim {
  id: number
  height: number
  width: number
  left: number
  top: number
}
const RE_PARSE_CLAIM = /^#(?<id>\d+)\s@\s(?<left>\d+),(?<top>\d+):\s(?<width>\d+)x(?<height>\d+)$/gmu

export function parseClaim(claim: string): IClaim {
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
