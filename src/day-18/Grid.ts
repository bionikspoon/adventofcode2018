import { groupBy, pipe, values } from 'ramda'
import { Graph, GraphVertex } from '../utils/Graph'
import { Acre, acreFromToken } from './Acre'
import { Token } from './shared'

export default class Grid extends Graph<Acre> {
  public static from(tokenList: Token[][]) {
    const grid = tokenList.reduce(
      (g, tokenRow, y) =>
        tokenRow.reduce((_, token, x) => {
          const acre = acreFromToken(x, y, token)
          const vertex = new GraphVertex(acre)
          return g.addVertex(vertex)
        }, g),
      new Grid()
    )
    return grid
  }

  public print() {
    return groupByAcreY(this.getAllVertices())
      .map(rows => rows.map(vertex => vertex.value.token).join(''))
      .join('\n')
  }
}

const groupByAcreY: (
  vertices: Array<GraphVertex<Acre>>
) => Array<Array<GraphVertex<Acre>>> = pipe(
  groupBy<GraphVertex<Acre>>(vertex => vertex.value.y.toString()),
  values
)
