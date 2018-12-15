import { add, memoizeWith, range, reduce, unapply } from 'ramda'
import product from '../utils/product'

// PART 1
export const findMostPowerful3by3grid = (serialNumber: number) => {
  const { x, y } = findBestCellFactory(serialNumber)(3)
  return `${x},${y}`
}

// PART 2
export const findMostPowerfulGrid = (serialNumber: number) => {
  const findBestCell = findBestCellFactory(serialNumber)

  const { x, y, size } = transformReduce(findBestCell, maxPower, range(1, 301))

  return `${x},${y},${size}`
}

// SHARED

const TOTAL_GRID_SIZE = 300

export const findBestCellFactory = (serialNumber: number) => {
  const grid = new Grid(serialNumber)

  return (size: number) => grid.getBestCell(size)
}

class Grid {
  private data: { [key: string]: { x: number; y: number; power: number } } = {}
  private serialNumber: number
  constructor(serialNumber: number) {
    this.serialNumber = serialNumber

    getCells(1, TOTAL_GRID_SIZE + 1).forEach(([x, y]) => void this.set(x, y))
  }

  public getBestCell(size: number) {
    const cells = getCells(1, TOTAL_GRID_SIZE - size + 2)
    const getGridPower = this.getGridPowerFactory(size)

    const transformFn = ([x, y]: [number, number]) => ({
      x,
      y,
      size,
      power: getGridPower(x, y),
    })

    return transformReduce(transformFn, maxPower, cells)
  }

  private getGridPowerFactory(size: number) {
    const cells = getCells(0, size)

    return (x: number, y: number) => {
      const transformFn = ([offsetX, offsetY]: [number, number]): number =>
        this.get(x + offsetX, y + offsetY).power

      return transformReduce<[number, number], number>(transformFn, add, cells)
    }
  }

  private get(x: number, y: number) {
    const key = `${x},${y}`

    return this.data[key]
  }

  private set(x: number, y: number) {
    const key = `${x},${y}`

    this.data[key] = {
      x,
      y,
      power: calculateCellPowerLevel(x, y, this.serialNumber),
    }

    return this
  }
}

export const calculateCellPowerLevel = (
  x: number,
  y: number,
  serialNumber: number
): number => {
  const rackId = x + 10
  const powerLevel = findDigit(3, (rackId * y + serialNumber) * rackId)

  return powerLevel - 5
}

const getCells = memoizeWith(
  unapply(JSON.stringify),
  (start: number, size: number): Array<[number, number]> =>
    product(range(start, size))
)

const findDigit = (digit: number, n: number): number =>
  Math.floor((n / 10 ** (digit - 1)) % 10)

const transformReduce: <T, U>(
  transformFn: (x: T) => U,
  reduceFn: (l: U, r: U) => U,
  items: T[]
) => U = (transformFn, reduceFn, [x, ...xs]) =>
  reduce((acc, next) => reduceFn(acc, transformFn(next)), transformFn(x), xs)

const maxPower: <T extends { power: number }>(
  previousValue: T,
  currentValue: T,
  currentIndex?: number,
  array?: T[]
) => T = (l, r) => (l.power > r.power ? l : r)
