import BinaryTree from './BinaryTree'

test('it has an initial value', () => {
  const tree = new BinaryTree(0)

  expect(tree.value).toEqual(0)
})

test('it can insert numbers', () => {
  const tree = new BinaryTree(0)

  tree.insert(1)

  expect(tree.toArray()).toEqual([0, 1])
})

test('it maintains order', () => {
  const tree = new BinaryTree(5)

  tree
    .insert(3)
    .insert(7)
    .insert(8)
    .insert(2)
    .insert(4)

  expect(tree.toArray()).toEqual([2, 3, 4, 5, 7, 8])
})

test('it throws if you try to add duplicates', () => {
  const tree = new BinaryTree(5)

  tree.insert(2).insert(6)

  expect(() => {
    tree.insert(6)
  }).toThrowError('BinaryTree.value already exists: 6')
})
