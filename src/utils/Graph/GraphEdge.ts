import GraphVertex from './GraphVertex'

export default class GraphEdge<T> {
  public readonly startVertex: GraphVertex<T>
  public readonly endVertex: GraphVertex<T>
  public readonly weight: number
  constructor(
    startVertex: GraphVertex<T>,
    endVertex: GraphVertex<T>,
    weight: number = 0
  ) {
    this.startVertex = startVertex
    this.endVertex = endVertex
    this.weight = weight
  }

  public toString() {
    return `${this.startVertex.toString()}_${this.endVertex.toString()}`
  }

  public getKey() {
    return this.toString()
  }
}
