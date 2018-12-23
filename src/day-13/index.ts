import Track from './Track'
import { SegmentSymbol } from './types'

export function findFirstCollision(input: string) {
  const track = inputToTrack(input)
  const cart = track.findFirstCollision()
  return { x: cart.x, y: cart.y }
}

export function findLastCart(input: string) {
  const track = inputToTrack(input)
  const cart = track.findLastCart()
  return { x: cart.x, y: cart.y }
}

function inputToTrack(input: string) {
  const lines = input
    .split('\n')
    .map(line => line.split('')) as SegmentSymbol[][]

  return Track.fromLines(lines)
}
