import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import {
  BinaryTree,
  chronalCalibrationRepeat,
  chronalCalibrationSum,
  cycle,
} from '..'

describe('#chronalCalibrationSum', () => {
  test.each`
    file                   | expected
    ${'part-1-case-1.txt'} | ${3}
    ${'part-1-case-2.txt'} | ${0}
    ${'part-1-case-3.txt'} | ${-6}
    ${'input.txt'}         | ${585}
  `('case $file is reduced to $expected', async ({ expected, file }) => {
    const input = await getInput(file)

    expect(chronalCalibrationSum(input.toString())).toEqual(expected)
  })
})

describe('#chronalCalibrationSum', () => {
  test.each`
    file                   | expected
    ${'part-2-case-1.txt'} | ${0}
    ${'part-2-case-2.txt'} | ${10}
    ${'part-2-case-3.txt'} | ${5}
    ${'part-2-case-4.txt'} | ${14}
    ${'input.txt'}         | ${83173}
  `('case $file is reduced to $expected', async ({ expected, file }) => {
    const input = await getInput(file)

    expect(chronalCalibrationRepeat(input)).toEqual(expected)
  })
})

describe('#cycle', () => {
  test('it cycles an array', () => {
    const generator = cycle([1, 2, 3])

    expect(take(5, generator)).toEqual([1, 2, 3, 1, 2])
  })
  test('it cycles an array', () => {
    const generator = cycle([1, 2, 3])

    expect(take(1, generator)).toEqual([1])
  })
})

describe('#BinaryTree', () => {
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
})

const readFileAsync = promisify(fs.readFile)

const getInput = (file: string) =>
  readFileAsync(path.join(__dirname, 'case', file)).then(buffer =>
    buffer.toString()
  )

const take = <T>(n: number, gen: IterableIterator<T>) => {
  const results = []

  for (const value of gen) {
    results.push(value)

    if (results.length >= n) break
  }

  return results
}
