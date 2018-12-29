import { identity, isEmpty, pick, sortBy, uniq, unnest } from 'ramda'
import dijkstra, { IDijkstraOptions } from '../utils/dijkstra'
import parseLines from '../utils/parseLines'
import Board from './Board'
import Cell from './Cell'
import { Token } from './shared'
export function playRoundsRepr(input: string, rounds: number) {
  const tokenGrid = parseLines(input).map(line => line.split('') as Token[])

  const board = Board.from(tokenGrid)

  for (let round = 0; round < rounds; round++) {
    const players = board.getAllPlayers()

    players.forEach(player => {
      if (player.hasAdjacentEnemy(board)) return

      const playerKey = player.getKey()

      const { distances, previousVertices } = dijkstra(
        board,
        board.getVertexByKey(playerKey),
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
      const enemies = players.filter(player.isEnemy.bind(player))

      const enemyNeighbors = flatSort(
        enemies.map(enemy =>
          enemy
            .getAdjacentPieces(board)
            .filter(p => p.isEmpty())
            .map(p => p.getKey())
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

const flatSort = (items: string[][]) =>
  sortBy<string>(identity, uniq(unnest(items)))

export const dijkstraOptions: IDijkstraOptions<Cell> = {
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
    return neighbor.value.piece.isEmpty()
  },
}
