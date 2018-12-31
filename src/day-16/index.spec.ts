import {
  decodeOpNamesFromInput,
  findOpcodesWithNBehaviors,
  runProgram,
} from '.'
import { getInput } from '../utils/tests'

test('it finds number of samples behaving like 3+ ops', async () => {
  const input = await getInput(__dirname, 'input.txt')
  expect(findOpcodesWithNBehaviors(input.split('\n\n\n\n')[0], 3)).toEqual(567)
})

test('it can map op codes to opNames', async () => {
  const input = await getInput(__dirname, 'input.txt')
  expect(decodeOpNamesFromInput(input.split('\n\n\n\n')[0])).toEqual({
    '0': 'gtir',
    '1': 'setr',
    '2': 'bori',
    '3': 'gtrr',
    '4': 'gtri',
    '5': 'eqir',
    '6': 'seti',
    '7': 'eqri',
    '8': 'eqrr',
    '9': 'borr',
    '10': 'addr',
    '11': 'mulr',
    '12': 'bani',
    '13': 'muli',
    '14': 'banr',
    '15': 'addi',
  })
})

test('it can parse the program', async () => {
  const input = await getInput(__dirname, 'input.txt')
  expect(runProgram(input)).toEqual([610, 2, 610, 3])
})
