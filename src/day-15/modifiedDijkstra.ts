import { map, pick } from 'ramda'
import dijkstra, { IDijkstraOptions } from '../utils/dijkstra'
import { GraphVertex } from '../utils/Graph'
import Board from './Board'
import Cell from './Cell'

export default function modifiedDijkstra(
  board: Board,
  vertex: GraphVertex<Cell>,
  keys: string[]
) {
  const dijkstraOptions: IDijkstraOptions<Cell> = {
    queueCompareFn(this, l, r) {
      const lPriority = this.priorities[l.getKey()]
      const rPriority = this.priorities[r.getKey()]

      if (lPriority === rPriority) return compareKeys(l.getKey(), r.getKey())

      return lPriority < rPriority ? -1 : 1
    },
    canTraverse(neighbor) {
      return neighbor.value.piece.isEmpty()
    },
    shouldPoll(v) {
      return !keys.includes(v.getKey())
    },
  }

  const { distances, previousVertices } = dijkstra(
    board,
    vertex,
    dijkstraOptions
  )
  const previousVerticesByKey: {
    [key: string]: string | null
  } = map(value => (value === null ? null : value.getKey()), previousVertices)

  return {
    previousVertices: previousVerticesByKey,
    distances: pick(keys, distances),
  }
}

function compareKeys(l: string, r: string) {
  if (l === r) {
    return 0
  } else {
    return l < r ? -1 : 1
  }
}
