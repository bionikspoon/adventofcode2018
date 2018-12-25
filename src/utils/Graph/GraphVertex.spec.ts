import { GraphEdge, GraphVertex } from '.'

describe('given a vertex', () => {
  let subject: GraphVertex<string>

  beforeEach(() => {
    subject = new GraphVertex('A')
  })

  test('it should be defined', () => {
    expect(subject).toBeDefined()
  })

  test('.value', () => {
    expect(subject).toHaveProperty('value', 'A')
  })

  test('#toString', () => {
    expect(subject.toString()).toEqual('A')
  })

  test('#getKey', () => {
    expect(subject.getKey()).toEqual('A')
  })

  test('#getEdges', () => {
    expect(subject.getEdges()).toEqual([])
  })
})

describe('adding edges', () => {
  let vertexA: GraphVertex<string>
  let vertexB: GraphVertex<string>
  let edgeAB: GraphEdge<string>

  beforeEach(() => {
    vertexA = new GraphVertex('A')
    vertexB = new GraphVertex('B')
    edgeAB = new GraphEdge(vertexA, vertexB)

    vertexA.addEdge(edgeAB)
  })

  describe('#hasEdge', () => {
    test('vertexA.hasEdge(edgeAB)', () => {
      expect(vertexA.hasEdge(edgeAB)).toBeTruthy()
    })
    test('vertexB.hasEdge(edgeAB)', () => {
      expect(vertexB.hasEdge(edgeAB)).toBeFalsy()
    })
  })

  describe('#getEdges', () => {
    test('it has edges', () => {
      expect(vertexA.getEdges()).toHaveLength(1)
    })

    test('it has edges', () => {
      expect(vertexA.getEdges().map(edge => edge.toString())).toEqual(['A_B'])
    })
  })
})

describe('deleting edges', () => {
  let vertexA: GraphVertex<string>
  let vertexB: GraphVertex<string>
  let vertexC: GraphVertex<string>
  let edgeAB: GraphEdge<string>
  let edgeAC: GraphEdge<string>

  beforeAll(() => {
    vertexA = new GraphVertex('A')
    vertexB = new GraphVertex('B')
    vertexC = new GraphVertex('C')
    edgeAB = new GraphEdge(vertexA, vertexB)
    edgeAC = new GraphEdge(vertexA, vertexC)

    vertexA.addEdge(edgeAB).addEdge(edgeAC)
  })
  describe('initial state', () => {
    describe('#hasEdge', () => {
      test('vertexA.hasEdge(edgeAB)', () => {
        expect(vertexA.hasEdge(edgeAB)).toBeTruthy()
      })
      test('vertexB.hasEdge(edgeAB)', () => {
        expect(vertexB.hasEdge(edgeAB)).toBeFalsy()
      })
      test('vertexA.hasEdge(edgeAC)', () => {
        expect(vertexA.hasEdge(edgeAC)).toBeTruthy()
      })
      test('vertexC.hasEdge(edgeAC)', () => {
        expect(vertexC.hasEdge(edgeAC)).toBeFalsy()
      })
    })
  })

  describe('after deleting edgeAB', () => {
    beforeAll(() => {
      vertexA.deleteEdge(edgeAB)
    })

    describe('#hasEdge', () => {
      test('vertexA.hasEdge(edgeAB)', () => {
        expect(vertexA.hasEdge(edgeAB)).toBeFalsy()
      })

      test('vertexA.hasEdge(edgeAC)', () => {
        expect(vertexA.hasEdge(edgeAC)).toBeTruthy()
      })
      test('it has edges', () => {
        expect(vertexA.getEdges().map(edge => edge.toString())).toEqual(['A_C'])
      })
    })
  })

  describe('after deleting edgeAC', () => {
    beforeAll(() => {
      vertexA.deleteEdge(edgeAC)
    })
    describe('#hasEdge', () => {
      test('vertexA.hasEdge(edgeAB)', () => {
        expect(vertexA.hasEdge(edgeAB)).toBeFalsy()
      })
      test('vertexA.hasEdge(edgeAC)', () => {
        expect(vertexA.hasEdge(edgeAC)).toBeFalsy()
      })
      test('it has no edges', () => {
        expect(vertexA.getEdges()).toHaveLength(0)
      })
    })
  })
})

