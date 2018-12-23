import { ascend, head, prop, sortWith } from 'ramda'
import Cart from './Cart'
import {
  Empty,
  Horizontal,
  Intersection,
  NECorner,
  NWCorner,
  SECorner,
  Segment,
  SWCorner,
  Vertical,
} from './Segment'
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
        const SegmentConstructor = Track.getSegmentConstructor(
          symbol,
          x,
          y,
          lines
        )
        rowSegments.push(new SegmentConstructor(x, y))

        if (isCartSymbol(symbol)) tracks.carts.push(new Cart(x, y, symbol))
      }

      tracks.segments.push(rowSegments)
    }

    for (const row of tracks.segments) {
      for (const segment of row) {
        segment.connect(tracks.segments)
      }
    }

    for (const cart of tracks.carts) {
      const segment = tracks.segments[cart.y][cart.x]
      segment.addCart(cart)
    }

    console.log('tracks.repr()', tracks.repr())

    return tracks
  }

  private static getSegmentConstructor(
    symbol: SegmentSymbol,
    x: number,
    y: number,
    lines: SegmentSymbol[][]
  ): new (x: number, y: number) => Segment {
    const horizontalSymbols = ['>', '<', '-', '+']
    const verticalSymbols = ['|', 'v', '^', '+']

    if (symbol === '+') return Intersection
    if (horizontalSymbols.includes(symbol)) return Horizontal
    if (verticalSymbols.includes(symbol)) return Vertical

    switch (symbol) {
      case ' ':
        return Empty
      case '/':
        if (
          Array.isArray(lines[y]) &&
          horizontalSymbols.includes(lines[y][x - 1]) &&
          Array.isArray(lines[y - 1]) &&
          verticalSymbols.includes(lines[y - 1][x])
        ) {
          return SECorner
        }
        if (
          Array.isArray(lines[y]) &&
          horizontalSymbols.includes(lines[y][x + 1]) &&
          Array.isArray(lines[y + 1]) &&
          verticalSymbols.includes(lines[y + 1][x])
        ) {
          return NWCorner
        }

        throw new Error('Something went wrong.')

      case '\\':
        if (
          Array.isArray(lines[y]) &&
          horizontalSymbols.includes(lines[y][x + 1]) &&
          Array.isArray(lines[y - 1]) &&
          verticalSymbols.includes(lines[y - 1][x])
        ) {
          return SWCorner
        }
        if (
          Array.isArray(lines[y]) &&
          horizontalSymbols.includes(lines[y][x - 1]) &&
          Array.isArray(lines[y + 1]) &&
          verticalSymbols.includes(lines[y + 1][x])
        ) {
          return NECorner
        }
        throw new Error('Something went wrong.')
    }

    throw new Error('Something went wrong.')
  }
  private segments: Segment[][] = []
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
    console.log('TICK')

    for (const cart of carts) {
      cart.move(this.segments)
      console.log('this.repr()', this.repr())
    }

    return this
  }
}

const sortCarts = sortWith<Cart>([ascend(prop('y')), ascend(prop('x'))])
