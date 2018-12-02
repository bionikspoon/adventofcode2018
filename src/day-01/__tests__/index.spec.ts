import { chronalCalibrationRepeat, chronalCalibrationSum } from '..'
import { getInput } from '../../utils/tests'

describe('part 1  - #chronalCalibrationSum', () => {
  test.each`
    file                   | expected
    ${'part-1-case-1.txt'} | ${3}
    ${'part-1-case-2.txt'} | ${0}
    ${'part-1-case-3.txt'} | ${-6}
    ${'input.txt'}         | ${585}
  `('case $file is reduced to $expected', async ({ expected, file }) => {
    const input = await getInput(__dirname, file)

    expect(chronalCalibrationSum(input.toString())).toEqual(expected)
  })
})

describe('part 2 - #chronalCalibrationSum', () => {
  test.each`
    file                   | expected
    ${'part-2-case-1.txt'} | ${0}
    ${'part-2-case-2.txt'} | ${10}
    ${'part-2-case-3.txt'} | ${5}
    ${'part-2-case-4.txt'} | ${14}
    ${'input.txt'}         | ${83173}
  `('case $file is reduced to $expected', async ({ expected, file }) => {
    const input = await getInput(__dirname, file)

    expect(chronalCalibrationRepeat(input)).toEqual(expected)
  })
})
