import {
  allPass,
  append,
  head,
  none,
  prop,
  propOr,
  reduce,
  reduced,
  intersection,
  sortBy,
  take,
  uniq,
} from 'ramda'
import Counter from '../utils/Counter'
import combinations from './combinations'

export class Point {
  public id: string
  public x: number
  public y: number
  public distance: number
  constructor(id: string, x: number, y: number, distance: number) {
    this.id = id
    this.x = x
    this.y = y
    this.distance = distance
  }
}

export class Grid {
  public static fromPoints(points: Point[]) {
    const grid = new Grid()

    for (const point of points) {
      grid.add(point)
    }

    return grid
  }

  private data: { [key: string]: Point[] } = {}
  private left = NaN
  private right = NaN
  private top = NaN
  private bottom = NaN
  private originalPoints: Point[] = []
  private _finitePoints: Point[] | null = null

  public add({ id, x, y, distance }: Point) {
    const point = new Point(id, x, y, distance)
    if (point.distance === 0) this.registerOriginal(point)
    this.addPoint(point)
    return this
  }

  public growAll() {
    const finiteIds = this.finitePoints.map(point => point.id)
    const times = this.findLargestHypotenuse()

    console.error('times', times)

    for (let i = 0; i <= times; i++) {
      console.error('i', i)
      const pointsGrown = this._growArea()
      const finitePointsGrown = intersection(pointsGrown, finiteIds)
      if (finitePointsGrown.length === 0) break
    }

    return this
  }

  public growArea() {
    this._growArea()
    return this
  }

  public toString() {
    const PADDING = 1
    const results = []

    for (let y = this.top - PADDING; y <= this.bottom + PADDING; y++) {
      const row = []
      for (let x = this.left - PADDING; x <= this.right + PADDING; x++) {
        const point = this.getPoint(x, y)
        let id = '.'

        if (point !== undefined) {
          id = point.distance > 0 ? point.id.toLowerCase() : point.id
        }

        row.push(id[0])
      }

      results.push(row.join(''))
    }

    return results.join('\n')
  }

  public findSafestArea() {
    const counter = new Counter()
    const finiteIds = this.finitePoints.map(point => point.id)

    for (const key of Object.keys(this.data)) {
      const point = this.getPointFromKey(key)
      if (!point) continue
      if (!finiteIds.includes(point.id)) continue

      counter.add(point.id)
    }
    return counter.mostCommon()[0][1]
  }

  private _growArea() {
    const STEPS = [[-1, 0], [1, 0], [0, -1], [0, 1]]
    const results: string[] = []

    for (const key of Object.keys(this.data)) {
      const originPoint = this.getPointFromKey(key)
      if (originPoint === undefined) continue

      STEPS.forEach(([x, y]) => {
        const nextPoint = new Point(
          originPoint.id,
          originPoint.x + x,
          originPoint.y + y,
          originPoint.distance + 1
        )
        const success = this.addPoint(nextPoint)
        if (success) results.push(nextPoint.id)
      })
    }

    return uniq(results)
  }

  private registerOriginal(point: Point) {
    this.originalPoints = uniq(append(point, this.originalPoints))
  }

  private get finitePoints() {
    if (this._finitePoints === null) {
      const allPoints = this.originalPoints
      this._finitePoints = allPoints.filter(l => {
        const points = allPoints.filter(r => l.id !== r.id)

        const isFinite = allPass([
          anyLeft(l),
          anyRight(l),
          anyUp(l),
          anyDown(l),
        ])

        return isFinite(points)
      })
    }

    return this._finitePoints
  }

  private growBoundary(point: Point) {
    if (point.distance === 0) {
      if (isNaN(this.left)) this.left = point.x
      if (isNaN(this.right)) this.right = point.x
      if (isNaN(this.top)) this.top = point.y
      if (isNaN(this.bottom)) this.bottom = point.y

      if (this.left! > point.x) this.left = point.x
      if (this.right! < point.x) this.right = point.x
      if (this.bottom! < point.y) this.bottom = point.y
      if (this.top! > point.y) this.top = point.y
    }
  }

  private getPoint(x: number, y: number): Point | undefined {
    const key = getKey(x, y)

    return this.getPointFromKey(key)
  }
  private getPointFromKey(key: string): Point | undefined {
    const points = propOr([], key, this.data) as Point[]

    if (points.length > 1) {
      const left = points[0]
      const right = points[1]

      return left.distance === right.distance
        ? new Point('.', left.x, left.y, left.distance)
        : left
    } else {
      return head(points)
    }
  }

  private addPoint(point: Point) {
    this.growBoundary(point)
    const key = getKey(point.x, point.y)

    const points = propOr([], key)(this.data) as Point[]

    if (none(otherPoint => point.id === otherPoint.id, points)) {
      this.data[key] = take<Point>(2)(
        sortBy(prop('distance'))(append(point)(points))
      )
      return this.data[key].map(p => p.id).includes(point.id)
    }

    return false
  }

  private findLargestHypotenuse() {
    const points = this.originalPoints
    const pairs = Array.from(combinations(points))

    return pairs.reduce((currentMax, [left, right]) => {
      // a^2 + B^2 = C^2
      const a = Math.abs(left.x - right.x)
      const b = Math.abs(left.y - right.y)
      const c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2))

      return Math.ceil(Math.max(currentMax, c))
    }, 0)
  }
}

function getKey(x: number, y: number) {
  return `${x},${y}`
}

const anyDirection = (fn: (l: Point, r: Point) => boolean) => (l: Point) =>
  reduce<Point, boolean>((acc, r) => (fn(l, r) ? reduced(true) : false), false)

const anyLeft = anyDirection((l, r) => r.x < l.x)
const anyRight = anyDirection((l, r) => r.x > l.x)
const anyUp = anyDirection((l, r) => r.y < l.y)
const anyDown = anyDirection((l, r) => r.y > l.y)
