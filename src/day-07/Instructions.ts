import { append, sortBy, uniq } from 'ramda'
import util from 'util'

export default class Instructions {
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

export class Step {
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
