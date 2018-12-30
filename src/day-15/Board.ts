import { groupBy, sortBy, uniq } from 'ramda'
import { Graph, GraphEdge, GraphVertex } from '../utils/Graph'
import Cell from './Cell'
import GameOverError from './GameOverError'
import { EmptyPiece, Player } from './Piece'
import { Direction, Token } from './shared'

export default class Board extends Graph<Cell> {
  public static from(tokenGrid: Token[][]) {
    const board = new Board()

    tokenGrid.forEach((tokenRow, y) =>
      tokenRow.forEach((token, x) => {
        const cell = new Cell(x, y, token)
        board.addVertex(new GraphVertex(cell))
        if (cell.piece.isPlayer()) board.addPlayer(cell.piece)
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
  private players: Player[] = []

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
    const players = sortBy(p => p.getKey(), this.getAllPlayers())

    players.forEach((player, index) => {
      if (!player.isAlive()) return
      if (!player.hasAdjacentEnemy(this)) {
        const nextMove = player.findNextMove(this)
        if (nextMove) this.move(player, nextMove)
      }

      player.initiateAttack(this)

      if (index < players.length - 1) {
        this.assertMultipleTeams()
      }
    })

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
    return this.players
  }

  public deletePlayer(player: Player) {
    player.cell.piece = new EmptyPiece(player.cell)
    const playerKey = player.getKey()
    this.players = this.players.filter(p => p.getKey() !== playerKey)
  }

  private addPlayer(player: Player) {
    this.players.push(player)
    return this
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
      throw new GameOverError('Only one team left.')
    }
  }
}
