import parseLines from '../utils/parseLines'
import { OpName } from '../day-16/compute'

export function instructionsToLog(input: string) {
  const [ipLine, ...instructionLines] = parseLines(input)
  const ip = parseIp(ipLine)
  const instructions = parseInstructions(instructionLines)

  return { ip, instructions }
}

function parseIp(line: string) {
  return parseInt(new RegExp(/^#ip\s(?<ip>\d+)$/gmu).exec(line)!.groups!.ip)
}

function parseInstructions(lines: string[]) {
  const RE_MATCH_INSTRUCTION = /^(?<opName>\w{4})\s(?<a>\d+)\s(?<b>\d+)\s(?<c>\d+)$/gmu

  return lines.map(line => {
    const groups = new RegExp(RE_MATCH_INSTRUCTION).exec(line)!.groups!

    return [
      groups.opName,
      parseInt(groups.a),
      parseInt(groups.b),
      parseInt(groups.c),
    ]
  })
}

type Instruction = [OpName, number, number, number]
type Registry = [number, number, number, number, number, number]

export function compute(
  ip: number,
  instruction: Instruction,
  registry: Registry
): [number, Registry] {
  return [ip, registry]
}
