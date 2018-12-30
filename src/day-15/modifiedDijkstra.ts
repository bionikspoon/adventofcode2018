import { pick } from 'ramda'
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
      const neighborKey = neighbor.getKey()
      if (visitedVertices[neighborKey]) return
      if (options.canTraverse && !options.canTraverse(neighbor)) return
      const edge = graph.findEdge(currentVertex, neighbor)!

      const existingDistanceToNeighbor = distances[neighborKey]
      const distanceToNeighborFromCurrent =
        distances[currentVertexKey] + edge.weight

      if (distanceToNeighborFromCurrent < existingDistanceToNeighbor) {
        distances[neighborKey] = distanceToNeighborFromCurrent

        if (queue.hasValue(neighbor)) {
          queue.changePriority(neighbor, distances[neighborKey])
        }

        previousVertices[neighborKey] = currentVertex
      }

      if (!queue.hasValue(neighbor)) {
        queue.add(neighbor, distances[neighborKey])
      }
    })

    visitedVertices[currentVertexKey] = currentVertex
    if (targetKeys.includes(currentVertexKey)) break
  }

  return {
    distances,
    previousVertices,
  }
}
