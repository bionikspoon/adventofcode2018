import { groupBy, sortBy, uniq } from 'ramda'
import { Graph, GraphEdge, GraphVertex } from '../utils/Graph'
import Cell from './Cell'
import { EmptyPiece, Player } from './Piece'
import { Direction, Token } from './shared'

export default class Board extends Graph<Cell> {
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
      .map(row => {
        const players: string[] = []
        const symbols = sortBy(cell => cell.x, row)
          .map(cell => {
            if (cell.piece.isPlayer()) {
              players.push(cell.piece.toString())
            }
            return cell.piece.token
          })
          .join('')
        return players.length ? `${symbols}   ${players.join(', ')}` : symbols
      })
      .join('\n')
  }

  public playRound() {
    const players = this.getAllPlayers()

    players.forEach(player => {
      if (!player.isAlive()) return
      if (player.hasAdjacentEnemy(this)) {
        return player.initiateAttack(this)
      }

      const nextMove = player.findNextMove(this)
      if (nextMove) this.move(player, nextMove)

      player.initiateAttack(this)
    })
    this.assertMultipleTeams()

    return this
  }

  public move(player: Player, targetKey: string) {
    const targetCell = this.getVertexByKey(targetKey).value
    if (!targetCell.piece.isEmpty()) {
      throw new Error('Cannot move player to a non empty Cell')
    }

    player.cell.piece = new EmptyPiece(player.cell)
    ;[targetCell.piece, player.cell] = [player, targetCell]
  }

  public getAllPlayers() {
    return this.getAllVertices()
      .map(vertex => vertex.value.piece)
      .filter((piece): piece is Player => piece.isPlayer())
  }

  public deletePlayer(player: Player) {
    player.cell.piece = new EmptyPiece(player.cell)
  }

  private createEdge(
    startVertex: GraphVertex<Cell>,
    endVertex: GraphVertex<Cell>
  ) {
    if (startVertex.value.piece.isWall() || endVertex.value.piece.isWall()) {
      return this
    }

    this.addEdge(new GraphEdge(startVertex, endVertex, 1))

    return this
  }
  private assertMultipleTeams() {
    const players = this.getAllPlayers()
    if (uniq(players.map(p => p.token)).length <= 1) {
      throw new Error('Only one team left.')
    }
  }
}
