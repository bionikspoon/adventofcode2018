import parseLines from '../utils/parseLines'
import Instructions, { Step } from './Instructions'
import Pool from './Pool'

export function findInstructionsOrder(input: string) {
  const instructions = toInstructions(0, input)

  const operationsLog: string[] = []

  let unblockedSteps = instructions.getUnblockedSteps()
  while (unblockedSteps.length) {
    const steps = unblockedSteps.values()
    const { value: step, done } = steps.next()
    if (done || !step || !step.isReady()) return

    step.markCompleted()
    operationsLog.push(step.id)

    unblockedSteps = instructions.getUnblockedSteps()
  }

  return operationsLog.join('')
}

const toInstructions = (extraTime: number, input: string) =>
  parseLines(input)
    .map(parseStep)
    .reduce(
      (i, step) => i.addStep(step.id, step.followedBy, extraTime),
      new Instructions()
    )

export function findTimedInstructionsOrder(
  input: string,
  workers: number,
  extraTime: number
) {
  const instructions = toInstructions(extraTime, input)

  const operationsLog: string[] = []

  iterateInstructions(workers, instructions, {
    onStepCompletion: step => void operationsLog.push(step.id),
  })

  return operationsLog.join('')
}

export function findTimeToCompletion(
  input: string,
  workers: number,
  extraTime: number
) {
  const instructions = toInstructions(extraTime, input)

  let i = 0

  iterateInstructions(workers, instructions, {
    onTick: () => void i++,
  })

  return i
}

function iterateInstructions(
  workers: number,
  instructions: Instructions,
  {
    onTick,
    onStepCompletion,
  }: {
    onTick?: () => void
    onStepCompletion?: (step: Step) => void
  }
) {
  const pool = new Pool(workers)
  let unblockedSteps = instructions.getUnblockedSteps()
  while (unblockedSteps.length || pool.isWorking()) {
    const steps = unblockedSteps.values()
    pool.forEach(worker => {
      const { value: step, done } = steps.next()
      if (done || !step || !step.isReady()) return

      worker.work(step.time, step, () => {
        step.markCompleted()
        if (onStepCompletion) onStepCompletion(step)
      })
      step.markInProgress()
    })

    pool.tick()
    if (onTick) onTick()

    unblockedSteps = instructions.getUnblockedSteps()
  }
}

const RE_PARSE_STEP = /^Step (?<id>[A-Z]) must be finished before step (?<followedBy>[A-Z]) can begin\.$/gmu

const parseStep = (line: string) => {
  const reParseStep = new RegExp(RE_PARSE_STEP)

  const match = reParseStep.exec(line)
  if (!match || !match.groups) throw new Error(`Unknown line format: ${line}`)
  return { id: match.groups.id, followedBy: match.groups.followedBy }
}
