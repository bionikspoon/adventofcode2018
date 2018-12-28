import { groupBy, identity, isEmpty, pick, sortBy, uniq, unnest } from 'ramda'
import dijkstra, { IDijkstraOptions } from '../utils/dijkstra'
import { Graph, GraphEdge, GraphVertex } from '../utils/Graph'
import parseLines from '../utils/parseLines'

type Token = '#' | '.' | 'G' | 'E'

enum Direction {
  N,
  S,
  E,
  W,
}

const dijkstraOptions: IDijkstraOptions<Cell> = {
  queueCompareFn(this, l, r) {
    const lKey = l.toString()
    const rKey = r.toString()
    const lPriority = this.priorities[lKey]
    const rPriority = this.priorities[rKey]

    if (lPriority === rPriority) {
      if (lKey === rKey) {
        return 0
      } else {
        return lKey < rKey ? -1 : 1
      }
    }

    return lPriority < rPriority ? -1 : 1
  },
  canTraverse(neighbor) {
    return neighbor.value.piece instanceof EmptyPiece
  },
}

export function playRoundsRepr(input: string, rounds: number) {
  const tokenGrid = parseLines(input).map(line => line.split('') as Token[])

  const board = Board.from(tokenGrid)

  for (let round = 0; round < rounds; round++) {
    const players = board.getAllPlayers()

    players.forEach(player => {
      const playerKey = player.getKey()
      const vertex = board.getVertexByKey(playerKey)
      const enemies = players.filter(p => p.token !== player.token)

      const neighborEnemies = vertex
        .getNeighbors()
        .toArray()
        .map(v => v.value.piece)
        .filter((piece): piece is Player => piece instanceof Player)
        .filter(p => enemies.includes(p))

      if (neighborEnemies.length) return

      const { distances, previousVertices } = dijkstra(
        board,
        vertex,
        dijkstraOptions
      )
      const previousVerticesByKey: {
        [key: string]: string | null
      } = Object.keys(previousVertices).reduce(
        (obj, key) => ({
          ...obj,
          [key]:
            previousVertices[key] === null
              ? null
              : previousVertices[key]!.getKey(),
        }),
        {}
      )

      const enemyNeighbors = sortBy<string>(
        identity,
        uniq(
          unnest(
            enemies.map(e =>
              board
                .getVertexByKey(e.getKey())
                .getNeighbors()
                .toArray()
                .map(v => v.value.piece)
                .filter(p => p.token === '.')
                .map(p => p.getKey())
            )
          )
        )
      )

      const enemyDistances = pick(enemyNeighbors, distances)
      if (isEmpty(enemyDistances)) return
      const target = Object.entries(enemyDistances).reduce((curr, next) =>
        next[1] < curr[1] ? next : curr
      )[0]

      let nextMove: string = target
      while (true) {
        if (previousVerticesByKey[nextMove] === playerKey) break
        if (previousVerticesByKey[nextMove] === null) {
          throw new Error('Something went wrong.')
        }
        nextMove = previousVerticesByKey[nextMove]!
      }

      board.move(player, nextMove)
    })
  }

  return board.print()
}

class Board extends Graph<Cell> {
  public static from(tokenGrid: Token[][]) {
    const board = new Board()

    tokenGrid.forEach((tokenRow, y) =>
      tokenRow.forEach((token, x) => {
        board.addVertex(new GraphVertex(new Cell(x, y, token)))
      })
    )

    board.getAllVertices().forEach(vertex => {
      const { x, y } = vertex.value

      board.createEdge(
        vertex,
        board.getVertexByKey(Cell.getKeyByDirection(x, y, Direction.N))
      )
      board.createEdge(
        vertex,
        board.getVertexByKey(Cell.getKeyByDirection(x, y, Direction.W))
      )
      board.createEdge(
        vertex,
        board.getVertexByKey(Cell.getKeyByDirection(x, y, Direction.E))
      )
      board.createEdge(
        vertex,
        board.getVertexByKey(Cell.getKeyByDirection(x, y, Direction.S))
      )
    })

    return board
  }

  public print() {
    return Object.values(
      groupBy(
        cell => cell.y.toString(),
        this.getAllVertices().map(vertex => vertex.value)
      )
    )
      .map(row =>
        sortBy(cell => cell.x, row)
          .map(cell => cell.piece.token)
          .join('')
      )
      .join('\n')
  }

  public move(player: Player, targetKey: string) {
    const targetCell = this.getVertexByKey(targetKey).value
    if (!(targetCell.piece instanceof EmptyPiece)) {
      throw new Error('Cannot move player to a non  empty Cell')
    }

    player.cell.piece = new EmptyPiece(player.cell)
    ;[targetCell.piece, player.cell] = [player, targetCell]
  }

  public getAllPlayers() {
    return this.getAllVertices()
      .map(vertex => vertex.value.piece)
      .filter(piece => piece instanceof Player) as Player[]
  }
  private createEdge(
    startVertex: GraphVertex<Cell>,
    endVertex: GraphVertex<Cell>
  ) {
    if (
      startVertex.value.piece.token === '#' ||
      endVertex.value.piece.token === '#'
    ) {
      return this
    }

    this.addEdge(new GraphEdge(startVertex, endVertex, 1))

    return this
  }
}

class Cell {
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
  public x: number
  public y: number
  constructor(x: number, y: number, token: Token) {
    this.x = x
    this.y = y

    this.piece = Piece.from(token, this)
  }

  public getKey() {
    return Cell.getKey(this.x, this.y)
  }

  public toString() {
    return this.getKey()
  }
}

abstract class Piece {
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
}

class EmptyPiece extends Piece {
  public token: Token = '.'
}
class WallPiece extends Piece {
  public token: Token = '#'
}

abstract class Player extends Piece {
  public readonly attackPower = 3
  public readonly hitPoints = 200
}

class GoblinPlayer extends Player {
  public token: Token = 'G'
}
class ElfPlayer extends Player {
  public token: Token = 'E'
}
