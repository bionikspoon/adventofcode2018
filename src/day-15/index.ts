import parseLines from '../utils/parseLines'
import Board from './Board'
import { Token } from './shared'
export function playRoundsRepr(input: string, rounds: number) {
  const tokenGrid = parseLines(input).map(line => line.split('') as Token[])

  const board = Board.from(tokenGrid)

  for (let round = 0; round < rounds; round++) {
    board.playRound()
  }

  return board.print()
}
