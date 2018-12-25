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

// describe.skip('deleting nodes', () => {
//   let linkedList: LinkedList<number>

//   beforeAll(() => {
//     linkedList = new LinkedList()
//   })

//   describe('initial state', () => {
//     test('it returns null if deleting an unknown value', () => {
//       expect(linkedList.delete(5)).toBeNull()
//     })
//   })

//   describe('after adding values', () => {
//     beforeAll(() => {
//       linkedList.push(1)
//       linkedList.push(1)
//       linkedList.push(2)
//       linkedList.push(3)
//       linkedList.push(3)
//       linkedList.push(3)
//       linkedList.push(4)
//       linkedList.push(5)
//     })

//     test('it has the correct values', () => {
//       expect(linkedList.toString()).toBe('1,1,2,3,3,3,4,5')
//     })
//   })

//   describe('deleting a value', () => {
//     let deletedNode: LinkedListNode<number> | null

//     beforeAll(() => (deletedNode = linkedList.delete(3)))
//     test('it has the correct values', () => {
//       expect(linkedList.toString()).toBe('1,1,2,4,5')
//     })

//     test('it returns the deleted node', () => {
//       expect(deletedNode).toHaveProperty('value', 3)
//     })
//   })

//   describe('deleting a value: 1', () => {
//     beforeAll(() => linkedList.delete(1))
//     test('it has the correct values', () => {
//       expect(linkedList.toString()).toBe('2,4,5')
//     })
//   })

//   describe('deleting a value: 5', () => {
//     beforeAll(() => linkedList.delete(5))
//     test('it has the correct values', () => {
//       expect(linkedList.toString()).toBe('2,4')
//     })
//   })

//   describe('deleting a value: 4', () => {
//     beforeAll(() => linkedList.delete(4))
//     test('it has the correct values', () => {
//       expect(linkedList.toString()).toBe('2')
//     })
//   })

//   describe('deleting a value: 2', () => {
//     beforeAll(() => linkedList.delete(2))
//     test('it has the correct values', () => {
//       expect(linkedList.toString()).toBe('')
//     })
//   })
// })

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
