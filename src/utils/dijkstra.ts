import { Graph, GraphVertex } from './Graph'
import PriorityQueue from './PriorityQueue'

export default function dijkstra<T>(
  graph: Graph<T>,
  startVertex: GraphVertex<T>
) {
  const distances: { [key: string]: number } = {}
  const visitedVertices: { [key: string]: GraphVertex<T> } = {}
  const previousVertices: { [key: string]: GraphVertex<T> | null } = {}
  const queue = new PriorityQueue<GraphVertex<T>>()

  graph.getAllVertices().forEach(vertex => {
    distances[vertex.getKey()] = Infinity
    previousVertices[vertex.getKey()] = null
  })
  distances[startVertex.getKey()] = 0

  queue.add(startVertex, distances[startVertex.getKey()])

  while (!queue.isEmpty()) {
    const currentVertex = queue.poll()!

    graph.getNeighbors(currentVertex).forEach(neighbor => {
      if (visitedVertices[neighbor.getKey()]) return
      const edge = graph.findEdge(currentVertex, neighbor)!

      const existingDistanceToNeighbor = distances[neighbor.getKey()]
      const distanceToNeighborFromCurrent =
        distances[currentVertex.getKey()] + edge.weight

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

    visitedVertices[currentVertex.getKey()] = currentVertex
  }

  return {
    distances,
    previousVertices,
  }
}
