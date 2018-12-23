import { LinkedList, Node } from './LinkedList'

describe('Node', () => {
  describe('#join', () => {
    test('it can join nodes for inspect', () => {
      const node = new Node(10)
      node.next = new Node(7)
      node.next.next = new Node(5)

      expect(node.join('->')).toEqual('Node { 10 } -> Node { 7 } -> Node { 5 }')
    })
  })
})

describe('LinkedList', () => {
  describe('#insertBeginning', () => {
    test('it adds nodes the beginning', () => {
      const list = new LinkedList()
        .insertBeginning(new Node(5))
        .insertBeginning(new Node(8))

      expect(Array.from(list)).toEqual([8, 5])
    })
  })

  describe('#insertEnd', () => {
    test('it adds nodes the beginning', () => {
      const list = new LinkedList()
        .insertEnd(new Node(5))
        .insertEnd(new Node(8))

      expect(Array.from(list)).toEqual([5, 8])
    })
  })

  describe('#insertBefore', () => {
    test('it adds nodes the beginning', () => {
      const node = new Node(8)
      const list = new LinkedList().insertEnd(new Node(5)).insertEnd(node)

      list.insertBefore(node, new Node(7))

      expect(Array.from(list)).toEqual([5, 7, 8])
    })

    test('it works when adding to the first node', () => {
      const node = new Node(5)
      const list = new LinkedList().insertEnd(node).insertEnd(new Node(8))

      list.insertBefore(node, new Node(7))

      expect(Array.from(list)).toEqual([7, 5, 8])
    })
  })

  describe('#insertAfter', () => {
    test('it adds nodes the beginning', () => {
      const node = new Node(5)
      const list = new LinkedList().insertEnd(node).insertEnd(new Node(8))

      list.insertAfter(node, new Node(7))

      expect(Array.from(list)).toEqual([5, 7, 8])
    })

    test('it works when adding to the last node', () => {
      const node = new Node(8)
      const list = new LinkedList().insertEnd(new Node(5)).insertEnd(node)

      list.insertAfter(node, new Node(7))

      expect(Array.from(list)).toEqual([5, 8, 7])
    })
  })

  describe('#remove', () => {
    test('it removes a node', () => {
      const node = new Node(8)
      const list = new LinkedList()
        .insertEnd(new Node(5))
        .insertEnd(node)
        .insertEnd(new Node(7))

      list.remove(node)

      expect(Array.from(list)).toEqual([5, 7])
    })

    test('it can remove the only node', () => {
      const node = new Node(8)
      const list = new LinkedList().insertEnd(node)

      list.remove(node)

      expect(Array.from(list)).toEqual([])
    })
  })

  describe('#from', () => {
    test('it is sane', () => {
      const expected = [10, 15, 7, 11, 12, 13, 14, 6]
      const list = LinkedList.from(expected)

      expect(list.toArray()).toEqual(expected)
    })
  })

  describe('#mapNode', () => {
    test('it can map over a list', () => {
      const list = LinkedList.from([1, 2, 3, 4, 5])
      const expected = [3, 4, 5, 6, 7]

      expect(list.mapNode(node => new Node(node.value + 2)).toArray()).toEqual(
        expected
      )
    })

    test('it can be immutable', () => {
      const expected = [1, 2, 3, 4, 5]
      const list = LinkedList.from(expected)
      list.mapNode(node => new Node(node.value + 2))

      expect(list.toArray()).toEqual(expected)
    })
  })

  describe('#map', () => {
    test('it can map over values', () => {
      const list = LinkedList.from([1, 2, 3, 4, 5])
      const expected = [3, 4, 5, 6, 7]

      expect(list.map(x => x + 2).toArray()).toEqual(expected)
    })
  })

  describe('#mapWindow', () => {
    test('it can create a window to map over', () => {
      const list = LinkedList.from(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'])
      const expected = [
        '  ABC',
        ' ABCD',
        'ABCDE',
        'BCDEF',
        'CDEFG',
        'DEFGH',
        'EFGH ',
        'FGH  ',
      ]

      expect(
        list
          .mapWindow(([l2, l1, c, r1, r2]) => l2 + l1 + c + r1 + r2, 2, 2, ' ')
          .toArray()
      ).toEqual(expected)
    })

    test('it can work without a fill value', () => {
      const list = LinkedList.from(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'])
      const expected = ['ABC', 'BCD', 'CDE', 'DEF', 'EFG', 'FGH']

      expect(list.mapWindow(([c, r1, r2]) => c + r1 + r2, 2).toArray()).toEqual(
        expected
      )
    })

    test('it sends currentValue as a second param', () => {
      const list = LinkedList.from(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'])
      const expected = ['AAA', 'BBB', 'CCC', 'DDD', 'EEE', 'FFF']

      expect(
        list.mapWindow((window, value) => value.repeat(3), 2).toArray()
      ).toEqual(expected)
    })
  })
})
