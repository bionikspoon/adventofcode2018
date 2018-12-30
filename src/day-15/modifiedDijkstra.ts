import { pick } from 'ramda'
import dijkstra, { IDijkstraOptions } from '../utils/dijkstra'
import { GraphVertex } from '../utils/Graph'
import Board from './Board'
import Cell from './Cell'

export default function modifiedDijkstra(
  board: Board,
  vertex: GraphVertex<Cell>,
  keys: string[]
) {
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
        previousVertices[key] === null ? null : previousVertices[key]!.getKey(),
    }),
    {}
  )

  return {
    previousVertices: previousVerticesByKey,
    distances: pick(keys, distances),
  }
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
    return neighbor.value.piece.isEmpty()
  },
}
