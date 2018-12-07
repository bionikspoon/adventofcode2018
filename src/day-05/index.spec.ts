import { reducePolymers, LinkedList, Node } from '.'
import { getInput } from '../utils/tests'

describe('part 1', () => {
  describe.each`
    file                   | count
    ${'part-1-case-1.txt'} | ${10}
    ${'index.txt'}         | ${10886}
  `('given $file', async ({ file, count }) => {
    let input: string

    beforeEach(async () => {
      input = await getInput(__dirname, file)
    })

    test('it matches snapshot', () => {
      expect(reducePolymers(input)).toMatchSnapshot()
    })

    test("it's counts match up", () => {
      expect(reducePolymers(input)).toHaveLength(count)
    })
  })
})

describe('LinkedList', () => {
  let list: LinkedList<number>

  beforeEach(() => {
    list = new LinkedList<number>()
      .insertEnd(new Node(10))
      .insertEnd(new Node(15))
      .insertEnd(new Node(7))
      .insertEnd(new Node(11))
      .insertEnd(new Node(12))
      .insertEnd(new Node(13))
      .insertEnd(new Node(14))
      .insertEnd(new Node(6))
  })

  test('it can add items', () => {
    expect(Array.from(list)).toEqual([10, 15, 7, 11, 12, 13, 14, 6])
  })

  test('it can remove items', () => {
    list.remove(list.firstNode!.next!.next!)
    list.remove(list.firstNode!.next!.next!)
    list.remove(list.firstNode!.next!.next!.next!.next!)

    expect(Array.from(list)).toEqual([10, 15, 12, 13, 6])
  })

  test('it preserves previous items', () => {
    list.remove(list.firstNode!.next!.next!)
    list.remove(list.firstNode!.next!.next!)
    list.remove(list.firstNode!.next!.next!.next!.next!)

    const subject = list!.firstNode!.next!.next!.next!.next!.prev!.prev!.prev!
      .prev!.value

    expect(subject).toEqual(10)
  })

  test('it preserves previous items', () => {
    list.remove(list.firstNode!.next!.next!)
    list.remove(list.firstNode!.next!.next!)
    list.remove(list.firstNode!.next!.next!.next!.next!)

    const subject = list!.firstNode!.next!.next!.next!.next!.prev!.prev!.prev!
      .value

    expect(subject).toEqual(15)
  })
})
