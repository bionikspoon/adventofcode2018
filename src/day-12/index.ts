import { equals, head } from 'ramda'
import { LinkedList } from '../utils/LinkedList'
import parseLines from '../utils/parseLines'

function simulateGenerations(input: string, generations: number) {
  const lines = parseLines(input).filter(line => line.length)

  const data = toData(lines)
  let { state } = data
  let offset = 0

  for (let i = 0; i < generations; i++) {
    state = pad(state.mapWindow(simulateGeneration, 2, 2, '.'))
  }

  return { state, offset }

  function simulateGeneration(window: string[], value: string): string {
    for (const [note, match] of data.notes) {
      if (equals(note, window)) return match
    }
    return value
  }

  function padLeft(list: LinkedList<string>) {
    if (list.firstNode === null) return list
    for (let i = 0; i < 2; i++) {
      if (
        list.firstNode.value !== '.' ||
        head(list.firstNode.nextValues(1)) !== '.'
      ) {
        offset--
        list.unshift('.')
      }
    }

    return list
  }

  function padRight(list: LinkedList<string>) {
    if (list.lastNode === null) return list

    for (let i = 0; i < 2; i++) {
      if (
        list.lastNode.value !== '.' ||
        head(list.lastNode.prevValues(1)) !== '.'
      ) {
        list.push('.')
      }
    }

    return list
  }

  function pad(list: LinkedList<string>) {
    return padRight(padLeft(list))
  }
}

export function simulateGenerationsRepr(input: string, generations: number) {
  const { state } = simulateGenerations(input, generations)
  return state.toArray().join('')
}

export function simulateGenerationsSum(input: string, generations: number) {
  const { state, offset } = simulateGenerations(input, generations)

  return state
    .toArray()
    .reduce(
      (acc, current, index) => (current === '#' ? acc + index + offset : acc),
      0
    )
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
      const pattern = groups!.pattern.split('')
      return [pattern, groups!.outcome] as [
        [string, string, string, string, string],
        string
      ]
    }),
  }
}
