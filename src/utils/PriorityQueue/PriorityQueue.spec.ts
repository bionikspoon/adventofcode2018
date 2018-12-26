import PriorityQueue from '.'

describe('#new', () => {
  test('it can create a queue', () => {
    const priorityQueue = new PriorityQueue()

    expect(priorityQueue).toBeDefined()
  })
})

describe('#add', () => {
  let priorityQueue: PriorityQueue<number>

  beforeAll(() => {
    priorityQueue = new PriorityQueue<number>()
  })

  describe('add 10, 1', () => {
    beforeAll(() => {
      priorityQueue.add(10, 1)
    })

    test('it arranges by priority', () => {
      expect(priorityQueue.peek()).toBe(10)
    })
  })

  describe('add 5, 2', () => {
    beforeAll(() => {
      priorityQueue.add(5, 2)
    })

    test('it arranges by priority', () => {
      expect(priorityQueue.peek()).toBe(10)
    })
  })

  describe('add 100, 0', () => {
    beforeAll(() => {
      priorityQueue.add(100, 0)
    })

    test('it arranges by priority', () => {
      expect(priorityQueue.peek()).toBe(100)
    })
  })
})

describe('#poll', () => {
  let priorityQueue: PriorityQueue<number>

  beforeAll(() => {
    priorityQueue = new PriorityQueue<number>()
      .add(10, 1)
      .add(5, 2)
      .add(100, 0)
      .add(200, 0)
  })

  test('it polls by priority: 100', () => {
    expect(priorityQueue.poll()).toBe(100)
  })

  test('it polls by priority: 200', () => {
    expect(priorityQueue.poll()).toBe(200)
  })

  test('it polls by priority: 10', () => {
    expect(priorityQueue.poll()).toBe(10)
  })

  test('it polls by priority: 5', () => {
    expect(priorityQueue.poll()).toBe(5)
  })
})

describe('#changePriority of internal nodes', () => {
  let priorityQueue: PriorityQueue<number>

  beforeAll(() => {
    priorityQueue = new PriorityQueue<number>()
      .add(10, 1)
      .add(5, 2)
      .add(100, 0)
      .add(200, 0)
  })

  beforeAll(() => {
    priorityQueue.changePriority(100, 10)
    priorityQueue.changePriority(10, 20)
  })

  test('it polls by priority: 200', () => {
    expect(priorityQueue.poll()).toBe(200)
  })

  test('it polls by priority: 5', () => {
    expect(priorityQueue.poll()).toBe(5)
  })

  test('it polls by priority: 100', () => {
    expect(priorityQueue.poll()).toBe(100)
  })

  test('it polls by priority: 10', () => {
    expect(priorityQueue.poll()).toBe(10)
  })
})

describe('#changePriority of head nodes', () => {
  let priorityQueue: PriorityQueue<number>

  beforeAll(() => {
    priorityQueue = new PriorityQueue<number>()
      .add(10, 1)
      .add(5, 2)
      .add(100, 0)
      .add(200, 0)
  })

  beforeAll(() => {
    priorityQueue.changePriority(200, 10)
    priorityQueue.changePriority(10, 20)
  })

  test('it polls by priority: 100', () => {
    expect(priorityQueue.poll()).toBe(100)
  })

  test('it polls by priority: 5', () => {
    expect(priorityQueue.poll()).toBe(5)
  })

  test('it polls by priority: 200', () => {
    expect(priorityQueue.poll()).toBe(200)
  })

  test('it polls by priority: 10', () => {
    expect(priorityQueue.poll()).toBe(10)
  })
})

describe('#changePriority with additions', () => {
  let priorityQueue: PriorityQueue<number>

  beforeAll(() => {
    priorityQueue = new PriorityQueue<number>()
      .add(10, 1)
      .add(5, 2)
      .add(100, 0)
      .add(200, 0)
  })

  beforeAll(() => {
    priorityQueue.changePriority(200, 10)
    priorityQueue.changePriority(10, 20)
  })

  beforeAll(() => {
    priorityQueue.add(15, 15)
  })

  test('it polls by priority: 100', () => {
    expect(priorityQueue.poll()).toBe(100)
  })

  test('it polls by priority: 5', () => {
    expect(priorityQueue.poll()).toBe(5)
  })

  test('it polls by priority: 200', () => {
    expect(priorityQueue.poll()).toBe(200)
  })

  test('it polls by priority: 15', () => {
    expect(priorityQueue.poll()).toBe(15)
  })

  test('it polls by priority: 10', () => {
    expect(priorityQueue.poll()).toBe(10)
  })
})

describe('#hasValue', () => {
  let priorityQueue: PriorityQueue<number>

  beforeAll(() => {
    priorityQueue = new PriorityQueue<number>()
      .add(10, 1)
      .add(5, 2)
      .add(100, 0)
      .add(200, 0)
      .add(15, 15)
  })

  test('it does not have missing values', () => {
    expect(priorityQueue.hasValue(70)).toBe(false)
  })

  test('it has added values', () => {
    expect(priorityQueue.hasValue(15)).toBe(true)
  })
})
