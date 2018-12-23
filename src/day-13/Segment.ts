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

  public addCart(cart: Cart) {
    if (this.cart === null) {
      this.cart = cart
      return
    }

    this.cart.setCrashed()
    throw cart
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
}
export class Horizontal extends Segment {
  public readonly symbol: SegmentSymbol = '-'
}
export class SWCorner extends Segment {
  public readonly symbol: SegmentSymbol = '\\'

  public addCart(cart: Cart) {
    super.addCart(cart)

    cart.symbol = cart.symbol === 'v' ? '>' : '^'
  }
}
export class NECorner extends Segment {
  public readonly symbol: SegmentSymbol = '\\'

  public addCart(cart: Cart) {
    super.addCart(cart)

    cart.symbol = cart.symbol === '^' ? '<' : 'v'
  }
}

export class NWCorner extends Segment {
  public readonly symbol: SegmentSymbol = '/'

  public addCart(cart: Cart) {
    super.addCart(cart)

    cart.symbol = cart.symbol === '^' ? '>' : 'v'
  }
}
export class SECorner extends Segment {
  public readonly symbol: SegmentSymbol = '/'

  public addCart(cart: Cart) {
    super.addCart(cart)

    cart.symbol = cart.symbol === 'v' ? '<' : '^'
  }
}
export class Intersection extends Segment {
  public readonly symbol: SegmentSymbol = '+'

  public addCart(cart: Cart) {
    super.addCart(cart)

    cart.setIntersectionDirection()
  }
}
