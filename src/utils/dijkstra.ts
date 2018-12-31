import { Graph, GraphVertex } from './Graph'
import PriorityQueue from './PriorityQueue'

interface IDistances {
  [key: string]: number
}
export interface IDijkstraOptions<T> {
  queueCompareFn?: (
    this: PriorityQueue<T>,
    l: GraphVertex<T>,
    r: GraphVertex<T>
  ) => 0 | -1 | 1
  canTraverse?: (neighbor: GraphVertex<T>) => boolean
  shouldPoll?: (vertex: GraphVertex<T>) => boolean
}
export default function dijkstra<T>(
  graph: Graph<T>,
  startVertex: GraphVertex<T>,
  options: IDijkstraOptions<T> = {}
) {
  const visitedVertices: { [key: string]: GraphVertex<T> } = {}
  const queue = new PriorityQueue<GraphVertex<T>>(options.queueCompareFn)
  const { distances, previousVertices } = initDistances(graph)

  distances[startVertex.getKey()] = 0
  queue.add(startVertex, distances[startVertex.getKey()])

  while (!queue.isEmpty()) {
    const currentVertex = queue.poll()!

    graph.getNeighbors(currentVertex).forEach(neighbor => {
      if (visitedVertices[neighbor.getKey()]) return
      if (options.canTraverse && !options.canTraverse(neighbor)) return

      const distanceToNeighborFromCurrent =
        distances[currentVertex.getKey()] +
        graph.findEdge(currentVertex, neighbor)!.weight

      if (distanceToNeighborFromCurrent < distances[neighbor.getKey()]) {
        distances[neighbor.getKey()] = distanceToNeighborFromCurrent
        updateNeighborPriority(queue, neighbor, distances)
        previousVertices[neighbor.getKey()] = currentVertex
      }

      ensureQueueHasNeighbor(queue, neighbor, distances)
    })

    visitedVertices[currentVertex.getKey()] = currentVertex
    if (options.shouldPoll && !options.shouldPoll(currentVertex)) break
  }

  return { distances, previousVertices }
}
function initDistances<T>(graph: Graph<T>) {
  const distances: IDistances = {}
  const previousVertices: { [key: string]: GraphVertex<T> | null } = {}

  graph.getAllVertices().forEach(vertex => {
    distances[vertex.getKey()] = Infinity
    previousVertices[vertex.getKey()] = null
  })

  return { distances, previousVertices }
}

function updateNeighborPriority<T>(
  queue: PriorityQueue<GraphVertex<T>>,
  neighbor: GraphVertex<T>,
  distances: IDistances
): void {
  if (queue.hasValue(neighbor)) {
    queue.changePriority(neighbor, distances[neighbor.getKey()])
  }
}

function ensureQueueHasNeighbor<T>(
  queue: PriorityQueue<GraphVertex<T>>,
  neighbor: GraphVertex<T>,
  distances: IDistances
): void {
  if (!queue.hasValue(neighbor)) {
    queue.add(neighbor, distances[neighbor.getKey()])
  }
}
