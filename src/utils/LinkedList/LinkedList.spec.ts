import LinkedList from './LinkedList'
import LinkedListNode from './LinkedListNode'

describe('#new', () => {
  it('should create empty linked list', () => {
    const linkedList = new LinkedList()
    expect(linkedList.toString()).toBe('')
  })
})

describe('#append', () => {
  let linkedList: LinkedList<number>

  beforeEach(() => {
    linkedList = new LinkedList()
  })

  describe('initial state', () => {
    test.each`
      prop      | value
      ${'head'} | ${null}
      ${'tail'} | ${null}
    `('it has prop $prop with value $value', ({ prop, value }) => {
      expect(linkedList).toHaveProperty(prop, value)
    })
  })

  describe('after appending', () => {
    beforeEach(() => {
      linkedList.append(1)
      linkedList.append(2)
    })

    test("it's string repr shows each value", () => {
      expect(linkedList.toString()).toBe('1,2')
    })

    test("it's nodes are linked correctly", () => {
      expect(linkedList.tail!.next).toBeNull()
    })
  })
})

describe('#prepend', () => {
  it('should prepend node to linked list', () => {
    const linkedList = new LinkedList()

    linkedList.prepend(2)
    expect(linkedList.head!.toString()).toBe('2')
    expect(linkedList.tail!.toString()).toBe('2')

    linkedList.append(1)
    linkedList.prepend(3)

    expect(linkedList.toString()).toBe('3,2,1')
  })
})

describe.skip('deleting nodes', () => {
  let linkedList: LinkedList<number>

  beforeAll(() => {
    linkedList = new LinkedList()
  })

  describe('initial state', () => {
    test('it returns null if deleting an unknown value', () => {
      expect(linkedList.delete(5)).toBeNull()
    })
  })

  describe('after adding values', () => {
    beforeAll(() => {
      linkedList.append(1)
      linkedList.append(1)
      linkedList.append(2)
      linkedList.append(3)
      linkedList.append(3)
      linkedList.append(3)
      linkedList.append(4)
      linkedList.append(5)
    })

    test('it has the correct values', () => {
      expect(linkedList.toString()).toBe('1,1,2,3,3,3,4,5')
    })
  })

  describe('deleting a value', () => {
    let deletedNode: LinkedListNode<number> | null

    beforeAll(() => (deletedNode = linkedList.delete(3)))
    test('it has the correct values', () => {
      expect(linkedList.toString()).toBe('1,1,2,4,5')
    })

    test('it returns the deleted node', () => {
      expect(deletedNode).toHaveProperty('value', 3)
    })
  })

  describe('deleting a value: 1', () => {
    beforeAll(() => linkedList.delete(1))
    test('it has the correct values', () => {
      expect(linkedList.toString()).toBe('2,4,5')
    })
  })

  describe('deleting a value: 5', () => {
    beforeAll(() => linkedList.delete(5))
    test('it has the correct values', () => {
      expect(linkedList.toString()).toBe('2,4')
    })
  })

  describe('deleting a value: 4', () => {
    beforeAll(() => linkedList.delete(4))
    test('it has the correct values', () => {
      expect(linkedList.toString()).toBe('2')
    })
  })

  describe('deleting a value: 2', () => {
    beforeAll(() => linkedList.delete(2))
    test('it has the correct values', () => {
      expect(linkedList.toString()).toBe('')
    })
  })
})

describe('#shift', () => {
  let linkedList: LinkedList<number>

  beforeAll(() => {
    linkedList = new LinkedList<number>()
      .append(1)
      .append(2)
      .append(3)
  })

  describe('initial state', () => {
    test('it has the correct values', () => {
      expect(linkedList.toString()).toBe('1,2,3')
    })
  })

  describe('first unshift', () => {
    let deletedValue: number | null

    beforeAll(() => {
      deletedValue = linkedList.shift()
    })

    test('it returns the deleted value', () => {
      expect(deletedValue).toEqual(1)
    })

    test('it should have the correct values', () => {
      expect(linkedList.toString()).toBe('2,3')
    })

    test('it should have a new head', () => {
      expect(linkedList.head!.toString()).toBe('2')
    })

    test('it should have the old tail', () => {
      expect(linkedList.tail!.toString()).toBe('3')
    })
  })

  describe('second unshift', () => {
    let deletedValue: number | null

    beforeAll(() => {
      deletedValue = linkedList.shift()
    })

    test('it returns the deleted value', () => {
      expect(deletedValue).toEqual(2)
    })

    test('it should have the correct values', () => {
      expect(linkedList.toString()).toBe('3')
    })

    test('it should have a new head', () => {
      expect(linkedList.head!.toString()).toBe('3')
    })

    test('it should have the old tail', () => {
      expect(linkedList.tail!.toString()).toBe('3')
    })
  })

  describe('last unshift', () => {
    let deletedValue: number | null

    beforeAll(() => {
      deletedValue = linkedList.shift()
    })

    test('it returns the deleted value', () => {
      expect(deletedValue).toEqual(3)
    })

    test('it should be empty', () => {
      expect(linkedList.toString()).toBe('')
    })

    test('it should have no head', () => {
      expect(linkedList.head).toBeNull()
    })

    test('it should have no head', () => {
      expect(linkedList.tail).toBeNull()
    })
  })
})

