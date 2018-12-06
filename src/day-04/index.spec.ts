import moment from 'moment'
import util from 'util'
import {
  EntryType,
  findSleepingGuard,
  sortParsedRecords,
  toDate,
  toGuardRecords,
  toParsedEntry,
} from '.'
import parseLines from '../utils/parseLines'
import { getInput } from '../utils/tests'

moment.prototype[util.inspect.custom] = function inspect() {
  return this.inspect()
}

describe('part 1 - #findSleepingGuard', () => {
  test.each`
    file                   | expected
    ${'part-1-case-1.txt'} | ${240}
    ${'input.txt'}         | ${106710}
  `('it finds the overlapping claims in $file', async ({ file, expected }) => {
    const input = await getInput(__dirname, file)

    expect(findSleepingGuard(input)).toEqual(expected)
  })
})

describe('#toParsedEntry', () => {
  test.each`
    line                                           | id           | date                          | note
    ${'[1518-11-01 00:00] Guard #10 begins shift'} | ${10}        | ${toDate('1518-11-01 00:00')} | ${'begins shift'}
    ${'[1518-11-01 00:05] falls asleep'}           | ${undefined} | ${toDate('1518-11-01 00:05')} | ${'falls asleep'}
    ${'[1518-11-01 00:25] wakes up'}               | ${undefined} | ${toDate('1518-11-01 00:25')} | ${'wakes up'}
  `('it parses string into an object', ({ line, id, date, note }) => {
    expect(toParsedEntry(line)).toEqual({
      id,
      note,
      date,
    })
  })
})

describe('#toGuardRecord', () => {
  let parsedEntries: EntryType[]

  describe('given part-1-case-1.txt', () => {
    beforeEach(async () => {
      const input = await getInput(__dirname, 'part-1-case-1.txt')
      parsedEntries = sortParsedRecords(parseLines(input))
    })

    test('it matches snapshot', () => {
      expect(parsedEntries).toMatchSnapshot()
    })

    test('it converts entries to records', () => {
      const subject = toGuardRecords(parsedEntries).map((entry: any) =>
        entry.toString()
      )

      const expected = [
        '11-01  #0010  .....####################.....#########################.....',
        '11-02  #0099  ........................................##########..........',
        '11-03  #0010  ........................#####...............................',
        '11-04  #0099  ....................................##########..............',
        '11-05  #0099  .............................................##########.....',
      ]

      expect(subject).toEqual(expected)
    })
  })
  describe('given input.txt', () => {
    beforeEach(async () => {
      const input = await getInput(__dirname, 'input.txt')

      parsedEntries = sortParsedRecords(parseLines(input))
    })

    test('it matches snapshot', () => {
      expect(parsedEntries).toMatchSnapshot()
    })
  })
})
