import { chronalCalibrationSum, chronalCalibrationRepeat, cycle } from '..'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

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
