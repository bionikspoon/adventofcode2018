import LinkedList from './LinkedList'

describe('#new', () => {
  it('should create empty linked list', () => {
    const linkedList = new LinkedList()
    expect(linkedList.toString()).toBe('')
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

describe('#push', () => {
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

  describe('after pushing', () => {
    beforeEach(() => {
      linkedList.push(1)
      linkedList.push(2)
    })

    test("it's string repr shows each value", () => {
      expect(linkedList.toString()).toBe('1,2')
    })

    test("it's nodes are linked correctly", () => {
      expect(linkedList.tailNode!.next).toBeNull()
    })
  })
})

describe('#unshift', () => {
  let linkedList: LinkedList<number>

  describe('initial state', () => {
    beforeAll(() => {
      linkedList = new LinkedList<number>()
      linkedList.unshift(2)
    })

    test('it sets head', () => {
      expect(linkedList).toHaveProperty('head', 2)
    })
    test('it sets tail', () => {
      expect(linkedList).toHaveProperty('tail', 2)
    })
  })

  describe('after push and unshift', () => {
    beforeAll(() => {
      linkedList.push(1)
      linkedList.unshift(3)
    })

    test('it has the correct values', () => {
      expect(linkedList.toString()).toBe('3,2,1')
    })
  })
})

describe('#shift', () => {
  let linkedList: LinkedList<number>

  beforeAll(() => {
    linkedList = new LinkedList<number>()
      .push(1)
      .push(2)
      .push(3)
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
      expect(linkedList).toHaveProperty('head', 2)
    })

    test('it should have the old tail', () => {
      expect(linkedList).toHaveProperty('tail', 3)
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
      expect(linkedList).toHaveProperty('head', 3)
    })

    test('it should have the old tail', () => {
      expect(linkedList).toHaveProperty('tail', 3)
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
      .push(1)
      .push(2)
      .push(3)
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
      expect(linkedList).toHaveProperty('head', 1)
    })

    test('it should have a new tail', () => {
      expect(linkedList).toHaveProperty('tail', 2)
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
      expect(linkedList).toHaveProperty('head', 1)
    })

    test('it should have a new tail', () => {
      expect(linkedList).toHaveProperty('tail', 1)
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
      .push(nodeValue1)
      .unshift(nodeValue2)

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
      .push({ value: 1, key: 'test1' })
      .push({ value: 2, key: 'test2' })
      .push({ value: 3, key: 'test3' })
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
      .push({ value: 1, key: 'test1' })
      .push({ value: 2, key: 'test2' })
      .push({ value: 3, key: 'test3' })
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

describe('#deleteWhere', () => {
  let linkedList: LinkedList<number>

  describe('initial state', () => {
    beforeAll(() => {
      linkedList = new LinkedList<number>()
        .push(1)
        .push(1)
        .push(2)
        .push(3)
        .push(3)
        .push(3)
        .push(4)
        .push(5)
    })

    test('it has the correct values', () => {
      expect(linkedList.toString()).toBe('1,1,2,3,3,3,4,5')
    })
  })

  describe('after removing a value: 3', () => {
    beforeAll(() => {
      linkedList.deleteWhere(value => value === 3)
    })
    test('it has the correct values', () => {
      expect(linkedList.toString()).toBe('1,1,2,4,5')
    })

    test.each`
      prop      | value
      ${'head'} | ${1}
      ${'tail'} | ${5}
    `('it has prop $prop with value $value', ({ prop, value }) => {
      expect(linkedList).toHaveProperty(prop, value)
    })
  })

  describe('after removing a value: 1', () => {
    beforeAll(() => {
      linkedList.deleteWhere(value => value === 1)
    })

    test('it has the correct values', () => {
      expect(linkedList.toString()).toBe('2,4,5')
    })

    test.each`
      prop      | value
      ${'head'} | ${2}
      ${'tail'} | ${5}
    `('it has prop $prop with value $value', ({ prop, value }) => {
      expect(linkedList).toHaveProperty(prop, value)
    })
  })

  describe('after removing a value: 5', () => {
    beforeAll(() => {
      linkedList.deleteWhere(value => value === 5)
    })

    test('it has the correct values', () => {
      expect(linkedList.toString()).toBe('2,4')
    })

    test.each`
      prop      | value
      ${'head'} | ${2}
      ${'tail'} | ${4}
    `('it has prop $prop with value $value', ({ prop, value }) => {
      expect(linkedList).toHaveProperty(prop, value)
    })
  })

  describe('after removing the rest', () => {
    beforeAll(() => {
      linkedList.deleteWhere(() => true)
    })

    test('it has the correct values', () => {
      expect(linkedList.toString()).toBe('')
    })

    test.each`
      prop      | value
      ${'head'} | ${null}
      ${'tail'} | ${null}
    `('it has prop $prop with value $value', ({ prop, value }) => {
      expect(linkedList).toHaveProperty(prop, value)
    })
  })
})

describe('#map', () => {
  let linkedListNumber: LinkedList<number>
  let linkedListString: LinkedList<string>

  describe('initial state', () => {
    beforeAll(() => {
      linkedListNumber = new LinkedList<number>()
        .push(1)
        .push(1)
        .push(2)
        .push(3)
        .push(3)
        .push(3)
        .push(4)
        .push(5)
    })

    test('it has the correct values', () => {
      expect(linkedListNumber.toArray()).toEqual([1, 1, 2, 3, 3, 3, 4, 5])
    })
  })

  describe('after mapping over the list', () => {
    beforeAll(() => {
      linkedListString = linkedListNumber.map(value => value.toString())
    })
    test('it has new values', () => {
      expect(linkedListString.toArray()).toEqual([
        '1',
        '1',
        '2',
        '3',
        '3',
        '3',
        '4',
        '5',
      ])
    })
  })
})

describe('#reverse', () => {
  let linkedList: LinkedList<number>

  beforeAll(() => {
    linkedList = new LinkedList<number>()
      .push(1)
      .push(2)
      .push(3)
  })

  describe('initial state', () => {
    test('it has the correct values', () => {
      expect(linkedList.toString()).toBe('1,2,3')
    })
    test('it has the correct head', () => {
      expect(linkedList).toHaveProperty('head', 1)
    })
    test('it has the correct tail', () => {
      expect(linkedList).toHaveProperty('tail', 3)
    })
  })

  describe('after first reverse', () => {
    beforeAll(() => linkedList.reverse())

    test('it has the correct values', () => {
      expect(linkedList.toString()).toBe('3,2,1')
    })
    test('it has the correct head', () => {
      expect(linkedList).toHaveProperty('head', 3)
    })
    test('it has the correct tail', () => {
      expect(linkedList).toHaveProperty('tail', 1)
    })
  })

  describe('after second  reverse', () => {
    beforeAll(() => linkedList.reverse())

    test('it has the correct values', () => {
      expect(linkedList.toString()).toBe('1,2,3')
    })
    test('it has the correct head', () => {
      expect(linkedList).toHaveProperty('head', 1)
    })
    test('it has the correct tail', () => {
      expect(linkedList).toHaveProperty('tail', 3)
    })
  })
})

describe('#clear', () => {
  let linkedList: LinkedList<number>

  describe('initial state', () => {
    beforeAll(() => {
      linkedList = LinkedList.from([1, 2, 3])
    })
    test('it has the correct values', () => {
      expect(linkedList.toArray()).toEqual([1, 2, 3])
    })
  })

  describe('after clearing', () => {
    beforeAll(() => {
      linkedList.clear()
    })

    test('it is empty', () => {
      expect(linkedList.toArray()).toEqual([])
    })
    test.each`
      prop      | value
      ${'head'} | ${null}
      ${'tail'} | ${null}
    `('it has prop $prop with value $value', ({ prop, value }) => {
      expect(linkedList).toHaveProperty(prop, value)
    })
  })
})

describe('#includes', () => {
  test('it is true when the value exists', () => {
    const linkedList = LinkedList.from([1, 2, 3])

    expect(linkedList.includes(2)).toBeTruthy()
  })
  test('it is false when the value is missing', () => {
    const linkedList = LinkedList.from([1, 2, 3])

    expect(linkedList.includes(5)).toBeFalsy()
  })
})

describe('#length', () => {
  test('it has length 0', () => {
    const linkedList = new LinkedList()
    expect(linkedList).toHaveLength(0)
  })

  test('it has length equal to the number of items', () => {
    const linkedList = LinkedList.from([1, 2, 2, 2, 2, 2])
    expect(linkedList).toHaveLength(6)
  })
})
