import moment from 'moment'
import { groupBy, range, splitEvery } from 'ramda'
import util from 'util'
import Counter from '../utils/Counter'
import parseLines from '../utils/parseLines'

// PART 1
export function findSleepingGuard(input: string) {
  const parsedLines = parseLines(input)
  const recordsSortedByDate = sortParsedRecords(parsedLines)
  const guardRecords = toGuardRecords(recordsSortedByDate)
  const sleepiestGuardId = getSleepiestGuardId(guardRecords)
  const sleepiestGuardRecords = filterById(sleepiestGuardId, guardRecords)

  const sleepiestMinute = getSleepiestMinute(sleepiestGuardRecords)

  return sleepiestMinute * sleepiestGuardId
}

// PART 2

export function findSleepiestGuardMinute(input: string) {
  const parsedLines = parseLines(input)
  const recordsSortedByDate = sortParsedRecords(parsedLines)
  const guardRecords = toGuardRecords(recordsSortedByDate)
  const { id, minute } = getSleepiestMinutePerGuard(guardRecords)[0]

  return id * minute
}

// TYPES
interface IBaseEntry {
  id?: number
  note: string
  date: moment.Moment
}

interface INewShiftEntry extends IBaseEntry {
  id: number
  note: 'begins shift'
  date: moment.Moment
}

interface IWakesUpEntry extends IBaseEntry {
  note: 'wakes up'
  date: moment.Moment
}
interface IFallsAsleepEntry extends IBaseEntry {
  note: 'falls asleep'
  date: moment.Moment
}

export type EntryType = INewShiftEntry | IWakesUpEntry | IFallsAsleepEntry

function isNewShiftEntry(entry: EntryType): entry is INewShiftEntry {
  return entry.id !== undefined && entry.note === 'begins shift'
}
function isWakesUpEntry(entry: EntryType): entry is IWakesUpEntry {
  return entry.note === 'wakes up'
}
function isFallsAsleepEntry(entry: EntryType): entry is IFallsAsleepEntry {
  return entry.note === 'falls asleep'
}

// CONSTANTS

