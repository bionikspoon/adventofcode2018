import { Piece } from './Piece'
import { Direction, Token } from './shared'

export default class Cell {
  public static getKey(x: number, y: number) {
    return `${y.toString().padStart(2, '0')}_${x.toString().padStart(2, '0')}`
  }

  public static getKeyByDirection(x: number, y: number, direction: Direction) {
    switch (direction) {
      case Direction.N:
        return Cell.getKey(x, y - 1)
      case Direction.S:
        return Cell.getKey(x, y + 1)
      case Direction.E:
        return Cell.getKey(x + 1, y)
      case Direction.W:
        return Cell.getKey(x - 1, y)
    }
  }
  public piece: Piece
  public readonly x: number
  public readonly y: number
  private readonly key: string
  constructor(x: number, y: number, token: Token) {
    this.x = x
    this.y = y
    this.key = Cell.getKey(this.x, this.y)
    this.piece = Piece.from(token, this)
  }

  public getKey() {
    return this.key
  }

  public toString() {
    return this.getKey()
  }
}
