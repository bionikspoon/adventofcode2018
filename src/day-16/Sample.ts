import { equals } from 'ramda'
import { compute, OpName } from './compute'

const RE_MATCH_SAMPLE = /^Before:\s(?<before>\[.+\])\n(?<opCode>\d+)\s(?<a>\d+)\s(?<b>\d+)\s(?<c>\d+)\nAfter:\s\s(?<after>\[.+\])$/gmu

export default class Sample {
  public static from(sampleString: string) {
    const groups = new RegExp(RE_MATCH_SAMPLE).exec(sampleString)!.groups!

    const sample = new Sample(
      JSON.parse(groups.before),
      JSON.parse(groups.after),
      [
        parseInt(groups.opCode),
        parseInt(groups.a),
        parseInt(groups.b),
        parseInt(groups.c),
      ]
    )

    return sample
  }

  public readonly before: [number, number, number, number]
  public readonly after: [number, number, number, number]
  public readonly opCode: number
  public readonly a: number
  public readonly b: number
  public readonly c: number
  constructor(
    before: [number, number, number, number],
    after: [number, number, number, number],
    [opCode, a, b, c]: [number, number, number, number]
  ) {
    this.before = before
    this.after = after
    this.opCode = opCode
    this.a = a
    this.b = b
    this.c = c
  }

  public testOp(opName: OpName) {
    return equals(
      compute([opName, this.a, this.b, this.c], this.before),
      this.after
    )
  }
}