const RE_PARSE_LINE = /\[(?<date>.*)\]\s(?:Guard\s#(?<id>\d+)\s)?(?<note>.*)/gmu

// UTILS

export function toDate(date: string) {
  return moment(date, 'YYYY-MM-DD HH:mm', true).startOf('minute')
}

function roundToHour(date: moment.Moment) {
  const minutes = date.minutes()
  if (minutes === 0) return date
  if (minutes < 30) return date.startOf('hour')
  if (minutes >= 30) return date.add(30, 'minutes').startOf('hour')

  throw new Error(`Unkown date ${date}`)
}

// STEPS

export const sortParsedRecords = (lines: string[]) =>
  lines.map(toParsedEntry).sort((left, right) => left.date.diff(right.date))

export function toParsedEntry(from: string): EntryType {
  const groups = new RegExp(RE_PARSE_LINE).exec(from)!.groups

  if (groups === undefined) {
    throw new Error(`Unrecognize journal entry: ${from}`)
  }
  const date = toDate(groups.date)

  switch (groups.note) {
    case 'begins shift':
      return {
        id: parseInt(groups.id),
        note: groups.note,
        date,
      }
    case 'wakes up':
      return {
        note: groups.note,
        date,
      }
    case 'falls asleep':
      return {
        note: groups.note,
        date,
      }

    default:
      throw new Error(`Unrecognize journal entry: ${from}`)
  }
}

export function toGuardRecords(entries: EntryType[]) {
  const results = []
  let guardRecords: EntryType[] = []

  for (const entry of entries) {
    if (isNewShiftEntry(entry) && guardRecords.length) {
      results.push(new GuardRecord(guardRecords))
      guardRecords = []
    }

    guardRecords.push(entry)
  }
  results.push(new GuardRecord(guardRecords))

  return results
}

function getSleepiestGuardId(guardRecords: GuardRecord[]) {
  const groupedRecords = groupBy(record => record.id.toString(), guardRecords)
  const guardSleepiness = Object.values(groupedRecords).map(records =>
    records.reduce(
      (acc, record) => {
        return {
          id: record.id,
          minutesSleeping: acc.minutesSleeping + record.sleepTime,
        }
      },
      { id: 0, minutesSleeping: 0 }
    )
  )

  const sortedSleepiness = guardSleepiness.sort(
    (l, r) => r.minutesSleeping - l.minutesSleeping
  )

  return sortedSleepiness[0].id
}

function getSleepiestMinutePerGuard(guardRecords: GuardRecord[]) {
  const filteredRecords = guardRecords
  const groupedRecords = Object.values(
    groupBy(record => record.id.toString(), filteredRecords)
  )

  const sortedResults = groupedRecords
    .map(findSleepiestMinute)
    .sort((l, r) => r.count - l.count)

  if (sortedResults.length < 1) throw new Error('Something went wrong')
  return sortedResults
}

const findSleepiestMinute = (records: GuardRecord[]) => {
  const counter = new Counter()

  records.forEach(record => {
    for (const minute of record.sleepMinutesList) {
      counter.add(minute.toString())
    }
  })
  const mostCommonEntries = counter.mostCommon()

  if (mostCommonEntries.length <= 0) {
    return {
      id: records[0].id,
      minute: 0,
      count: 0,
    }
  }

  return {
    id: records[0].id,
    minute: parseInt(mostCommonEntries[0][0]),
    count: mostCommonEntries[0][1],
  }
}

function filterById(id: number, records: GuardRecord[]) {
  return records.filter(record => id === record.id)
}

function getSleepiestMinute(records: GuardRecord[]) {
  const sleepMinutesGroup = records.map(record => record.sleepMinutesList)
  const counter = new Counter()
  sleepMinutesGroup.forEach(
    minutes => void minutes.forEach(minute => void counter.add(minute))
  )

  return parseInt(counter.mostCommon()[0][0])
}

// CLASSES

class GuardRecord {
  public id: number
  private date: moment.Moment
  private minutes: RecordMinutes
  private _sleepMinutesList: number[] | null = null

  constructor([header, ...entries]: EntryType[]) {
    if (!isNewShiftEntry(header)) {
      throw new Error('Group data is not sorted correctly')
    }

    this.id = header.id
    this.date = roundToHour(header.date)
    this.minutes = new RecordMinutes(entries)
  }

  public toString() {
    const date = this.date.format('MM-DD')
    const id = this.id.toString().padStart(4, '0')
    const minutes = this.minutes

    return `${date}  #${id}  ${minutes}`
  }

  public get sleepMinutesList() {
    if (this._sleepMinutesList === null) {
      this._sleepMinutesList = this.minutes.valuesWhere(
        ([_, minute]) => minute === true
      )
    }

    return this._sleepMinutesList
  }

  public get sleepTime() {
    return this.sleepMinutesList.length
  }
}

class RecordMinutes {
  private data: Map<number, boolean>
  private entries: EntryType[]

  constructor(entries: EntryType[]) {
    this.data = new Map()
    this.entries = entries

    this.buildMinutes()
    this.setMinutesFromEntries()
  }

  public toString() {
    return Array.from(this.data.values())
      .map(minute => (minute ? '#' : '.'))
      .join('')
  }
  public [util.inspect.custom]() {
    return `RecordMinutes { ${this.toString()} }`
  }

  public valuesWhere(fn: ([key, value]: [number, boolean]) => boolean) {
    return Array.from(this.data.entries())
      .filter(fn)
      .map(([key, _]) => key)
  }

  private buildMinutes() {
    range(0, 60).forEach(i => void this.data.set(i, false))
  }

  private setMinutesFromEntries() {
    splitEvery(2, this.entries).forEach(([sleepStart, sleepEnd]) => {
      if (!isFallsAsleepEntry(sleepStart) || !isWakesUpEntry(sleepEnd)) {
        throw new Error('Group data is not sorted correctly')
      }

      range(sleepStart.date.minutes(), sleepEnd.date.minutes()).forEach(
        minute => void this.data.set(minute, true)
      )
    })
  }
}
