import LinkedListNode from './LinkedListNode'

describe('given a node with a value', () => {
  let node: LinkedListNode<number | string>

  beforeEach(() => {
    node = new LinkedListNode(1)
  })

  test.each`
    prop       | value
    ${'value'} | ${1}
    ${'next'}  | ${null}
  `('it has prop $prop with value $value', ({ prop, value }) => {
    expect(node).toHaveProperty(prop, value)
  })

  test('it can convert a node to string', () => {
    expect(node.toString()).toEqual('1')
  })

  test("it's value can be changed", () => {
    node.value = 'Test Success'
    expect(node.toString()).toEqual('Test Success')
  })
})

describe('given a node with an object as a value', () => {
  const nodeValue = { value: 1, key: 'test' }
  let node: LinkedListNode<typeof nodeValue>

  beforeEach(() => {
    node = new LinkedListNode(nodeValue)
  })
  test.each`
    prop             | value
    ${'value.value'} | ${1}
    ${'value.key'}   | ${'test'}
    ${'next'}        | ${null}
  `('it has prop $prop with value $value', ({ prop, value }) => {
    expect(node).toHaveProperty(prop, value)
  })

  test('it can convert node to string with custom stringifier', () => {
    const toStringCallback = (value: typeof nodeValue) =>
      `value: ${value.value}, key: ${value.key}`

    expect(node.toString(toStringCallback)).toEqual('value: 1, key: test')
  })
})

describe('given 2 linked nodes', () => {
  const node2 = new LinkedListNode(2)
  const node1 = new LinkedListNode(1, node2)

  test.each`
    subject  | prop            | value
    ${node1} | ${'next'}       | ${node2}
    ${node2} | ${'next'}       | ${null}
    ${node1} | ${'value'}      | ${1}
    ${node1} | ${'next.value'} | ${2}
  `('it has prop $prop with value $value', ({ subject, prop, value }) => {
    expect(subject).toHaveProperty(prop, value)
  })
})
