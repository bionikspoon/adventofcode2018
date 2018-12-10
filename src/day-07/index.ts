import { append, sortBy, uniq, prepend, reverse } from 'ramda'
import util from 'util'
import parseLines from '../utils/parseLines'

export function findInstructionsOrder(input: string) {
  const instructions = parseLines(input)
    .map(parseStep)
    .reduce(
      (i, step) => i.addStep(step.id, step.followedBy),
      new Instructions()
    )

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

const RE_PARSE_STEP = /^Step (?<id>[A-Z]) must be finished before step (?<followedBy>[A-Z]) can begin\.$/gmu

const parseStep = (line: string) => {
  const reParseStep = new RegExp(RE_PARSE_STEP)

  const match = reParseStep.exec(line)
  if (!match || !match.groups) throw new Error(`Unknown line format: ${line}`)
  return { id: match.groups.id, followedBy: match.groups.followedBy }
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
    fn(this.unshift())
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

  public addStep(id: string, followedBy: string) {
    if (!this.steps[id]) this.steps[id] = new Step(id)
    const step = this.steps[id]

    if (!this.steps[followedBy]) this.steps[followedBy] = new Step(followedBy)
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
  public id: string
  public followedBy: Step[] = []
  private prereqs: Step[] = []
  private completed = false

  constructor(id: string) {
    this.id = id
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
    if (this.completed) return false
    const prereqs = this.prereqs.filter(step => !step.completed)

    return prereqs.length === 0
  }

  public markCompleted() {
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