describe('#pop', () => {
  let linkedList: LinkedList<number>

  beforeAll(() => {
    linkedList = new LinkedList<number>()
      .append(1)
      .append(2)
      .append(3)
  })

  describe('initial state', () => {
    test('it has the correct values', () => {
      expect(linkedList.toString()).toBe('1,2,3')
    })
  })

  describe('first pop', () => {
    let deletedValue: number | null

    beforeAll(() => {
      deletedValue = linkedList.pop()
    })

    test('it returns the deleted value', () => {
      expect(deletedValue).toEqual(3)
    })

    test('it should have the correct values', () => {
      expect(linkedList.toString()).toBe('1,2')
    })

    test('it should have the old head', () => {
      expect(linkedList.head!.toString()).toBe('1')
    })

    test('it should have a new tail', () => {
      expect(linkedList.tail!.toString()).toBe('2')
    })
  })

  describe('second pop', () => {
    let deletedValue: number | null

    beforeAll(() => {
      deletedValue = linkedList.pop()
    })

    test('it returns the deleted value', () => {
      expect(deletedValue).toEqual(2)
    })

    test('it should have the correct values', () => {
      expect(linkedList.toString()).toBe('1')
    })

    test('it should have the old head', () => {
      expect(linkedList.head!.toString()).toBe('1')
    })

    test('it should have a new tail', () => {
      expect(linkedList.tail!.toString()).toBe('1')
    })
  })

  describe('last pop', () => {
    let deletedValue: number | null

    beforeAll(() => {
      deletedValue = linkedList.pop()
    })

    test('it returns the deleted value', () => {
      expect(deletedValue).toEqual(1)
    })

    test('it should be empty', () => {
      expect(linkedList.toString()).toBe('')
    })

    test('it should have no head', () => {
      expect(linkedList.head).toBeNull()
    })

    test('it should have no head', () => {
      expect(linkedList.tail).toBeNull()
    })
  })
})

describe('#toString', () => {
  test('it can store complex object and print them out', () => {
    const nodeValue1 = { value: 1, key: 'key1' }
    const nodeValue2 = { value: 2, key: 'key2' }
    const linkedList = new LinkedList<typeof nodeValue1>()
      .append(nodeValue1)
      .prepend(nodeValue2)

    const nodeStringifier = (value: typeof nodeValue1) =>
      `${value.key}:${value.value}`
    expect(linkedList.toString(nodeStringifier)).toBe('key2:2,key1:1')
  })
})

describe('#find', () => {
  interface ITestObject {
    value: number
    key: string
  }

  let linkedList: LinkedList<ITestObject>

  beforeEach(() => {
    linkedList = new LinkedList<ITestObject>()
      .append({ value: 1, key: 'test1' })
      .append({ value: 2, key: 'test2' })
      .append({ value: 3, key: 'test3' })
  })

  test('it finds a value', () => {
    expect(linkedList.find(value => value.key.includes('2'))).toEqual({
      value: 2,
      key: 'test2',
    })
  })
  test('it returns null if a no value is found', () => {
    expect(linkedList.find(value => value.key.includes('4'))).toBeNull()
  })
})

describe('#findNode', () => {
  interface ITestObject {
    value: number
    key: string
  }

  let linkedList: LinkedList<ITestObject>

  beforeEach(() => {
    linkedList = new LinkedList<ITestObject>()
      .append({ value: 1, key: 'test1' })
      .append({ value: 2, key: 'test2' })
      .append({ value: 3, key: 'test3' })
  })

  test('it finds a value', () => {
    expect(
      linkedList.findNode(node => node.value.key.includes('2'))
    ).toHaveProperty('value', {
      value: 2,
      key: 'test2',
    })
  })

  test('it returns null if a no value is found', () => {
    expect(linkedList.findNode(node => node.value.key.includes('4'))).toBeNull()
  })
})

describe('LinkedList#from', () => {
  let linkedList: LinkedList<number>

  beforeEach(() => {
    linkedList = LinkedList.from([1, 1, 2, 3, 3, 3, 4, 5])
  })

  test('it is a LinkedList', () => {
    expect(linkedList).toBeInstanceOf(LinkedList)
  })

  test('it can create a list from array', () => {
    expect(linkedList.toString()).toBe('1,1,2,3,3,3,4,5')
  })
})

describe('#reverse', () => {
  let linkedList: LinkedList<number>

  beforeAll(() => {
    linkedList = new LinkedList<number>()
      .append(1)
      .append(2)
      .append(3)
  })

  describe('initial state', () => {
    test('it has the correct values', () => {
      expect(linkedList.toString()).toBe('1,2,3')
    })
    test('it has the correct head', () => {
      expect(linkedList.head!.value).toBe(1)
    })
    test('it has the correct tail', () => {
      expect(linkedList.tail!.value).toBe(3)
    })
  })

  describe('after first reverse', () => {
    beforeAll(() => linkedList.reverse())

    test('it has the correct values', () => {
      expect(linkedList.toString()).toBe('3,2,1')
    })
    test('it has the correct head', () => {
      expect(linkedList.head!.value).toBe(3)
    })
    test('it has the correct tail', () => {
      expect(linkedList.tail!.value).toBe(1)
    })
  })

  describe('after second  reverse', () => {
    beforeAll(() => linkedList.reverse())

    test('it has the correct values', () => {
      expect(linkedList.toString()).toBe('1,2,3')
    })
    test('it has the correct head', () => {
      expect(linkedList.head!.value).toBe(1)
    })
    test('it has the correct tail', () => {
      expect(linkedList.tail!.value).toBe(3)
    })
  })
})
