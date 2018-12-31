import { all, groupBy, keys, map } from 'ramda'
import parseLines from '../utils/parseLines'
import { OpName, ops, compute } from './compute'
import Sample from './Sample'

export function findOpcodesWithNBehaviors(input: string, n: 3) {
  const samples = input.split('\n\n').map(Sample.from)
  const behaviorsPerSample = findBehaviors(samples)
  const samplesWithNBehaviors = behaviorsPerSample.filter(
    behaviors => behaviors.length >= n
  )
  return samplesWithNBehaviors.length
}

const findBehaviors: (samples: Sample[]) => OpName[][] = map(sample =>
  opNames.filter(opName => sample.testOp(opName))
)

const opNames: OpName[] = keys(ops)

export function decodeOpNamesFromInput(input: string) {
  const samples = input.split('\n\n').map(Sample.from)
  const groupedSamples = groupByOpCode(samples)

  const opNamesByCode = withPossibleOpNames(groupedSamples)

  return decodeOpNames(opNamesByCode)
}

export function runProgram(input: string) {
  const [sampleText, programText] = input.split('\n\n\n\n')
  const opCodeNameMap = decodeOpNamesFromInput(sampleText)
  const programLines = parseLines(programText).map(
    line =>
      line
        .trim()
        .split(' ')
        .map(digit => parseInt(digit)) as [number, number, number, number]
  )

  return programLines.reduce(
    (
      registry: [number, number, number, number],
      [opCode, a, b, c]: [number, number, number, number]
    ): [number, number, number, number] => {
      const opName = opCodeNameMap[opCode]

      return compute([opName, a, b, c], registry)
    },
    [0, 0, 0, 0] as [number, number, number, number]
  )
}

function decodeOpNames(initialOpsPerCode: { [key: string]: OpName[] }) {
  let opsPerCode = { ...initialOpsPerCode }
  let unknownOpsNames = [...opNames]
  const decodedOpNames: { [key: string]: OpName } = {}

  while (unknownOpsNames.length) {
    Object.keys(opsPerCode).forEach(key => {
      const possibleOps = opsPerCode[key]
      if (possibleOps.length !== 1) return
      decodedOpNames[key] = possibleOps[0]
      const filterOp = (opName: OpName) => opName !== possibleOps[0]

      opsPerCode = map(names => names.filter(filterOp), opsPerCode)
      unknownOpsNames = unknownOpsNames.filter(filterOp)
    })
  }

  return decodedOpNames
}

const groupByOpCode: (
  samples: Sample[]
) => { [key: string]: Sample[] } = groupBy(sample => sample.opCode.toString())

const withPossibleOpNames: (
  groups: { [key: string]: Sample[] }
) => { [key: string]: OpName[] } = map<
  { [key: string]: Sample[] },
  { [key: string]: OpName[] }
>((samples: Sample[]) =>
  opNames.filter(opName => all(sample => sample.testOp(opName), samples))
)
