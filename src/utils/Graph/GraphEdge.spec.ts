import GraphEdge from './GraphEdge'
import GraphVertex from './GraphVertex'

describe('given an edge', () => {
  let startVertex: GraphVertex<string>
  let endVertex: GraphVertex<string>
  let subject: GraphEdge<string>

  describe('with the default weight', () => {
    beforeEach(() => {
      startVertex = new GraphVertex('A')
      endVertex = new GraphVertex('B')

      subject = new GraphEdge(startVertex, endVertex)
    })

    test('#toString', () => {
      expect(subject.toString()).toEqual('A_B')
    })

    test('#getKey', () => {
      expect(subject.getKey()).toEqual('A_B')
    })

    test('.startVertex', () => {
      expect(subject).toHaveProperty('startVertex', startVertex)
    })
    test('.endVertex', () => {
      expect(subject).toHaveProperty('endVertex', endVertex)
    })
    test('.weight', () => {
      expect(subject).toHaveProperty('weight', 0)
    })
  })

  describe('with a custom weight', () => {
    beforeEach(() => {
      startVertex = new GraphVertex('A')
      endVertex = new GraphVertex('B')

      subject = new GraphEdge(startVertex, endVertex, 10)
    })

    test('.startVertex', () => {
      expect(subject).toHaveProperty('startVertex', startVertex)
    })
    test('.endVertex', () => {
      expect(subject).toHaveProperty('endVertex', endVertex)
    })
    test('.weight', () => {
      expect(subject).toHaveProperty('weight', 10)
    })
  })
})
