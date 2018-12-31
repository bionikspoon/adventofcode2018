import { Graph, GraphVertex } from './Graph'
import PriorityQueue from './PriorityQueue'

export interface IDijkstraOptions<T> {
  queueCompareFn?: (
    this: PriorityQueue<T>,
    l: GraphVertex<T>,
    r: GraphVertex<T>
  ) => 0 | -1 | 1
  canTraverse?: (neighbor: GraphVertex<T>) => boolean
}
export default function dijkstra<T>(
  graph: Graph<T>,
  startVertex: GraphVertex<T>,
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
    const handleNeighbor = handleNeighborFactory<T>(
      visitedVertices,
      options,
      graph,
      currentVertex,
      distances,
      queue,
      previousVertices
    )

    graph.getNeighbors(currentVertex).forEach(handleNeighbor)

    visitedVertices[currentVertex.getKey()] = currentVertex
  }

  return { distances, previousVertices }
}
function handleNeighborFactory<T>(
  visitedVertices: { [key: string]: GraphVertex<T> },
  options: IDijkstraOptions<T>,
  graph: Graph<T>,
  currentVertex: GraphVertex<T>,
  distances: { [key: string]: number },
  queue: PriorityQueue<GraphVertex<T>>,
  previousVertices: { [key: string]: GraphVertex<T> | null }
): (item: GraphVertex<T>) => void {
  return neighbor => {
    if (visitedVertices[neighbor.getKey()]) return
    if (options.canTraverse && !options.canTraverse(neighbor)) return

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
  }
}
