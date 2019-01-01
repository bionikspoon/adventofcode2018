import { groupBy, pipe, values, map, length } from 'ramda'
import { Graph, GraphEdge, GraphVertex } from '../utils/Graph'
import { Acre, AcreValue } from './Acre'
import { Token } from './shared'

const directions = [
  [0, 1],
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, -1],
  [-1, 0],
  [-1, 1],
]

export default class Grid extends Graph<Acre> {
  public static from(tokenList: Token[][]) {
    const grid = tokenList.reduce(
      (g, tokenRow, y) =>
        tokenRow.reduce((_, token, x) => {
          const acre = new Acre(x, y, token)
          const vertex = new GraphVertex(acre)
          return g.addVertex(vertex)
        }, g),
      new Grid(true)
    )

    grid.getAllVertices().forEach(vertex => {
      directions.forEach(([x, y]) => {
        const neighborKey = Acre.getKey(vertex.value.x + x, vertex.value.y + y)
        const neighbor = grid.getVertexByKey(neighborKey)
        if (neighbor) grid.addEdge(new GraphEdge(vertex, neighbor))
      })
    })
    return grid
  }

  public print() {
    return groupByAcreY(this.getAllVertices())
      .map(rows => rows.map(vertex => vertex.value.value.token).join(''))
      .join('\n')
  }

  public simulateMinutes(minutes: number) {
    for (let i = 0; i < minutes; i++) {
      this.getAllVertices()
        .map(
          vertex =>
            [
              vertex.value,
              vertex
                .getNeighbors()
                .toArray()
                .map(neighbor => neighbor.value.value),
            ] as [Acre, AcreValue[]]
        )
        .forEach(([acre, neighbors]) => {
          acre.evolve(neighbors)
        })
    }

    return this
  }

  public stats() {
    return mapLengths(
      groupByToken(this.getAllVertices().map(vertex => vertex.value.value))
    )
  }

  public answer() {
    const stats = this.stats()

    return stats[Token.TREE] * stats[Token.LUMBERYARD]
  }
}

const groupByAcreY: (
  vertices: Array<GraphVertex<Acre>>
) => Array<Array<GraphVertex<Acre>>> = pipe(
  groupBy<GraphVertex<Acre>>(vertex => vertex.value.y.toString()),
  values
)

const groupByToken: (
  values: AcreValue[]
) => { [token: string]: AcreValue[] } = groupBy(value => value.token)

const mapLengths: <T>(
  groups: { [token: string]: T[] }
) => { [token: string]: number } = map(length)
