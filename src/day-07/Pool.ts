import { times } from 'ramda'

export default class Pool<T> {
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
  public status: 'IDLE' | 'WORKING' = 'IDLE'
  private time: number = 0
  private callback: (() => void) | null = null

  public work(time: number, job: T, callback: () => void) {
    this.status = 'WORKING'
    this.time = time
    this.callback = callback
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
  }
}
