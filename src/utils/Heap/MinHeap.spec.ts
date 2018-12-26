import { MinHeap } from '.'
import Comparator from '../Comparator'

describe('#new', () => {
  let minHeap: MinHeap<any>

  beforeEach(() => (minHeap = new MinHeap()))

  test('it can create a new heap', () => {
    expect(minHeap).toBeDefined()
  })

  test('it is empty', () => {
    expect(minHeap.peek()).toBeNull()
  })

  test('it is empty', () => {
    expect(minHeap.isEmpty()).toBeTruthy()
  })
})

describe('#add', () => {
  let minHeap: MinHeap<number>

  describe('add 5', () => {
    beforeAll(() => {
      minHeap = new MinHeap<number>().add(5)
    })

    test('it is no longer empty', () => {
      expect(minHeap.isEmpty()).toBeFalsy()
    })

    test('it has a head of 5', () => {
      expect(minHeap.peek()).toBe(5)
    })

    test('it has the new value', () => {
      expect(minHeap.toString()).toBe('5')
    })
  })

  describe('add 3', () => {
    beforeAll(() => {
      minHeap.add(3)
    })

    test('it has a head of 3', () => {
      expect(minHeap.peek()).toBe(3)
    })

    test('it has the new value', () => {
      expect(minHeap.toString()).toBe('3,5')
    })
  })

  describe('add 10', () => {
    beforeAll(() => {
      minHeap.add(10)
    })

    test('it has a head of 3', () => {
      expect(minHeap.peek()).toBe(3)
    })

    test('it has the new value', () => {
      expect(minHeap.toString()).toBe('3,5,10')
    })
  })

  describe('add 1', () => {
    beforeAll(() => {
      minHeap.add(1)
    })

    test('it has a head of 1', () => {
      expect(minHeap.peek()).toBe(1)
    })

    test('it has the new value', () => {
      expect(minHeap.toString()).toBe('1,3,10,5')
    })
  })

  describe('add 1 again', () => {
    beforeAll(() => {
      minHeap.add(1)
    })

    test('it has a head of 1', () => {
      expect(minHeap.peek()).toBe(1)
    })

    test('it has the new value', () => {
      expect(minHeap.toString()).toBe('1,1,10,5,3')
    })
  })
})

describe('#poll', () => {
  let minHeap: MinHeap<number>

  describe('initial state', () => {
    beforeAll(() => {
      minHeap = new MinHeap<number>()
        .add(5)
        .add(3)
        .add(10)
        .add(11)
        .add(1)
    })

    test('it has all the values', () => {
      expect(minHeap.toString()).toBe('1,3,10,11,5')
    })
  })

  describe('poll #1', () => {
    let value: number | null
    beforeAll(() => (value = minHeap.poll()))

    test('it returns the removed value', () => {
      expect(value).toBe(1)
    })

    test('the head value is removed', () => {
      expect(minHeap.toString()).toBe('3,5,10,11')
    })
  })

  describe('poll #2', () => {
    let value: number | null
    beforeAll(() => (value = minHeap.poll()))

    test('it returns the removed value', () => {
      expect(value).toBe(3)
    })

    test('the head value is removed', () => {
      expect(minHeap.toString()).toBe('5,11,10')
    })
  })

  describe('poll #3', () => {
    let value: number | null
    beforeAll(() => (value = minHeap.poll()))

    test('it returns the removed value', () => {
      expect(value).toBe(5)
    })

    test('the head value is removed', () => {
      expect(minHeap.toString()).toBe('10,11')
    })
  })

  describe('poll #4', () => {
    let value: number | null
    beforeAll(() => (value = minHeap.poll()))

    test('it returns the removed value', () => {
      expect(value).toBe(10)
    })

    test('the head value is removed', () => {
      expect(minHeap.toString()).toBe('11')
    })
  })

  describe('poll #5', () => {
    let value: number | null
    beforeAll(() => (value = minHeap.poll()))

    test('it returns the removed value', () => {
      expect(value).toBe(11)
    })

    test('the head value is removed', () => {
      expect(minHeap.toString()).toBe('')
    })
  })

  describe('poll #6', () => {
    let value: number | null
    beforeAll(() => (value = minHeap.poll()))

    test('it returns the removed value', () => {
      expect(value).toBeNull()
    })

    test('the head value is removed', () => {
      expect(minHeap.toString()).toBe('')
    })
  })

  describe('poll #7', () => {
    let value: number | null
    beforeAll(() => (value = minHeap.poll()))

    test('it returns the removed value', () => {
      expect(value).toBeNull()
    })

    test('the head value is removed', () => {
      expect(minHeap.toString()).toBe('')
    })
  })
})

