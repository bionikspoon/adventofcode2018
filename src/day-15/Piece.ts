import {
  ascend,
  head,
  identity,
  isEmpty,
  sortBy,
  sortWith,
  uniq,
  unnest,
} from 'ramda'
import Board from './Board'
import Cell from './Cell'
import modifiedDijkstra from './modifiedDijkstra'
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

  public isEmpty(): this is EmptyPiece {
    return this instanceof EmptyPiece
  }
  public isWall(): this is WallPiece {
    return this instanceof WallPiece
  }

  public isPlayer(): this is Player {
    return this instanceof Player
  }

  protected getAdjacentPieces(board: Board) {
    return board
      .getVertexByKey(this.getKey())
      .getNeighbors()
      .toArray()
      .map(v => v.value.piece)
  }
}

export class EmptyPiece extends Piece {
  public token: Token = '.'
}
export class WallPiece extends Piece {
  public token: Token = '#'
}

export abstract class Player extends Piece {
  public hitPoints = 200
  private readonly attackPower = 3

  public toString() {
    return `${this.token}(${this.hitPoints})`
  }
  public hasAdjacentEnemy(board: Board) {
    return Boolean(this.getAdjacentEnemies(board).length)
  }
  public findNextMove(board: Board) {
    const playerKey = this.getKey()

    const { distances, previousVertices } = modifiedDijkstra(
      board,
      board.getVertexByKey(playerKey),
      this.getEnemyAdjacentKeys(board)
    )

    if (isEmpty(distances)) return

    return findNextMoveToTarget(
      findClosestKey(distances),
      playerKey,
      previousVertices
    )
  }

  public initiateAttack(board: Board) {
    const adjacentEnemies = this.getAdjacentEnemies(board)
    const target = head(
      sortWith(
        [
          ascend<Player>(p => p.hitPoints),
          ascend<Player>(p => p.cell.y),
          ascend<Player>(p => p.cell.x),
        ],
        adjacentEnemies
      )
    )
    if (target) this.attack(target, board)
  }

  public isAlive() {
    return this.hitPoints > 0
  }

  private isEnemy(player: Player) {
    return player.token !== this.token
  }
  private getAdjacentEnemies(board: Board) {
    return this.getAdjacentPieces(board)
      .filter((piece): piece is Player => piece.isPlayer())
      .filter(this.isEnemy.bind(this))
  }

  private getEnemyAdjacentKeys(board: Board) {
    return flatSort(
      board
        .getAllPlayers()
        .filter(this.isEnemy.bind(this))
        .map(enemy =>
          enemy
            .getAdjacentPieces(board)
            .filter(p => p.isEmpty())
            .map(p => p.getKey())
        )
    )
  }

  private attack(player: Player, board: Board) {
    player.hitPoints -= this.attackPower
    if (!player.isAlive()) {
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

const flatSort = (items: string[][]) =>
  sortBy<string>(identity, uniq(unnest(items)))

function findClosestKey(distances: { [key: string]: number }) {
  return Object.entries(distances).reduce((curr, next) =>
    next[1] < curr[1] ? next : curr
  )[0]
}

function findNextMoveToTarget(
  target: string,
  playerKey: string,
  previousVertices: { [key: string]: string | null }
) {
  if (previousVertices[target] === null) return

  let nextMove: string = target

  while (
    previousVertices[nextMove] !== playerKey &&
    previousVertices[nextMove] !== null
  ) {
    nextMove = previousVertices[nextMove]!
  }

  return nextMove
}
