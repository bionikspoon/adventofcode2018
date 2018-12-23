import Track from './Track'
import { SegmentSymbol } from './types'

export function findFirstCollision(input: string) {
  const lines = input
    .split('\n')
    .map(line => line.split('')) as SegmentSymbol[][]

  const track = Track.fromLines(lines)
  try {
    let i = 0
    while (i < 1000) {
      track.tick()
      i++
    }
  } catch (cart) {
    return { x: cart.x, y: cart.y }
  }

  throw new Error('Something went wrong.')
}
