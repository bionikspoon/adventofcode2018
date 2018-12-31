import { map, pick } from 'ramda'
import { IDijkstraOptions } from '../utils/dijkstra'
import { Graph, GraphVertex } from '../utils/Graph'
import PriorityQueue from '../utils/PriorityQueue'
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
    keys,
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

const compareKeys = (l: string, r: string) => {
  if (l === r) {
    return 0
  } else {
    return l < r ? -1 : 1
  }
}

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
}

function dijkstra<T>(
  graph: Graph<T>,
  startVertex: GraphVertex<T>,
  targetKeys: string[],
  options: IDijkstraOptions<T> = {}
) {
  const distances: { [key: string]: number } = {}
  const visitedVertices: { [key: string]: GraphVertex<T> } = {}
  const previousVertices: { [key: string]: GraphVertex<T> | null } = {}
  const queue = new PriorityQueue<GraphVertex<T>>(options.queueCompareFn)

  graph.getAllVertices().forEach(vertex => {
    distances[vertex.getKey()] = Infinity
    previousVertices[vertex.getKey()] = null
  })
  distances[startVertex.getKey()] = 0

  queue.add(startVertex, distances[startVertex.getKey()])

  while (!queue.isEmpty()) {
    const currentVertex = queue.poll()!
    const currentVertexKey = currentVertex.getKey()

    graph.getNeighbors(currentVertex).forEach(neighbor => {
      if (visitedVertices[neighbor.getKey()]) return
      if (options.canTraverse && !options.canTraverse(neighbor)) return

      const edge = graph.findEdge(currentVertex, neighbor)!
      const existingDistanceToNeighbor = distances[neighbor.getKey()]
      const distanceToNeighborFromCurrent =
        distances[currentVertexKey] + edge.weight

      if (distanceToNeighborFromCurrent < existingDistanceToNeighbor) {
        distances[neighbor.getKey()] = distanceToNeighborFromCurrent

        if (queue.hasValue(neighbor)) {
          queue.changePriority(neighbor, distances[neighbor.getKey()])
        }

        previousVertices[neighbor.getKey()] = currentVertex
      }

      if (!queue.hasValue(neighbor)) {
        queue.add(neighbor, distances[neighbor.getKey()])
      }
    })

    visitedVertices[currentVertexKey] = currentVertex

    if (targetKeys.includes(currentVertexKey)) break
  }

  return { distances, previousVertices }
}
