import { ascend, prop, sortWith } from 'ramda'
import Cart from './Cart'
import * as Segment from './Segment'
import { isCartSymbol, SegmentSymbol } from './types'

export default class Track {
  public static fromLines(lines: SegmentSymbol[][]) {
    const tracks = new Track()

    tracks.segments = lines.map((line, y) =>
      line.map((symbol, x) => {
        const SegmentConstructor = getSegmentConstructor(symbol, x, y, lines)
        if (isCartSymbol(symbol)) tracks.carts.push(new Cart(x, y, symbol))
        return new SegmentConstructor(x, y)
      })
    )

    return tracks.registerCarts()
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

  public findFirstCollision() {
    try {
      while (true) {
        this.shortTick()
      }
    } catch ([cart]) {
      return cart as Cart
    }

    throw new Error('Something went wrong.')
  }

  public findLastCart() {
    while (this.carts.length > 1) {
      this.longTick()
    }

    return this.carts[0]
  }

  private registerCarts() {
    for (const cart of this.carts) {
      const segment = this.segments[cart.y][cart.x]
      segment.addCart(cart)
    }
    return this
  }

  private shortTick() {
    const carts = sortCarts(this.carts)

    for (const cart of carts) {
      this.moveCart(cart)
    }

    return this
  }

  private longTick() {
    const carts = sortCarts(this.carts)

    for (const cart of carts) {
      if (!this.carts.includes(cart)) continue
      try {
        this.moveCart(cart)
      } catch ([cart1, cart2]) {
        this.carts = this.carts.filter(c => !c.crashed)
        this.segments[cart1.y][cart1.x].removeCart()
        this.segments[cart2.y][cart2.x].removeCart()
      }
    }
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

const HORIZONTAL_SYMBOLS = ['>', '<', '-', '+']
const VERTICAL_SYMBOLS = ['|', 'v', '^', '+']

function getSegmentConstructor(
  symbol: SegmentSymbol,
  x: number,
  y: number,
  lines: SegmentSymbol[][]
): new (x: number, y: number) => Segment.Segment {
  if (symbol === '+') return Segment.Intersection
  if (symbol === ' ') return Segment.Empty
  if (HORIZONTAL_SYMBOLS.includes(symbol)) return Segment.Horizontal
  if (VERTICAL_SYMBOLS.includes(symbol)) return Segment.Vertical
  if (symbol === '/') return getSENWSegmentConstructor(x, y, lines)
  if (symbol === '\\') return getSWNESegmentConstructor(x, y, lines)

  throw new Error('Something went wrong.')
}

function getSENWSegmentConstructor(
  x: number,
  y: number,
  lines: SegmentSymbol[][]
) {
  const isSymbol = isSymbolFactory(lines)
  if (
    isSymbol(x - 1, y, HORIZONTAL_SYMBOLS) &&
    isSymbol(x, y - 1, VERTICAL_SYMBOLS)
  ) {
    return Segment.SECorner
  }

  if (
    isSymbol(x + 1, y, HORIZONTAL_SYMBOLS) &&
    isSymbol(x, y + 1, VERTICAL_SYMBOLS)
  ) {
    return Segment.NWCorner
  }

  throw new Error('Something went wrong.')
}

function getSWNESegmentConstructor(
  x: number,
  y: number,
  lines: SegmentSymbol[][]
) {
  const isSymbol = isSymbolFactory(lines)

  if (
    isSymbol(x + 1, y, HORIZONTAL_SYMBOLS) &&
    isSymbol(x, y - 1, VERTICAL_SYMBOLS)
  ) {
    return Segment.SWCorner
  }

  if (
    isSymbol(x - 1, y, HORIZONTAL_SYMBOLS) &&
    isSymbol(x, y + 1, VERTICAL_SYMBOLS)
  ) {
    return Segment.NECorner
  }
  throw new Error('Something went wrong.')
}

function isSymbolFactory(lines: SegmentSymbol[][]) {
  return (x: number, y: number, symbols: string[]) =>
    Array.isArray(lines[y]) && symbols.includes(lines[y][x])
}
