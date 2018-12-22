import { LinkedList } from '../utils/LinkedList'
import parseLines from '../utils/parseLines'

function simulateGenerations(input: string, generations: number) {
  const lines = parseLines(input).filter(line => line.length)

  return toData(lines)
}

export function simulateGenerationsRepr(input: string, generations: number) {
  return simulateGenerations(input, generations)
}

const RE_INITIAL_STATE = /^initial state: (?<state>[#\.]+)$/gmu
const RE_NOTE = /^(?<pattern>[#\.]+)\s=>\s(?<outcome>[#\.])$/gmu

const toData = ([x, ...xs]: string[]) => {
  return {
    state: LinkedList.from<string>(
      new RegExp(RE_INITIAL_STATE).exec(x)!.groups!.state.split('')
    ),
    notes: xs.map(note => {
      const { groups } = new RegExp(RE_NOTE).exec(note)!
      return [groups!.pattern, groups!.outcome]
    }),
  }
}
