import parseLines from '../utils/parseLines'
import Board from './Board'
import GameOverError from './GameOverError'
import { Token } from './shared'
export function playRoundsRepr(input: string, rounds: number) {
  const tokenGrid = parseLines(input).map(line => line.split('') as Token[])

  const board = Board.from(tokenGrid)

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

export function simulateBattle(input: string) {
  const tokenGrid = parseLines(input).map(line => line.split('') as Token[])

  const board = Board.from(tokenGrid)

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
