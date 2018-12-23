import Cart from './Cart'
import { SegmentSymbol } from './types'

export abstract class Segment {
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

export class Empty extends Segment {}
export class Vertical extends Segment {
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
export class Horizontal extends Segment {
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
export class SWCorner extends Segment {
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
export class NECorner extends Segment {
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

export class NWCorner extends Segment {
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
export class SECorner extends Segment {
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
export class Intersection extends Segment {
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
