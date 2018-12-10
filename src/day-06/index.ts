import {
  addIndex,
  allPass,
  map,
  pipe,
  reduce,
  reduced,
  split,
  trim,
  unary,
} from 'ramda'
import Counter from '../utils/Counter'

interface IPoint {
  id: string
  x: number
  y: number
}
export function findLargestFiniteArea(input: string) {
  const points = pipe(
    toLines,
    toPoints
  )(input)

  const counter = countClosest(points)
  return counter.mostCommon()[0][1]
}

export function findMostConnectedRegion(input: string, limit: number) {
  const points = pipe(
    toLines,
    toPoints
  )(input)

  return countConnections(points, limit)
}

const toLines = pipe(
  trim,
  split('\n'),
  map(trim)
)

const enumerate = <T, U>(fn: (item: T[], index: number) => U) =>
  addIndex<T[], U>(map)(fn)

const toPoints = pipe(
  map(
    pipe(
      split(', '),
      map<string, number>(unary(parseInt))
    )
  ),
  enumerate<number, IPoint>(([x, y], id) => ({
    id: id.toString(),
    x,
    y,
  }))
)
const countConnections = (points: IPoint[], limit: number) => {
  const { top, left, bottom, right } = findBoundingBox(points)

  return Array.from(iteratePoints({ top, left, right, bottom }))
    .map(mapPoint =>
      points.reduce(
        (acc, point) => acc + findManhattenDistance(point, mapPoint),
        0
      )
    )
    .filter(count => count < limit).length
}

const countClosest = (points: IPoint[]) => {
  const finitePoints = getFinitePoints(points)
  const { top, left, bottom, right } = findBoundingBox(points)

  return Array.from(iteratePoints({ top, left, right, bottom }))
    .map(l => findClosestPoint(l, points))
    .filter(point => point !== null)
    .reduce(
      (counter, point) =>
        finitePoints.includes(point!) ? counter.add(point!.id) : counter,
      new Counter()
    )
}

const findBoundingBox = (points: IPoint[]) =>
  points.reduce(
    ({ top, left, right, bottom }, point) => ({
      top: Math.min(top, point.y),
      bottom: Math.max(bottom, point.y),
      left: Math.min(left, point.x),
      right: Math.max(right, point.x),
    }),
    {
      top: points[0].y,
      bottom: points[0].y,
      right: points[0].x,
      left: points[0].x,
    }
  )

function* iteratePoints({
  top,
  left,
  right,
  bottom,
}: {
  top: number
  left: number
  right: number
  bottom: number
}) {
  for (let x = left; x <= right; x++) {
    for (let y = top; y <= bottom; y++) {
      yield { id: '', x, y }
    }
  }
}

const findClosestPoint = (l: IPoint, points: IPoint[]) => {
  const pointDistances = points
    .map(r => ({ distance: findManhattenDistance(l, r), point: r }))
    .sort((_l, _r) => _l.distance - _r.distance)

  if (
    (pointDistances.length >= 2 &&
      pointDistances[0].distance === pointDistances[1].distance) ||
    pointDistances.length <= 1
  ) {
    return null
  }

  return pointDistances[0].point
}

const findManhattenDistance = (l: IPoint, r: IPoint) =>
  Math.abs(l.x - r.x) + Math.abs(l.y - r.y)

const hasDirection = (fn: (l: IPoint, r: IPoint) => boolean) => (l: IPoint) =>
  reduce<IPoint, boolean>((acc, r) => (fn(l, r) ? reduced(true) : false), false)

const hasLeft = hasDirection((l, r) => r.x < l.x)
const hasRight = hasDirection((l, r) => r.x > l.x)
const hasUp = hasDirection((l, r) => r.y < l.y)
const hasDown = hasDirection((l, r) => r.y > l.y)

const isFinite = (point: IPoint) =>
  allPass([hasLeft(point), hasRight(point), hasUp(point), hasDown(point)])

const getFinitePoints = (points: IPoint[]) =>
  points.filter(l => isFinite(l)(points.filter(r => l.id !== r.id)))
