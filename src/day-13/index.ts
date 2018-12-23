import Track from './Track'
import { SegmentSymbol } from './types'

export function findFirstCollision(input: string) {
  const { x, y } = inputToTrack(input).findFirstCollision()
  return { x, y }
}

export function findLastCart(input: string) {
  const { x, y } = inputToTrack(input).findLastCart()
  return { x, y }
}

function inputToTrack(input: string) {
  const lines = input
    .split('\n')
    .map(line => line.split('')) as SegmentSymbol[][]

  return Track.fromLines(lines)
}
