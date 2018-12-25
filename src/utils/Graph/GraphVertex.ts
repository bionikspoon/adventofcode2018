import GraphEdge from './GraphEdge'

export default class GraphVertex<T> {
  private readonly value: T
  private edges: Array<GraphEdge<T>> = []
  constructor(value: T) {
    this.value = value
  }

  public toString() {
    return this.value.toString()
  }

  public getKey() {
    return this.toString()
  }

  public getEdges() {
    return this.edges
  }

  public addEdge(edge: GraphEdge<T>) {
    this.edges.push(edge)
    return this
  }

  public hasEdge(edge: GraphEdge<T>) {
    return this.edges.includes(edge)
  }

  public deleteEdge(edge: GraphEdge<T>) {
    this.edges = this.edges.filter(e => e !== edge)
    return this
  }

  public findEdge(vertex: GraphVertex<T>) {
    const edge = this.edges.find(
      e => e.startVertex === vertex || e.endVertex === vertex
    )
    return edge || null
  }

  public deleteAllEdges() {
    this.edges = []
    return this
  }

  public getNeighbors() {
    return this.edges.map(node =>
      node.startVertex === this ? node.endVertex : node.startVertex
    )
  }

  public hasNeighbor(vertex: GraphVertex<T>) {
    return Boolean(
      this.edges.find(
        edge => edge.startVertex === vertex || edge.endVertex === vertex
      )
    )
  }

  public getDegrees() {
    return this.edges.length
  }
}
