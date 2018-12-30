import Board from './Board'
import Cell from './Cell'
import { Token } from './shared'

export abstract class Piece {
  public static from(token: Token, cell: Cell) {
    switch (token) {
      case '.':
        return new EmptyPiece(cell)
      case '#':
        return new WallPiece(cell)
      case 'G':
        return new GoblinPlayer(cell)
      case 'E':
        return new ElfPlayer(cell)
    }
  }
  public abstract readonly token: Token
  public cell: Cell
  constructor(cell: Cell) {
    this.cell = cell
  }

  public getKey() {
    return this.cell.getKey()
  }

  public getAdjacentPieces(board: Board) {
    return board
      .getVertexByKey(this.getKey())
      .getNeighbors()
      .toArray()
      .map(v => v.value.piece)
  }

  public isEmpty(): this is EmptyPiece {
    return this instanceof EmptyPiece
  }
  public isWall(): this is WallPiece {
    return this instanceof WallPiece
  }

  public isPlayer(): this is Player {
    return this instanceof Player
  }
}

export class EmptyPiece extends Piece {
  public token: Token = '.'
}
export class WallPiece extends Piece {
  public token: Token = '#'
}

export abstract class Player extends Piece {
  public readonly attackPower = 3
  public hitPoints = 200

  public toString() {
    return `${this.token}(${this.hitPoints})`
  }

  public isEnemy(player: Player) {
    return player.token !== this.token
  }

  public getAdjacentEnemies(board: Board) {
    return this.getAdjacentPieces(board)
      .filter((piece): piece is Player => piece.isPlayer())
      .filter(this.isEnemy.bind(this))
  }

  public hasAdjacentEnemy(board: Board) {
    return Boolean(this.getAdjacentEnemies(board).length)
  }

  public attack(player: Player, board: Board) {
    player.hitPoints -= this.attackPower
    if (player.hitPoints <= 0) {
      board.deletePlayer(player)
    }
  }
}

export class GoblinPlayer extends Player {
  public token: Token = 'G'
}
export class ElfPlayer extends Player {
  public token: Token = 'E'
}
