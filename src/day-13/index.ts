import { head, sortWith, ascend, prop } from 'ramda'

type SegmentSymbol = ' ' | '|' | 'v' | '^' | '-' | '>' | '<' | '\\' | '/' | '+'
type CartSymbol = '>' | '<' | 'v' | '^'
export function findFirstCollision(input: string) {
  const lines = input
    .split('\n')
    .map(line => line.split('')) as SegmentSymbol[][]
  return Tracks.fromLines(lines)
    .tick()
    .tick()
    .tick()
    .repr()
}

function isCartSymbol(symbol: string): symbol is CartSymbol {
  const cartSymbols = ['>', '<', 'v', '^']

  return cartSymbols.includes(symbol)
}

class Tracks {
  public static fromLines(lines: SegmentSymbol[][]) {
    const tracks = new Tracks()
    const height = lines.length
    const width = head(lines)!.length
    tracks.segments = []
    for (let y = 0; y < height; y++) {
      const rowSegments = []
      const row = lines[y]

      for (let x = 0; x < width; x++) {
        const symbol = row[x]
        if (symbol === undefined) throw new Error('Something went wrong')
        const SegmentConstructor = Tracks.getSegmentConstructor(
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

abstract class Segment {
  public x: number
  public y: number
  protected readonly symbol: SegmentSymbol = ' '
  protected cart: Cart | null = null

  public constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  public connect(segments: Segment[][]) {
    return this
  }

  public addCart(cart: Cart) {
    this.cart = cart
  }
  public removeCart() {
    this.cart = null
  }

  public getSymbol() {
    if (this.cart === null) return this.symbol

    return this.cart.symbol
  }
}

class Empty extends Segment {}
class Vertical extends Segment {
  public readonly symbol: SegmentSymbol = '|'

  private n: Segment
  private s: Segment
  constructor(x: number, y: number) {
    super(x, y)
    this.n = new Empty(x, y - 1)
    this.s = new Empty(x, y + 1)
  }
  public connect(segments: Segment[][]) {
    if (Array.isArray(segments[this.y - 1])) {
      this.n = segments[this.y - 1][this.x]
    }
    if (Array.isArray(segments[this.y + 1])) {
      this.s = segments[this.y + 1][this.x]
    }

    return this
  }
}
class Horizontal extends Segment {
  public readonly symbol: SegmentSymbol = '-'

  private e: Segment
  private w: Segment
  constructor(x: number, y: number) {
    super(x, y)
    this.e = new Empty(x + 1, y)
    this.w = new Empty(x - 1, y)
  }
  public connect(segments: Segment[][]) {
    if (Array.isArray(segments[this.y])) {
      this.e = segments[this.y][this.x + 1]
      this.w = segments[this.y][this.x - 1]
    }

    return this
  }
}
class SWCorner extends Segment {
  public readonly symbol: SegmentSymbol = '\\'

  private n: Segment
  private e: Segment
  constructor(x: number, y: number) {
    super(x, y)
    this.n = new Empty(x, y - 1)
    this.e = new Empty(x + 1, y)
  }
  public connect(segments: Segment[][]) {
    if (Array.isArray(segments[this.y - 1])) {
      this.n = segments[this.y - 1][this.x]
    }
    if (Array.isArray(segments[this.y])) {
      this.e = segments[this.y][this.x + 1]
    }

    return this
  }

  public addCart(cart: Cart) {
    super.addCart(cart)

    cart.symbol = cart.symbol === 'v' ? '>' : '^'
  }
}
class NECorner extends Segment {
  public readonly symbol: SegmentSymbol = '\\'

  private s: Segment
  private w: Segment
  constructor(x: number, y: number) {
    super(x, y)
    this.s = new Empty(x, y + 1)
    this.w = new Empty(x - 1, y)
  }
  public connect(segments: Segment[][]) {
    if (Array.isArray(segments[this.y + 1])) {
      this.s = segments[this.y + 1][this.x]
    }
    if (Array.isArray(segments[this.y])) {
      this.w = segments[this.y][this.x - 1]
    }

    return this
  }

  public addCart(cart: Cart) {
    super.addCart(cart)

    cart.symbol = cart.symbol === '^' ? '<' : 'v'
  }
}

class NWCorner extends Segment {
  public readonly symbol: SegmentSymbol = '/'

  private s: Segment
  private e: Segment
  constructor(x: number, y: number) {
    super(x, y)
    this.s = new Empty(x, y + 1)
    this.e = new Empty(x + 1, y)
  }
  public connect(segments: Segment[][]) {
    if (Array.isArray(segments[this.y + 1])) {
      this.s = segments[this.y + 1][this.x]
    }
    if (Array.isArray(segments[this.y])) {
      this.e = segments[this.y][this.x + 1]
    }

    return this
  }

  public addCart(cart: Cart) {
    super.addCart(cart)

    cart.symbol = cart.symbol === '^' ? '>' : 'v'
  }
}
class SECorner extends Segment {
  public readonly symbol: SegmentSymbol = '/'

  private n: Segment
  private w: Segment
  constructor(x: number, y: number) {
    super(x, y)
    this.n = new Empty(x, y - 1)
    this.w = new Empty(x - 1, y)
  }
  public connect(segments: Segment[][]) {
    if (Array.isArray(segments[this.y - 1])) {
      this.n = segments[this.y - 1][this.x]
    }
    if (Array.isArray(segments[this.y])) {
      this.w = segments[this.y][this.x - 1]
    }

    return this
  }

  public addCart(cart: Cart) {
    super.addCart(cart)

    cart.symbol = cart.symbol === 'v' ? '<' : '^'
  }
}
class Intersection extends Segment {
  public readonly symbol: SegmentSymbol = '+'

  private n: Segment
  private w: Segment
  private s: Segment
  private e: Segment
  constructor(x: number, y: number) {
    super(x, y)
    this.n = new Empty(x, y - 1)
    this.w = new Empty(x - 1, y)
    this.s = new Empty(x, y + 1)
    this.e = new Empty(x + 1, y)
  }
  public connect(segments: Segment[][]) {
    if (Array.isArray(segments[this.y - 1])) {
      this.n = segments[this.y - 1][this.x]
    }
    if (Array.isArray(segments[this.y + 1])) {
      this.s = segments[this.y + 1][this.x]
    }
    if (Array.isArray(segments[this.y])) {
      this.e = segments[this.y][this.x + 1]
      this.w = segments[this.y][this.x - 1]
    }

    return this
  }

  public addCart(cart: Cart) {
    super.addCart(cart)

    cart.setIntersectionDirection()
  }
}

class Cart {
  public x: number
  public y: number
  public symbol: CartSymbol

  private intersectionDirection:
    | 'setIntersectionDirection_LEFT'
    | 'setIntersectionDirection_FORWARD'
    | 'setIntersectionDirection_RIGHT' = 'setIntersectionDirection_LEFT'
  constructor(x: number, y: number, symbol: CartSymbol) {
    this.x = x
    this.y = y
    this.symbol = symbol
  }

  public move(segments: Segment[][]) {
    const currentSegment = segments[this.y][this.x]
    const nextSegment = this.getNextSegment(segments)

    currentSegment.removeCart()
    nextSegment.addCart(this)
    this.x = nextSegment.x
    this.y = nextSegment.y

    return this
  }

  public setIntersectionDirection() {
    this[this.intersectionDirection]()
  }

  private setIntersectionDirection_LEFT() {
    this.intersectionDirection = 'setIntersectionDirection_FORWARD'
    switch (this.symbol) {
      case '<':
        this.symbol = 'v'
      case '^':
        this.symbol = '<'
      case '>':
        this.symbol = '^'
      case 'v':
        this.symbol = '>'
    }
  }
  private setIntersectionDirection_FORWARD() {
    this.intersectionDirection = 'setIntersectionDirection_RIGHT'
  }
  private setIntersectionDirection_RIGHT() {
    this.intersectionDirection = 'setIntersectionDirection_LEFT'
    switch (this.symbol) {
      case '<':
        this.symbol = '^'
      case '^':
        this.symbol = '>'
      case '>':
        this.symbol = 'v'
      case 'v':
        this.symbol = '<'
    }
  }

  private getNextSegment(segments: Segment[][]) {
    switch (this.symbol) {
      case '>':
        return segments[this.y][this.x + 1]
      case '<':
        return segments[this.y][this.x - 1]
      case '^':
        return segments[this.y - 1][this.x]
      case 'v':
        return segments[this.y + 1][this.x]
    }
  }
}
