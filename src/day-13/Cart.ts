import { CartSymbol } from './types'

export default class Cart {
  public x: number
  public y: number
  public symbol: CartSymbol | 'X'
  public crashed = false

  private nextIntersection: 'GO_LEFT' | 'GO_FORWARD' | 'GO_RIGHT' = 'GO_LEFT'
  constructor(x: number, y: number, symbol: CartSymbol) {
    this.x = x
    this.y = y
    this.symbol = symbol
  }

  public bump() {
    switch (this.symbol) {
      case '>':
        this.x++
        break
      case '<':
        this.x--
        break
      case '^':
        this.y--
        break
      case 'v':
        this.y++
        break
    }
    return this
  }

  public setCrashed() {
    this.crashed = true
    this.symbol = 'X'
  }

  public setIntersectionDirection() {
    this[this.nextIntersection]()
  }

  private GO_LEFT() {
    this.nextIntersection = 'GO_FORWARD'
    switch (this.symbol) {
      case '<':
        this.symbol = 'v'
        break
      case '^':
        this.symbol = '<'
        break
      case '>':
        this.symbol = '^'
        break
      case 'v':
        this.symbol = '>'
        break
    }
  }
  private GO_FORWARD() {
    this.nextIntersection = 'GO_RIGHT'
  }
  private GO_RIGHT() {
    this.nextIntersection = 'GO_LEFT'
    switch (this.symbol) {
      case '<':
        this.symbol = '^'
        break
      case '^':
        this.symbol = '>'
        break
      case '>':
        this.symbol = 'v'
        break
      case 'v':
        this.symbol = '<'
        break
    }
  }
}
