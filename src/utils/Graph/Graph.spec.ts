import { Graph, GraphEdge, GraphVertex } from '.'

describe('adding vertices', () => {
  let graph: Graph<string>
  let vertexA: GraphVertex<string>
  let vertexB: GraphVertex<string>

  beforeEach(() => {
    graph = new Graph()
    vertexA = new GraphVertex('A')
    vertexB = new GraphVertex('B')

    graph.addVertex(vertexA).addVertex(vertexB)
  })

  test('it has both vertices', () => {
    expect(graph.toString()).toEqual('A,B')
  })

  test('it can get vertex by key', () => {
    expect(graph.getVertexByKey(vertexA.getKey())).toEqual(vertexA)
  })

  test('it can get vertex by key', () => {
    expect(graph.getVertexByKey(vertexB.getKey())).toEqual(vertexB)
  })
})

describe('given an undirected graph', () => {
  let graph: Graph<string>
  let vertexA: GraphVertex<string>
  let vertexB: GraphVertex<string>
  let edgeAB: GraphEdge<string>

  beforeEach(() => {
    graph = new Graph()
    vertexA = new GraphVertex('A')
    vertexB = new GraphVertex('B')
    edgeAB = new GraphEdge(vertexA, vertexB)

    graph.addEdge(edgeAB)
  })

  describe('#getAllVertices', () => {
    test('it has both vertices', () => {
      expect(graph.getAllVertices()).toHaveLength(2)
    })

    test('it has both vertices', () => {
      expect(graph.getAllVertices()).toEqual([vertexA, vertexB])
    })
  })

  describe('#toString', () => {
    test('it has both vertices', () => {
      expect(graph.toString()).toEqual('A,B')
    })
  })

  describe('#getVertexByKey', () => {
    let graphVertexA: GraphVertex<string>
    let graphVertexB: GraphVertex<string>

    beforeEach(() => {
      graphVertexA = graph.getVertexByKey(vertexA.getKey())
      graphVertexB = graph.getVertexByKey(vertexB.getKey())
    })

    test('it is sane', () => {
      expect(graphVertexA).toBeDefined()
    })

    test('it is sane', () => {
      expect(graphVertexB).toBeDefined()
    })

    test('it is undefined with made up keys', () => {
      expect(graph.getVertexByKey('not existing')).toBeUndefined()
    })
  })

  describe('GraphVertex#getNeighbors', () => {
    test('it has neighbors set', () => {
      expect(vertexA.getNeighbors()).toEqual([vertexB])
    })

    test('it has neighbors set', () => {
      expect(vertexB.getNeighbors()).toEqual([vertexA])
    })
  })
})

describe('given a directed graph', () => {
  let graph: Graph<string>
  let vertexA: GraphVertex<string>
  let vertexB: GraphVertex<string>
  let edgeAB: GraphEdge<string>
  let graphVertexA: GraphVertex<string>
  let graphVertexB: GraphVertex<string>

  beforeEach(() => {
    graph = new Graph(true)
    vertexA = new GraphVertex('A')
    vertexB = new GraphVertex('B')
    edgeAB = new GraphEdge(vertexA, vertexB)

    graph.addEdge(edgeAB)

    graphVertexA = graph.getVertexByKey(vertexA.getKey())
    graphVertexB = graph.getVertexByKey(vertexB.getKey())
  })

  test('have both vertices', () => {
    expect(graph.toString()).toEqual('A,B')
  })

  describe('given graphVertexA', () => {
    test('it still has a neighbor', () => {
      expect(graphVertexA.getNeighbors()).toEqual([vertexB])
    })
    test('it still has a neighbor', () => {
      expect(graphVertexA.getNeighbors()).toEqual([graphVertexB])
    })
  })

  describe('given graphVertexB', () => {
    test('it does not have a neighbor', () => {
      expect(graphVertexB.getNeighbors()).toHaveLength(0)
    })
  })

  test('it throws an error when adding the same edge twice', () => {
    expect(() => graph.addEdge(edgeAB)).toThrowError('Edge already added.')
  })
})

