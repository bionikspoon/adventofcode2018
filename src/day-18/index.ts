import parseLines from '../utils/parseLines'
import Grid from './Grid'
import { Token } from './shared'

export function toGrid(input: string) {
  const tokens = parseLines(input).map(line => line.split('') as Token[])

  return Grid.from(tokens)
}