describe('deleting all edges', () => {
  let vertexA: GraphVertex<string>
  let vertexB: GraphVertex<string>
  let vertexC: GraphVertex<string>
  let edgeAB: GraphEdge<string>
  let edgeAC: GraphEdge<string>

  describe('initial state', () => {
    beforeAll(() => {
      vertexA = new GraphVertex('A')
      vertexB = new GraphVertex('B')
      vertexC = new GraphVertex('C')
      edgeAB = new GraphEdge(vertexA, vertexB)
      edgeAC = new GraphEdge(vertexA, vertexC)

      vertexA.addEdge(edgeAB).addEdge(edgeAC)
    })

    test('vertexA.hasEdge(edgeAB)', () => {
      expect(vertexA.hasEdge(edgeAB)).toBeTruthy()
    })
    test('vertexB.hasEdge(edgeAB)', () => {
      expect(vertexB.hasEdge(edgeAB)).toBeFalsy()
    })
    test('vertexA.hasEdge(edgeAC)', () => {
      expect(vertexA.hasEdge(edgeAC)).toBeTruthy()
    })
    test('vertexC.hasEdge(edgeAC)', () => {
      expect(vertexC.hasEdge(edgeAC)).toBeFalsy()
    })

    test('vertexA.getEdges()', () => {
      expect(vertexA.getEdges()).toHaveLength(2)
    })
  })
  describe('after deleting all edges', () => {
    beforeAll(() => {
      vertexA.deleteAllEdges()
    })

    test('vertexA.hasEdge(edgeAB)', () => {
      expect(vertexA.hasEdge(edgeAB)).toBeFalsy()
    })
    test('vertexB.hasEdge(edgeAB)', () => {
      expect(vertexB.hasEdge(edgeAB)).toBeFalsy()
    })
    test('vertexA.hasEdge(edgeAC)', () => {
      expect(vertexA.hasEdge(edgeAC)).toBeFalsy()
    })
    test('vertexC.hasEdge(edgeAC)', () => {
      expect(vertexC.hasEdge(edgeAC)).toBeFalsy()
    })

    test('vertexA.getEdges()', () => {
      expect(vertexA.getEdges()).toHaveLength(0)
    })
  })
})

describe('getting neighbors', () => {
  let vertexA: GraphVertex<string>
  let vertexB: GraphVertex<string>
  let vertexC: GraphVertex<string>
  let edgeAB: GraphEdge<string>
  let edgeAC: GraphEdge<string>

  beforeAll(() => {
    vertexA = new GraphVertex('A')
    vertexB = new GraphVertex('B')
    vertexC = new GraphVertex('C')
    edgeAB = new GraphEdge(vertexA, vertexB)
    edgeAC = new GraphEdge(vertexA, vertexC)

    vertexA.addEdge(edgeAB).addEdge(edgeAC)
  })

  test('vertexB.getNeighbors()', () => {
    expect(vertexB.getNeighbors()).toEqual([])
  })

  describe('given vertexA neighbors', () => {
    let neighbors: Array<GraphVertex<string>>

    beforeAll(() => {
      neighbors = vertexA.getNeighbors()
    })

    test('it has neighbors', () => {
      expect(neighbors).toHaveLength(2)
    })
    test('it has neighbors', () => {
      expect(neighbors).toEqual([vertexB, vertexC])
    })
  })

  describe('#hasNeighbor', () => {
    test('vertexA.hasNeighbor(vertexB)', () => {
      expect(vertexA.hasNeighbor(vertexB)).toBeTruthy()
    })

    test('vertexA.hasNeighbor(vertexC)', () => {
      expect(vertexA.hasNeighbor(vertexC)).toBeTruthy()
    })
  })
})

describe('finding an edge by vertex', () => {
  let vertexA: GraphVertex<string>
  let vertexB: GraphVertex<string>
  let vertexC: GraphVertex<string>
  let edgeAB: GraphEdge<string>

  beforeAll(() => {
    vertexA = new GraphVertex('A')
    vertexB = new GraphVertex('B')
    vertexC = new GraphVertex('C')
    edgeAB = new GraphEdge(vertexA, vertexB)

    vertexA.addEdge(edgeAB)
  })

  test('it can find the edge', () => {
    expect(vertexA.findEdge(vertexB)).toEqual(edgeAB)
  })

  test('it returns null if no edge', () => {
    expect(vertexA.findEdge(vertexC)).toBeNull()
  })
})

describe('calculating degrees', () => {
  let vertexA: GraphVertex<string>
  let vertexB: GraphVertex<string>
  let edgeAB: GraphEdge<string>

  describe('initial state', () => {
    beforeAll(() => {
      vertexA = new GraphVertex('A')
      vertexB = new GraphVertex('B')
    })

    test('#getDegrees', () => {
      expect(vertexA.getDegrees()).toEqual(0)
    })
  })

  describe('after adding one edge', () => {
    beforeAll(() => {
      edgeAB = new GraphEdge(vertexA, vertexB)
      vertexA.addEdge(edgeAB)
    })

    test('#getDegrees', () => {
      expect(vertexA.getDegrees()).toEqual(1)
    })
  })

  describe('after adding a second edge', () => {
    beforeAll(() => {
      const edgeBA = new GraphEdge(vertexB, vertexA)
      vertexA.addEdge(edgeBA)
    })

    test('#getDegrees', () => {
      expect(vertexA.getDegrees()).toEqual(2)
    })
  })

  describe('after adding a duplicate edge', () => {
    beforeAll(() => {
      vertexA.addEdge(edgeAB)
    })

    test('#getDegrees', () => {
      expect(vertexA.getDegrees()).toEqual(3)
    })

    test('#getDegrees', () => {
      expect(vertexA.getEdges()).toHaveLength(3)
    })
  })
})
