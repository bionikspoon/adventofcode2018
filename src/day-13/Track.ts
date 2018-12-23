import { ascend, head, prop, sortWith } from 'ramda'
import Cart from './Cart'
import * as Segment from './Segment'
import { isCartSymbol, SegmentSymbol } from './types'

export default class Track {
  public static fromLines(lines: SegmentSymbol[][]) {
    const tracks = new Track()
    const height = lines.length
    const width = head(lines)!.length
    tracks.segments = []
    for (let y = 0; y < height; y++) {
      const rowSegments = []
      const row = lines[y]

      for (let x = 0; x < width; x++) {
        const symbol = row[x]
        if (symbol === undefined) throw new Error('Something went wrong')
        const SegmentConstructor = getSegmentConstructor(symbol, x, y, lines)
        rowSegments.push(new SegmentConstructor(x, y))

        if (isCartSymbol(symbol)) tracks.carts.push(new Cart(x, y, symbol))
      }

      tracks.segments.push(rowSegments)
    }

    for (const cart of tracks.carts) {
      const segment = tracks.segments[cart.y][cart.x]
      segment.addCart(cart)
    }

    return tracks
  }

  private segments: Segment.Segment[][] = []
  private carts: Cart[] = []

  public repr() {
    return (
      '\n' +
      this.segments
        .map(line => line.map(segment => segment.getSymbol()).join(''))
        .join('\n')
    )
  }
  public tick() {
    const carts = sortCarts(this.carts)

    for (const cart of carts) {
      this.moveCart(cart)
    }

    return this
  }

  private moveCart(cart: Cart) {
    const currentSegment = this.segments[cart.y][cart.x]
    currentSegment.removeCart()

    cart.bump()
    const nextSegment = this.segments[cart.y][cart.x]
    nextSegment.addCart(cart)

    return this
  }
}

const sortCarts = sortWith<Cart>([ascend(prop('y')), ascend(prop('x'))])

function getSegmentConstructor(
  symbol: SegmentSymbol,
  x: number,
  y: number,
  lines: SegmentSymbol[][]
): new (x: number, y: number) => Segment.Segment {
  const horizontalSymbols = ['>', '<', '-', '+']
  const verticalSymbols = ['|', 'v', '^', '+']

  if (symbol === '+') return Segment.Intersection
  if (horizontalSymbols.includes(symbol)) return Segment.Horizontal
  if (verticalSymbols.includes(symbol)) return Segment.Vertical

  switch (symbol) {
    case ' ':
      return Segment.Empty
    case '/':
      if (
        Array.isArray(lines[y]) &&
        horizontalSymbols.includes(lines[y][x - 1]) &&
        Array.isArray(lines[y - 1]) &&
        verticalSymbols.includes(lines[y - 1][x])
      ) {
        return Segment.SECorner
      }
      if (
        Array.isArray(lines[y]) &&
        horizontalSymbols.includes(lines[y][x + 1]) &&
        Array.isArray(lines[y + 1]) &&
        verticalSymbols.includes(lines[y + 1][x])
      ) {
        return Segment.NWCorner
      }

      throw new Error('Something went wrong.')

    case '\\':
      if (
        Array.isArray(lines[y]) &&
        horizontalSymbols.includes(lines[y][x + 1]) &&
        Array.isArray(lines[y - 1]) &&
        verticalSymbols.includes(lines[y - 1][x])
      ) {
        return Segment.SWCorner
      }
      if (
        Array.isArray(lines[y]) &&
        horizontalSymbols.includes(lines[y][x - 1]) &&
        Array.isArray(lines[y + 1]) &&
        verticalSymbols.includes(lines[y + 1][x])
      ) {
        return Segment.NECorner
      }
      throw new Error('Something went wrong.')
  }

  throw new Error('Something went wrong.')
}
