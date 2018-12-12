import { map, times } from 'ramda'
import util from 'util'
const inspect = util.inspect.custom
export function findWinningScore(input: string) {
  const { playersCount, marblesCount } = parseLine(input)
  return new Game(playersCount, marblesCount).run().scoreboard.winningScore()
}

const RE_PARSE_LINE = /^(?<playersCount>\d+) players; last marble is worth (?<marblesCount>\d+) points$/gmu
const parseLine = (input: string) => {
  return map<{ [key: string]: string }, { [key: string]: number }>(
    key => parseInt(key),
    new RegExp(RE_PARSE_LINE).exec(input.trim())!.groups!
  )
}
class Game {
  public scoreboard: Scoreboard
  private playersCount: number
  private marblesCount: number
  private currentMarble: Marble
  private nextMarbleValue: number = 1

  constructor(playersCount: number, marblesCount: number) {
    this.playersCount = playersCount
    this.marblesCount = marblesCount
    this.currentMarble = new Marble(0)

    this.scoreboard = new Scoreboard()
  }

  public run() {
    while (this.nextMarbleValue <= this.marblesCount) {
      const player = ((this.nextMarbleValue - 1) % this.playersCount) + 1
      if (this.nextMarbleValue % 23 === 0) {
        this.scoreboard.add(player, this.nextMarbleValue)
        const [removed, currentMarble] = this.currentMarble
          .goCounterClockwise(7)
          .remove()
        this.currentMarble = currentMarble
        this.scoreboard.add(player, removed.value)
      } else {
        this.currentMarble = this.currentMarble
          .goClockwise()
          .insertNext(this.nextMarbleValue)
      }

      this.nextMarbleValue++
    }

    return this
  }
}

class Scoreboard {
  private players: { [key: number]: number[] } = {}

  public add(player: number, value: number) {
    if (!this.players[player]) this.players[player] = []

    this.players[player].push(value)
  }

  public winningScore() {
    return Object.values(this.players)
      .map(scores => scores.reduce((l, r) => l + r))
      .reduce((l, r) => Math.max(l, r))
  }

  public [inspect]() {
    return `Scoreboard { ${util.inspect(this.players)} }`
  }
}

class Marble {
  private clockwise: Marble
  private counterClockwise: Marble
  public value: number

  constructor(value: number) {
    this.value = value
    this.clockwise = this
    this.counterClockwise = this
  }

  public goClockwise(n: number = 1) {
    // tslint:disable-next-line:no-this-assignment
    let result: Marble = this
    times(() => {
      result = result.clockwise
    }, n)

    return result
  }

  public goCounterClockwise(n: number = 1) {
    // tslint:disable-next-line:no-this-assignment
    let result: Marble = this
    times(() => {
      result = result.counterClockwise
    }, n)

    return result
  }

  public remove() {
    this.clockwise.counterClockwise = this.counterClockwise
    this.counterClockwise.clockwise = this.clockwise
    return [this, this.clockwise]
  }

  public insertNext(value: number) {
    const nextClockwise = this.clockwise

    this.clockwise = new Marble(value)
    this.clockwise.clockwise = nextClockwise
    nextClockwise.counterClockwise = this.clockwise
    this.clockwise.counterClockwise = this

    return this.clockwise
  }

  public [inspect](depth: number) {
    const l2M = this.counterClockwise.counterClockwise
    const l2S = l2M === this ? `(${l2M.value})` : l2M.value
    const l1M = this.counterClockwise
    const l1S = l1M === this ? `(${l1M.value})` : l1M.value
    const cS = `(${this.value})`
    const r1M = this.clockwise
    const r1S = r1M === this ? `(${r1M.value})` : r1M.value
    const r2M = this.clockwise.clockwise
    const r2S = r2M === this ? `(${r2M.value})` : r2M.value
    return depth > 1
      ? `Marble { ${l2S} <- ${l1S} <- ${cS} -> ${r1S} -> ${r2S} }`
      : `Marble { ${l1S} <- ${cS} -> ${r1S} }`
  }
}