describe('given an undirected graph', () => {
  let graph: Graph<string>
  let vertexA: GraphVertex<string>
  let vertexB: GraphVertex<string>
  let vertexC: GraphVertex<string>
  let edgeAB: GraphEdge<string>

  beforeEach(() => {
    graph = new Graph()
    vertexA = new GraphVertex('A')
    vertexB = new GraphVertex('B')
    vertexC = new GraphVertex('C')
    edgeAB = new GraphEdge(vertexA, vertexB, 10)

    graph.addEdge(edgeAB)
  })

  test('it does not find edge AC', () => {
    expect(graph.findEdge(vertexA, vertexC)).toBeNull()
  })
  test('it does not find edge CA', () => {
    expect(graph.findEdge(vertexA, vertexC)).toBeNull()
  })

  test('it finds edge AB', () => {
    expect(graph.findEdge(vertexA, vertexB)).toEqual(edgeAB)
  })

  test('it finds edge BA', () => {
    expect(graph.findEdge(vertexB, vertexA)).toEqual(edgeAB)
  })

  test('it finds edge AB weight', () => {
    expect(graph.findEdge(vertexA, vertexB)).toHaveProperty('weight', 10)
  })
})

describe('given a directed graph', () => {
  let graph: Graph<string>
  let vertexA: GraphVertex<string>
  let vertexB: GraphVertex<string>
  let vertexC: GraphVertex<string>
  let edgeAB: GraphEdge<string>

  beforeEach(() => {
    graph = new Graph(true)
    vertexA = new GraphVertex('A')
    vertexB = new GraphVertex('B')
    vertexC = new GraphVertex('C')
    edgeAB = new GraphEdge(vertexA, vertexB, 10)

    graph.addEdge(edgeAB)
  })

  test('it does not find edge AC', () => {
    expect(graph.findEdge(vertexA, vertexC)).toBeNull()
  })
  test('it does not find edge CA', () => {
    expect(graph.findEdge(vertexA, vertexC)).toBeNull()
  })

  test('it finds edge AB', () => {
    expect(graph.findEdge(vertexA, vertexB)).toEqual(edgeAB)
  })

  test('it does not find edge BA', () => {
    expect(graph.findEdge(vertexB, vertexA)).toBeNull()
  })

  test('it finds edge AB weight', () => {
    expect(graph.findEdge(vertexA, vertexB)).toHaveProperty('weight', 10)
  })
})

describe('given an undirected graph', () => {
  let graph: Graph<string>
  let vertexA: GraphVertex<string>
  let vertexB: GraphVertex<string>
  let vertexC: GraphVertex<string>

  beforeEach(() => {
    graph = new Graph()
    vertexA = new GraphVertex('A')
    vertexB = new GraphVertex('B')
    vertexC = new GraphVertex('C')

    graph
      .addEdge(new GraphEdge(vertexA, vertexB))
      .addEdge(new GraphEdge(vertexA, vertexC))
  })

  test('it can find vertex neighbors', () => {
    expect(graph.getNeighbors(vertexA)).toEqual([vertexB, vertexC])
  })
})

describe('finding the graph edges', () => {
  test('it can get all the graph edges', () => {
    const graph = new Graph(true)

    const vertexA = new GraphVertex('A')
    const vertexB = new GraphVertex('B')
    const vertexC = new GraphVertex('C')

    const edgeAB = new GraphEdge(vertexA, vertexB)
    const edgeBC = new GraphEdge(vertexB, vertexC)

    graph.addEdge(edgeAB).addEdge(edgeBC)

    expect(graph.getAllEdges()).toEqual([edgeAB, edgeBC])
  })
})

describe('finding graph weight', () => {
  test('it can find the graph total weight', () => {
    const graph = new Graph()

    const vertexA = new GraphVertex('A')
    const vertexB = new GraphVertex('B')
    const vertexC = new GraphVertex('C')
    const vertexD = new GraphVertex('D')

    graph
      .addEdge(new GraphEdge(vertexA, vertexB))
      .addEdge(new GraphEdge(vertexB, vertexC))
      .addEdge(new GraphEdge(vertexC, vertexD))
      .addEdge(new GraphEdge(vertexA, vertexD))

    expect(graph.getWeight()).toEqual(0)
  })
  test('it can find the graph total weight with a weighted graph', () => {
    const graph = new Graph()

    const vertexA = new GraphVertex('A')
    const vertexB = new GraphVertex('B')
    const vertexC = new GraphVertex('C')
    const vertexD = new GraphVertex('D')

    graph
      .addEdge(new GraphEdge(vertexA, vertexB, 1))
      .addEdge(new GraphEdge(vertexB, vertexC, 2))
      .addEdge(new GraphEdge(vertexC, vertexD, 3))
      .addEdge(new GraphEdge(vertexA, vertexD, 4))

    expect(graph.getWeight()).toEqual(10)
  })
})

