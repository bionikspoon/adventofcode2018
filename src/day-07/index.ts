import { append, prepend, reverse, sortBy, times, uniq } from 'ramda'
import util from 'util'
import parseLines from '../utils/parseLines'

export function findInstructionsOrder(input: string) {
  const instructions = toInstructions(0, input)

  const operationsLog: string[] = []

  const queue = new Queue<Step>()

  let unblockedSteps = instructions.getUnblockedSteps()
  while (unblockedSteps.length) {
    reverse(unblockedSteps).forEach(step => queue.add(step))

    queue.next(step => {
      if (!step.isReady()) return

      step.markCompleted()
      operationsLog.push(step.id)
    })

    queue.clear()
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
  const queue = new Queue<Step>()
  const pool = new Pool(workers)
  let unblockedSteps = instructions.getUnblockedSteps()
  while (unblockedSteps.length || pool.isWorking()) {
    reverse(unblockedSteps).forEach(step => queue.add(step))
    pool.forEach(worker => {
      queue.next(step => {
        if (!step || !step.isReady()) return
        worker.work(step.time, step, () => {
          step.markCompleted()
          if (onStepCompletion) onStepCompletion(step)
        })
        step.markInProgress()
      })
    })
    pool.tick()
    if (onTick) onTick()

    queue.clear()
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

class Pool<T> {
  private workers: Array<Worker<T>> = []
  constructor(size: number) {
    times(() => {
      this.workers.push(new Worker())
    }, size)
  }

  public isWorking() {
    return Boolean(
      this.workers.filter(worker => worker.status === 'WORKING').length
    )
  }

  public forEach(fn: (worker: Worker<T>) => void) {
    this.workers.filter(worker => worker.status === 'IDLE').forEach(fn)

    return this
  }

  public tick() {
    this.workers.forEach(worker => worker.tick())
    return this
  }
}

class Worker<T> {
  public status: 'IDLE' | 'WORKING'
  private time: number
  private callback: (() => void) | null = null
  private job: T | null

  constructor() {
    this.status = 'IDLE'
    this.time = 0
    this.callback = null
    this.job = null
  }

  public work(time: number, job: T, callback: () => void) {
    this.status = 'WORKING'
    this.time = time
    this.callback = callback
    this.job = job
  }

  public tick() {
    if (this.status === 'IDLE') return this

    this.time = this.time - 1

    if (this.time <= 0) {
      this.callback!()
      this.reset()
    }

    return this
  }

  private reset() {
    this.status = 'IDLE'
    this.time = 0
    this.callback = null
    this.job = null
  }
}

class Queue<T> {
  private items: T[] = []

  public add(item: T) {
    this.items = uniq(prepend(item, this.items))

    return this
  }

  public unshift() {
    const [x, ...xs] = this.items
    this.items = xs
    return x
  }

  public clear() {
    this.items = []
    return this
  }
  public next(fn: (next: T) => void) {
    const next = this.unshift()
    if (next) fn(next)

    return this
  }

  public forEach(fn: (next: T) => void) {
    while (this.items.length) {
      fn(this.unshift())
    }
    return this
  }
}

class Instructions {
  private steps: { [key: string]: Step } = {}

  public addStep(id: string, followedBy: string, extraTime: number) {
    if (!this.steps[id]) this.steps[id] = new Step(id, extraTime)
    const step = this.steps[id]

    if (!this.steps[followedBy]) {
      this.steps[followedBy] = new Step(followedBy, extraTime)
    }
    const followedByStep = this.steps[followedBy]

    step.addFollowedBy(followedByStep)
    followedByStep.addPrereq(step)

    return this
  }

  public getUnblockedSteps() {
    const steps = Object.values(this.steps).filter(step => step.isReady())

    return sortById(steps)
  }

  public [util.inspect.custom]() {
    const steps = Object.values(this.steps).map(step => step.inspect())
    return `Instructions { ${JSON.stringify(steps, null, 2)} }`
  }
}

class Step {
  private static LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  public id: string
  public time: number
  public followedBy: Step[] = []
  private prereqs: Step[] = []
  private completed = false
  private inProgress = false

  constructor(id: string, extraTime: number) {
    this.id = id
    this.time = Step.LETTERS.indexOf(id) + extraTime + 1
  }

  public addPrereq(step: Step) {
    this.prereqs = sortById(uniq(append(step, this.prereqs)))
    return this
  }

  public addFollowedBy(step: Step) {
    this.followedBy = sortById(uniq(append(step, this.followedBy)))
    return this
  }

  public isReady() {
    if (this.inProgress) return false
    if (this.completed) return false
    const prereqs = this.prereqs.filter(step => !step.completed)

    return prereqs.length === 0
  }

  public markInProgress() {
    this.inProgress = true
    return this
  }

  public markCompleted() {
    this.inProgress = false
    this.completed = true
    return this
  }

  public inspect() {
    const id = this.id
    const toString = (items: Step[]) =>
      items.map(step => (step.completed ? `(${step.id})` : step.id))
    const prereqs = toString(this.prereqs)
    const followedBy = toString(this.followedBy)

    return `Step { ${prereqs} -> [${id}] -> ${followedBy} }`
  }

  public [util.inspect.custom]() {
    return this.inspect()
  }
}

const sortById = sortBy(s => s.id)
