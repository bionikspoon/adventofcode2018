import { findOpcodesWithNBehaviors } from '.'
import { getInput } from '../utils/tests'

test('it finds number of samples behaving like 3+ ops', async () => {
  const input = await getInput(__dirname, 'input.txt')
  expect(findOpcodesWithNBehaviors(input, 3)).toEqual(567)
})
