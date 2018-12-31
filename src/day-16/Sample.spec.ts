import Sample from './Sample'

test('it can create a new Sample', () => {
  expect(new Sample([7, 5, 3, 1], [7, 5, 8, 1], [0, 2, 1, 2])).toBeInstanceOf(
    Sample
  )
})

describe('given a sample', () => {
  let sample: Sample
  beforeEach(() => {
    sample = new Sample([3, 2, 1, 1], [3, 2, 2, 1], [9, 2, 1, 2])
  })

  test.each`
    opName    | expected
    ${'mulr'} | ${true}
    ${'addi'} | ${true}
    ${'seti'} | ${true}
    ${'muli'} | ${false}
    ${'addr'} | ${false}
    ${'setr'} | ${false}
  `('it can test an op: $opName', ({ opName, expected }) => {
    expect(sample.testOp(opName)).toBe(expected)
  })
})
