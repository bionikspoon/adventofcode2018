import { head, times } from 'ramda'
import parseLines from '../utils/parseLines'

const inspect = Symbol.for('nodejs.util.inspect.custom')

export function playRoundsRepr(input: string, rounds: number) {
  const lines = parseLines(input)

  const board = lines.reduce(
    (b, line, y) =>
      line
        .split('')
        .reduce((_b, value, x) => _b.initCell(x, y, value as CellValue), b),
    new Board(lines.length, head(lines)!.length)
  )
  return board.REPR()
}

type CellValue = '#' | '.' | 'G' | 'E'

class Board {
  private cells: Cell[][]

  constructor(height: number, width: number) {
    this.cells = times(y => times(x => new Cell(x, y), width), height)

    this.cells.forEach(
      row => void row.forEach(cell => void this.connectCell(cell))
    )
  }

  public initCell(x: number, y: number, value: CellValue) {
    const cell = this.getCell(x, y)

    if (isUndefined(cell)) throw new Error('Something went wrong.')

    switch (value) {
      case '#':
        cell.setValue(new Obstacle())
        break
      case 'E':
        cell.setValue(new Elf())
        break
      case 'G':
        cell.setValue(new Goblin())
        break
    }

    return this
  }

  public REPR() {
    return this.cells
      .map(row => row.map(cell => cell.REPR()).join(''))
      .join('\n')
  }

  private getCell(x: number, y: number): Maybe<Cell> {
    if (x < 0 || y < 0) return null
    const row = this.cells[y]
    if (!Array.isArray(row) || row.length <= x) return null
    const cell = row[x]

    return cell
  }

  private connectCell(cell: Cell) {
    const { x, y } = cell
    cell.setNeighbors(
      this.getCell(x, y - 1),
      this.getCell(x + 1, y),
      this.getCell(x, y + 1),
      this.getCell(x - 1, y)
    )
  }
}

type Maybe<T> = T | null

function isDefined<T>(x: Maybe<T>): x is T {
  return x !== null
}

function isUndefined<T>(x: Maybe<T>): x is null {
  return x === null
}

class Cell {
  public readonly x: number
  public readonly y: number
  private n: Maybe<Cell> = null
  private e: Maybe<Cell> = null
  private s: Maybe<Cell> = null
  private w: Maybe<Cell> = null
  private value: CellContent = new Empty()

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  public setValue(value: CellContent) {
    this.value = value
  }

  public REPR() {
    return this.value.REPR()
  }
  public setNeighbors(
    n: Maybe<Cell>,
    e: Maybe<Cell>,
    s: Maybe<Cell>,
    w: Maybe<Cell>
  ) {
    this.n = n
    this.e = e
    this.s = s
    this.w = w
  }

  public [inspect]() {
    return `Cell { x: ${this.x} y: ${this.y} v: '${this.value.symbol}' }`
  }
}

abstract class CellContent {
  public abstract readonly symbol: CellValue

  public REPR() {
    return this.symbol
  }
}

class Empty extends CellContent {
  public readonly symbol: CellValue = '.'
}
class Obstacle extends CellContent {
  public readonly symbol: CellValue = '#'
}

abstract class Player extends CellContent {}
class Goblin extends Player {
  public readonly symbol: CellValue = 'G'
}
class Elf extends Player {
  public readonly symbol: CellValue = 'E'
}
