import { keys, map } from 'ramda'
import { OpName, ops } from './compute'
import Sample from './Sample'

export function findOpcodesWithNBehaviors(input: string, n: 3) {
  const [sample] = input.split('\n\n\n\n')
  const samples = sample.split('\n\n').map(Sample.from)
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