describe('heapifying down through the right branch', () => {
  let minHeap: MinHeap<number>

  describe('initial state', () => {
    beforeAll(() => {
      minHeap = new MinHeap<number>()
        .add(3)
        .add(12)
        .add(10)
    })

    test('it has all the values', () => {
      expect(minHeap.toString()).toBe('3,12,10')
    })
  })

  describe('add 11', () => {
    beforeAll(() => {
      minHeap.add(11)
    })

    test('it has all the values', () => {
      expect(minHeap.toString()).toBe('3,11,10,12')
    })
  })

  describe('poll #1', () => {
    let value: number | null
    beforeAll(() => (value = minHeap.poll()))

    test('it returns the removed value', () => {
      expect(value).toBe(3)
    })

    test('the head value is removed', () => {
      expect(minHeap.toString()).toBe('10,11,12')
    })
  })
})

describe('#find', () => {
  let minHeap: MinHeap<number>

  beforeEach(() => {
    minHeap = new MinHeap<number>()
      .add(3)
      .add(12)
      .add(10)
      .add(11)
      .add(11)
  })

  test('it has all the values', () => {
    expect(minHeap.toString()).toBe('3,11,10,12,11')
  })

  test.each`
    value | expected
    ${5}  | ${[]}
    ${3}  | ${[0]}
    ${11} | ${[1, 4]}
  `('it can find value $value', ({ value, expected }) => {
    expect(minHeap.find(value)).toEqual(expected)
  })
})

describe('#remove with heapify down', () => {
  let minHeap: MinHeap<number>

  beforeAll(() => {
    minHeap = new MinHeap<number>()
      .add(3)
      .add(12)
      .add(10)
      .add(11)
      .add(11)
  })

  test('it has the initial values', () => {
    expect(minHeap.toString()).toBe('3,11,10,12,11')
  })

  test('it removes the value: 3', () => {
    expect(minHeap.remove(3).toString()).toEqual('10,11,11,12')
  })

  test('it heapifies down', () => {
    expect(minHeap.remove(3).peek()).toEqual(10)
  })
  test('it removes the value: 11', () => {
    expect(minHeap.remove(11).toString()).toEqual('10,12')
  })
  test('it still heapifies down', () => {
    expect(minHeap.remove(3).peek()).toEqual(10)
  })
})

describe('#remove with heapify up', () => {
  let minHeap: MinHeap<number>

  beforeAll(() => {
    minHeap = new MinHeap<number>()
      .add(3)
      .add(10)
      .add(5)
      .add(6)
      .add(7)
      .add(4)
      .add(6)
      .add(8)
      .add(2)
      .add(1)
  })

  test('it has the initial values', () => {
    expect(minHeap.toString()).toBe('1,2,4,6,3,5,6,10,8,7')
  })

  test('it removes the value: 8', () => {
    expect(minHeap.remove(8).toString()).toEqual('1,2,4,6,3,5,6,10,7')
  })
  test('it removes the value: 7', () => {
    expect(minHeap.remove(7).toString()).toEqual('1,2,4,6,3,5,6,10')
  })
  test('it removes the value: 1', () => {
    expect(minHeap.remove(1).toString()).toEqual('2,3,4,6,10,5,6')
  })
  test('it removes the value: 2', () => {
    expect(minHeap.remove(2).toString()).toEqual('3,6,4,6,10,5')
  })
  test('it removes the value: 6', () => {
    expect(minHeap.remove(6).toString()).toEqual('3,5,4,10')
  })
  test('it removes the value: 10', () => {
    expect(minHeap.remove(10).toString()).toEqual('3,5,4')
  })
  test('it removes the value: 5', () => {
    expect(minHeap.remove(5).toString()).toEqual('3,4')
  })
  test('it removes the value: 3', () => {
    expect(minHeap.remove(3).toString()).toEqual('4')
  })
  test('it removes the value: 4', () => {
    expect(minHeap.remove(4).toString()).toEqual('')
  })
})

describe('removing with a custom comparator', () => {
  let minHeap: MinHeap<string>
  let comparator: Comparator<string>

  beforeAll(() => {
    minHeap = new MinHeap<string>()
      .add('dddd')
      .add('ccc')
      .add('bb')
      .add('a')

    comparator = new Comparator<string>((a, b) => {
      if (a.length === b.length) return 0

      return a.length < b.length ? -1 : 1
    })
  })

  test('it has the initial values', () => {
    expect(minHeap.toString()).toBe('a,bb,ccc,dddd')
  })

  test('it removes the value: 8', () => {
    expect(minHeap.remove('hey', comparator).toString()).toEqual('a,bb,dddd')
  })
})
