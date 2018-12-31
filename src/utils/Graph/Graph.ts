import GraphEdge from './GraphEdge'
import GraphVertex from './GraphVertex'

export default class Graph<T> {
  private vertices: { [key: string]: GraphVertex<T> } = {}
  private edges: { [key: string]: GraphEdge<T> } = {}
  private readonly isDirected: boolean
  public constructor(isDirected = false) {
    this.isDirected = isDirected
  }
  public addVertex(vertex: GraphVertex<T>) {
    this.vertices[vertex.getKey()] = vertex
    return this
  }

  public addEdge(edge: GraphEdge<T>) {
    let startVertex = this.getVertexByKey(edge.startVertex.getKey())
    let endVertex = this.getVertexByKey(edge.endVertex.getKey())

    if (!startVertex) {
      this.addVertex(edge.startVertex)
      startVertex = this.getVertexByKey(edge.startVertex.getKey())
    }

    if (!endVertex) {
      this.addVertex(edge.endVertex)
      endVertex = this.getVertexByKey(edge.endVertex.getKey())
    }

    if (this.edges[edge.getKey()]) throw new Error('Edge already added.')
    this.edges[edge.getKey()] = edge

    startVertex.addEdge(edge)
    if (!this.isDirected) endVertex.addEdge(edge)

    return this
  }

  public findEdge(startVertex: GraphVertex<T>, endVertex: GraphVertex<T>) {
    const vertex = this.getVertexByKey(startVertex.getKey())

    if (!vertex) return null

    return vertex.findEdge(endVertex)
  }

  public getAllEdges() {
    return Object.values(this.edges)
  }

  public deleteEdge(edge: GraphEdge<T>) {
    if (!this.edges[edge.getKey()]) throw new Error('Edge does not exist')

    delete this.edges[edge.getKey()]
    this.getVertexByKey(edge.startVertex.getKey()).deleteEdge(edge)
    this.getVertexByKey(edge.endVertex.getKey()).deleteEdge(edge)
    return this
  }

  public getNeighbors(vertex: GraphVertex<T>) {
    return vertex.getNeighbors()
  }

  public getVertexByKey(key: string) {
    return this.vertices[key]
  }

  public getAllVertices() {
    return Object.values(this.vertices)
  }

  public getWeight() {
    return this.getAllEdges().reduce((acc, edge) => acc + edge.weight, 0)
  }

  public getVerticesIndices() {
    const init: { [key: string]: number } = {}
    return this.getAllVertices().reduce(
      (obj, vertex, index) => ({
        ...obj,
        [vertex.getKey()]: index,
      }),
      init
    )
  }

  public getAdjacencyMatrix() {
    const vertices = this.getAllVertices()
    const verticesIndices = this.getVerticesIndices()
    const adjacencyMatrix: number[][] = Array(vertices.length)
      .fill(null)
      .map(() => Array(vertices.length).fill(Infinity))

    vertices.forEach((vertex, vertexIndex) => {
      vertex
        .getNeighbors()
        .toArray()
        .forEach(neighbor => {
          const neighborIndex = verticesIndices[neighbor.getKey()]

          adjacencyMatrix[vertexIndex][neighborIndex] = this.findEdge(
            vertex,
            neighbor
          )!.weight
        })
    })

    return adjacencyMatrix
  }

  public toString() {
    return Object.keys(this.vertices).join(',')
  }
}
