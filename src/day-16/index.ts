const inspect = Symbol.for('nodejs.util.inspect.custom')
export function doStuff(input: string) {
  const [sample] = input.split('\n\n\n\n')
  return sample.split('\n\n').map(Sample.from)[0]
}

const RE_MATCH_SAMPLE = /^Before:\s(?<before>\[.+\])\n(?<op>\d+)\s(?<a>\d+)\s(?<b>\d+)\s(?<c>\d+)\nAfter:\s\s(?<after>\[.+\])$/gmu

class Sample {
  public static from(sampleString: string) {
    const groups = new RegExp(RE_MATCH_SAMPLE).exec(sampleString)!.groups!

    const sample = new Sample(
      JSON.parse(groups.before),
      JSON.parse(groups.after),
      [
        parseInt(groups.op),
        parseInt(groups.a),
        parseInt(groups.b),
        parseInt(groups.c),
      ]
    )

    return sample
  }

  private readonly before: [number, number, number, number]
  private readonly after: [number, number, number, number]
  private readonly op: number
  private readonly a: number
  private readonly b: number
  private readonly c: number
  constructor(
    before: [number, number, number, number],
    after: [number, number, number, number],
    [op, a, b, c]: [number, number, number, number]
  ) {
    this.before = before
    this.after = after
    this.op = op
    this.a = a
    this.b = b
    this.c = c
  }

  public [inspect]() {
    return `Sample { }`
  }
}
