import Track from './Track'
import { SegmentSymbol } from './types'

export function findFirstCollision(input: string) {
  const lines = input
    .split('\n')
    .map(line => line.split('')) as SegmentSymbol[][]

  try {
    const track = Track.fromLines(lines)
    while (true) {
      track.tick()
    }
  } catch (cart) {
    return { x: cart.x, y: cart.y }
  }
}
