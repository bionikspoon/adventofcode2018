import { update } from 'ramda'
import { compute, OpName } from '../day-16/compute'
import parseLines from '../utils/parseLines'

export function instructionsToLog(input: string) {
  const [ipRegister, instructions] = parseProgram(input)

  const logs: string[] = []
  runProgram(
    ipRegister,
    instructions,
    (ip, instruction, registryBefore, registryAfter) => {
      logs.push(
        [
          `ip=${ip}`,
          `[${registryBefore.join(', ')}]`,
          instruction.join(' '),
          `[${registryAfter.join(', ')}]`,
        ].join(' ')
      )
    }
  )

  return logs.join('\n')
}

export function runInstructions(input: string, registry: Registry) {
  const [ipRegister, instructions] = parseProgram(input)

  return runProgram(ipRegister, instructions, undefined, registry)
}

function parseProgram(input: string) {
  const [ipLine, ...instructionLines] = parseLines(input)
  const ipRegister = parseIp(ipLine)
  const instructions = parseInstructions(instructionLines)
  return [ipRegister, instructions] as [number, Instruction[]]
}

type LogFn = (
  ip: number,
  instruction: Instruction,
  registryBefore: Registry,
  registryAfter: Registry
) => void

function runProgram(
  ipRegister: number,
  instructions: Instruction[],
  logFn?: LogFn,
  initialRegistry: Registry = [0, 0, 0, 0, 0, 0]
) {
  let registry: Registry = initialRegistry
  let ip = registry[ipRegister]

  let i = 0
  while (ip < instructions.length) {
    const prevIp = ip
    const prevRegistry = registry
    const instruction = instructions[ip]
    ;[ip, registry] = run(ipRegister, ip, instruction, registry)

    if (logFn) logFn(prevIp, instruction, prevRegistry, registry)

    registry = update(ipRegister, ip, registry) as Registry

    if (i++ > 10000000) break
  }

  return registry
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
    ] as Instruction
  })
}

type Instruction = [OpName, number, number, number]
type Registry = [number, number, number, number, number, number]

export function run(
  ipRegister: number,
  ip: number,
  instruction: Instruction,
  registry: Registry
): [number, Registry] {
  const nextRegistry = compute(
    instruction,
    update(ipRegister, ip, registry)
  ) as Registry
  const nextIp = nextRegistry[ipRegister] + 1

  return [nextIp, nextRegistry]
}
