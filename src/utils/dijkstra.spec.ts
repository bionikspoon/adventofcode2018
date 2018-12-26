import dijkstra from './dijkstra'
import { Graph, GraphEdge, GraphVertex } from './Graph'

describe('given an undirected graph', () => {
  let graph: Graph<string>
  let vertexA: GraphVertex<string>

  beforeEach(() => {
    vertexA = new GraphVertex('A')
    const vertexB = new GraphVertex('B')
    const vertexC = new GraphVertex('C')
    const vertexD = new GraphVertex('D')
    const vertexE = new GraphVertex('E')
    const vertexF = new GraphVertex('F')
    const vertexG = new GraphVertex('G')

    graph = new Graph<string>()
      .addVertex(new GraphVertex('H'))
      .addEdge(new GraphEdge(vertexA, vertexB, 4))
      .addEdge(new GraphEdge(vertexA, vertexE, 7))
      .addEdge(new GraphEdge(vertexA, vertexC, 3))
      .addEdge(new GraphEdge(vertexB, vertexC, 6))
      .addEdge(new GraphEdge(vertexB, vertexD, 5))
      .addEdge(new GraphEdge(vertexE, vertexC, 8))
      .addEdge(new GraphEdge(vertexE, vertexD, 2))
      .addEdge(new GraphEdge(vertexD, vertexC, 11))
      .addEdge(new GraphEdge(vertexD, vertexG, 10))
      .addEdge(new GraphEdge(vertexD, vertexF, 2))
      .addEdge(new GraphEdge(vertexF, vertexG, 3))
      .addEdge(new GraphEdge(vertexE, vertexG, 5))
  })

  test('it finds distances', () => {
    const { distances } = dijkstra(graph, vertexA)
    expect(distances).toEqual({
      H: Infinity,
      A: 0,
      B: 4,
      E: 7,
      C: 3,
      D: 9,
      G: 12,
      F: 11,
    })
  })

  test('it finds previous vertex: F', () => {
    const { previousVertices } = dijkstra(graph, vertexA)

    expect(previousVertices.F!.getKey()).toBe('D')
  })
  test('it finds previous vertex: D', () => {
    const { previousVertices } = dijkstra(graph, vertexA)

    expect(previousVertices.D!.getKey()).toBe('B')
  })
  test('it finds previous vertex: B', () => {
    const { previousVertices } = dijkstra(graph, vertexA)

    expect(previousVertices.B!.getKey()).toBe('A')
  })
  test('it finds previous vertex: G', () => {
    const { previousVertices } = dijkstra(graph, vertexA)

    expect(previousVertices.G!.getKey()).toBe('E')
  })
  test('it finds previous vertex: C', () => {
    const { previousVertices } = dijkstra(graph, vertexA)

    expect(previousVertices.C!.getKey()).toBe('A')
  })
  test('it finds previous vertex: A', () => {
    const { previousVertices } = dijkstra(graph, vertexA)

    expect(previousVertices.A).toBeNull()
  })
  test('it finds previous vertex: H', () => {
    const { previousVertices } = dijkstra(graph, vertexA)

    expect(previousVertices.H).toBeNull()
  })
})

describe('given a directed graph with negative weights', () => {
  let graph: Graph<string>
  let vertexS: GraphVertex<string>

  beforeEach(() => {
    vertexS = new GraphVertex('S')
    const vertexE = new GraphVertex('E')
    const vertexA = new GraphVertex('A')
    const vertexD = new GraphVertex('D')
    const vertexB = new GraphVertex('B')
    const vertexC = new GraphVertex('C')

    graph = new Graph(true)
    graph
      .addVertex(new GraphVertex('H'))
      .addEdge(new GraphEdge(vertexS, vertexE, 8))
      .addEdge(new GraphEdge(vertexS, vertexA, 10))
      .addEdge(new GraphEdge(vertexE, vertexD, 1))
      .addEdge(new GraphEdge(vertexD, vertexA, -4))
      .addEdge(new GraphEdge(vertexD, vertexC, -1))
      .addEdge(new GraphEdge(vertexA, vertexC, 2))
      .addEdge(new GraphEdge(vertexC, vertexB, -2))
      .addEdge(new GraphEdge(vertexB, vertexA, 1))
  })

  test('it finds distances', () => {
    const { distances } = dijkstra(graph, vertexS)
    expect(distances).toEqual({
      H: Infinity,
      S: 0,
      A: 5,
      B: 5,
      C: 7,
      D: 9,
      E: 8,
    })
  })
  test('it finds previous vertex: H', () => {
    const { previousVertices } = dijkstra(graph, vertexS)
    expect(previousVertices.H).toBeNull()
  })
  test('it finds previous vertex: S', () => {
    const { previousVertices } = dijkstra(graph, vertexS)
    expect(previousVertices.S).toBeNull()
  })
  test('it finds previous vertex: B', () => {
    const { previousVertices } = dijkstra(graph, vertexS)
    expect(previousVertices.B!.getKey()).toBe('C')
  })
  test('it finds previous vertex: C', () => {
    const { previousVertices } = dijkstra(graph, vertexS)
    expect(previousVertices.C!.getKey()).toBe('A')
  })
  test('it finds previous vertex: A', () => {
    const { previousVertices } = dijkstra(graph, vertexS)
    expect(previousVertices.A!.getKey()).toBe('D')
  })
  test('it finds previous vertex: D', () => {
    const { previousVertices } = dijkstra(graph, vertexS)
    expect(previousVertices.D!.getKey()).toBe('E')
  })
})
