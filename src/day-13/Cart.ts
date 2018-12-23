import { Segment } from './Segment'
import { CartSymbol } from './types'

export default class Cart {
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
