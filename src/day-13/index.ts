import Track from './Track'
import { SegmentSymbol } from './types'

export function findFirstCollision(input: string) {
  const lines = input
    .split('\n')
    .map(line => line.split('')) as SegmentSymbol[][]
  return Track.fromLines(lines)
    .tick()
    .tick()
    .tick()
    .repr()
}
