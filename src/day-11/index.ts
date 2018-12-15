import { add, range } from 'ramda'
import product from '../utils/product'

export function findMostPowerfulGrid(serialNumber: number) {
  const { x, y } = findAllCellPowers(serialNumber).reduce((l, r) =>
    l.power > r.power ? l : r
  )
  return `${x},${y}`
}

export function findAllCellPowers(serialNumber: number) {
  const TOTAL_GRID_SIZE = 300
  const TARGET_GRID_SIZE = 3

  return product(range(1, TOTAL_GRID_SIZE - TARGET_GRID_SIZE + 2)).map(
    ([x, y]) => ({ x, y, power: calculateGridPowerLevel(x, y, serialNumber) })
  )
}

export function calculateCellPowerLevel(
  x: number,
  y: number,
  serialNumber: number
): number {
  const rackId = x + 10
  const powerLevel = findDigit(3, (rackId * y + serialNumber) * rackId)

  return powerLevel - 5
}

export function calculateGridPowerLevel(
  x: number,
  y: number,
  serialNumber: number
): number {
  return CELLS.map(([offsetX, offsetY]) =>
    calculateCellPowerLevel(x + offsetX, y + offsetY, serialNumber)
  ).reduce(add)
}

const CELLS: Array<[number, number]> = product(range(0, 3))

function findDigit(digit: number, n: number): number {
  return Math.floor((n / 10 ** (digit - 1)) % 10)
}
