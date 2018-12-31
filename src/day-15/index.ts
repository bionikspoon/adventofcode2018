import parseLines from '../utils/parseLines'
import Board, { IBoardOptions } from './Board'
import { GameOverError, ElfDiedError } from './Errors'
import { ElfPlayer, Player } from './Piece'
import { Token } from './shared'

export function playRoundsRepr(
  input: string,
  rounds: number,
  elfAttackPower?: number
) {
  const board = inputToBoard(input, { elfAttackPower })

  for (let round = 0; round < rounds; round++) {
    try {
      board.playRound()
    } catch (error) {
      if (error instanceof GameOverError) continue

      throw error
    }
  }

  return board.print()
}

export function simulateBattle(input: string, boardOptions?: IBoardOptions) {
  const board = inputToBoard(input, boardOptions)

  let rounds = 0
  while (true) {
    try {
      board.playRound()
    } catch (error) {
      if (error instanceof GameOverError) break

      throw error
    }
    rounds++
  }

  const hitPoints = board
    .getAllPlayers()
    .reduce((acc, player) => player.hitPoints + acc, 0)

  return { rounds, hitPoints, result: hitPoints * rounds }
}

export function findMinimumAttackPowerRequired(input: string) {
  let elfAttackPower = 3
  const onKill = (player: Player) => {
    if (player instanceof ElfPlayer) {
      throw new ElfDiedError()
    }
  }

  while (elfAttackPower < 200) {
    try {
      return {
        elfAttackPower,
        ...simulateBattle(input, { onKill, elfAttackPower }),
      }
    } catch (error) {
      elfAttackPower++
    }
  }

  throw new Error('Something went wrong.')
}

function inputToBoard(input: string, options?: IBoardOptions) {
  const tokenGrid = parseLines(input).map(line => line.split('') as Token[])

  return Board.from(tokenGrid, options)
}