describe('deleting edges', () => {
  test('it can delete edges', () => {
    const graph = new Graph()

    const vertexA = new GraphVertex('A')
    const vertexB = new GraphVertex('B')
    const vertexC = new GraphVertex('C')

    const edgeAB = new GraphEdge(vertexA, vertexB)
    const edgeBC = new GraphEdge(vertexB, vertexC)
    const edgeAC = new GraphEdge(vertexA, vertexC)

    graph
      .addEdge(edgeAB)
      .addEdge(edgeBC)
      .addEdge(edgeAC)

    graph.deleteEdge(edgeAB)

    expect(graph.getAllEdges()).toEqual([edgeBC, edgeAC])
  })

  test('it throws when deleting a non existant node', () => {
    const graph = new Graph()

    const edgeAB = new GraphEdge(new GraphVertex('A'), new GraphVertex('B'))

    expect(() => graph.deleteEdge(edgeAB)).toThrowError('Edge does not exist')
  })
})

describe('vertices with indexes', () => {
  test('it should return vertices with indexes', () => {
    const graph = new Graph()
    const vertexA = new GraphVertex('A')
    const vertexB = new GraphVertex('B')
    const vertexC = new GraphVertex('C')
    const vertexD = new GraphVertex('D')

    graph
      .addEdge(new GraphEdge(vertexA, vertexB))
      .addEdge(new GraphEdge(vertexB, vertexC))
      .addEdge(new GraphEdge(vertexC, vertexD))
      .addEdge(new GraphEdge(vertexB, vertexD))

    expect(graph.getVerticesIndices()).toEqual({
      A: 0,
      B: 1,
      C: 2,
      D: 3,
    })
  })
})

describe('generating an adjacency matrix', () => {
  test('it generates an adjacency matrix for an undirected graph', () => {
    const graph = new Graph()
    const vertexA = new GraphVertex('A')
    const vertexB = new GraphVertex('B')
    const vertexC = new GraphVertex('C')
    const vertexD = new GraphVertex('D')

    graph
      .addEdge(new GraphEdge(vertexA, vertexB, 1))
      .addEdge(new GraphEdge(vertexB, vertexC, 3))
      .addEdge(new GraphEdge(vertexC, vertexD, 5))
      .addEdge(new GraphEdge(vertexB, vertexD, 7))

    const I = Infinity

    expect(graph.getAdjacencyMatrix()).toEqual([
      [I, 1, I, I],
      [1, I, 3, 7],
      [I, 3, I, 5],
      [I, 7, 5, I],
    ])
  })
  test('it generates an adjacency matrix for a directed graph', () => {
    const graph = new Graph(true)
    const vertexA = new GraphVertex('A')
    const vertexB = new GraphVertex('B')
    const vertexC = new GraphVertex('C')
    const vertexD = new GraphVertex('D')

    graph
      .addEdge(new GraphEdge(vertexA, vertexB, 1))
      .addEdge(new GraphEdge(vertexB, vertexC, 3))
      .addEdge(new GraphEdge(vertexC, vertexD, 5))
      .addEdge(new GraphEdge(vertexB, vertexD, 7))
      .addEdge(new GraphEdge(vertexD, vertexA, 2))
      .addEdge(new GraphEdge(vertexD, vertexB, 4))
      .addEdge(new GraphEdge(vertexD, vertexC, 6))

    const I = Infinity

    expect(graph.getAdjacencyMatrix()).toEqual([
      [I, 1, I, I],
      [I, I, 3, 7],
      [I, I, I, 5],
      [2, 4, 6, I],
    ])
  })
})
