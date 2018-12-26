import Comparator from './Comparator'

interface ITestEach<T> {
  fn: keyof Comparator<T>
  args: [T, T]
  expected: boolean
}

describe('given the default comparator', () => {
  let comparator: Comparator<string | number>

  beforeEach(() => {
    comparator = new Comparator()
  })

  test.each`
    fn                      | args           | expected
    ${'equal'}              | ${[0, 0]}      | ${true}
    ${'equal'}              | ${[0, 1]}      | ${false}
    ${'equal'}              | ${['a', 'a']}  | ${true}
    ${'lessThan'}           | ${[1, 2]}      | ${true}
    ${'lessThan'}           | ${[-1, 2]}     | ${true}
    ${'lessThan'}           | ${['a', 'b']}  | ${true}
    ${'lessThan'}           | ${['a', 'ab']} | ${true}
    ${'lessThan'}           | ${[10, 2]}     | ${false}
    ${'lessThanOrEqual'}    | ${[10, 2]}     | ${false}
    ${'lessThanOrEqual'}    | ${[1, 1]}      | ${true}
    ${'lessThanOrEqual'}    | ${[0, 0]}      | ${true}
    ${'greaterThan'}        | ${[0, 0]}      | ${false}
    ${'greaterThan'}        | ${[10, 0]}     | ${true}
    ${'greaterThanOrEqual'} | ${[10, 0]}     | ${true}
    ${'greaterThanOrEqual'} | ${[10, 10]}    | ${true}
    ${'greaterThanOrEqual'} | ${[0, 10]}     | ${false}
  `(
    '$args.0 is $fn to $args.1',
    ({ fn, args, expected }: ITestEach<string | number>) => {
      expect(comparator[fn](...args)).toBe(expected)
    }
  )
})

describe('given a custom comparator function', () => {
  let comparator: Comparator<string>

  beforeEach(() => {
    comparator = new Comparator<string>((a, b) => {
      if (a.length === b.length) {
        return 0
      }

      return a.length < b.length ? -1 : 1
    })
  })

  test.each`
    fn                      | args           | expected
    ${'equal'}              | ${['a', 'b']}  | ${true}
    ${'equal'}              | ${['a', '']}   | ${false}
    ${'lessThan'}           | ${['b', 'aa']} | ${true}
    ${'greaterThanOrEqual'} | ${['a', 'aa']} | ${false}
    ${'greaterThanOrEqual'} | ${['aa', 'a']} | ${true}
    ${'greaterThanOrEqual'} | ${['a', 'a']}  | ${true}
  `(
    '$args.0 is $fn to $args.1',
    ({ fn, args, expected }: ITestEach<string>) => {
      expect(comparator[fn](...args)).toBe(expected)
    }
  )
})

describe('given a custom comparator function and reversed', () => {
  let comparator: Comparator<string>

  beforeEach(() => {
    comparator = new Comparator<string>((a, b) => {
      if (a.length === b.length) {
        return 0
      }

      return a.length < b.length ? -1 : 1
    }).reverse()
  })

  test.each`
    fn                      | args           | expected
    ${'equal'}              | ${['a', 'b']}  | ${true}
    ${'equal'}              | ${['a', '']}   | ${false}
    ${'lessThan'}           | ${['b', 'aa']} | ${false}
    ${'greaterThanOrEqual'} | ${['a', 'aa']} | ${true}
    ${'greaterThanOrEqual'} | ${['aa', 'a']} | ${false}
    ${'greaterThanOrEqual'} | ${['a', 'a']}  | ${true}
  `(
    '$args.0 is $fn to $args.1',
    ({ fn, args, expected }: ITestEach<string>) => {
      expect(comparator[fn](...args)).toBe(expected)
    }
  )
})
