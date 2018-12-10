import { Grid } from './Grid'

const coordinates = [
  { id: 'A', x: 1, y: 1, distance: 0 },
  { id: 'B', x: 1, y: 6, distance: 0 },
  { id: 'C', x: 8, y: 3, distance: 0 },
  { id: 'D', x: 3, y: 4, distance: 0 },
  { id: 'E', x: 5, y: 5, distance: 0 },
  { id: 'F', x: 8, y: 9, distance: 0 },
]

describe('#fromPoints', () => {
  test('it creates a grid from coordinates', () => {
    const expected = trim`
      ..........
      .A........
      ..........
      ........C.
      ...D......
      .....E....
      .B........
      ..........
      ..........
      ........F.
      ..........
    `

    const subject = Grid.fromPoints(coordinates).toString()
    expect(subject).toEqual(expected)
  })
})

describe('#grow', () => {
  test('it can grow each point', () => {
    const expected = trim`
    .a........
    aAa.......
    .a......c.
    ...d...cCc
    ..dDde..c.
    .b.deEe...
    bBb..e....
    .b........
    ........f.
    .......fFf
    ........f.
  `

    const newLocal = Grid.fromPoints(coordinates)
      .growArea()
      .toString()
    expect(newLocal).toEqual(expected)
  })

  test('it can grow each point', () => {
    const expected = trim`
    aaa.......
    aAaa....c.
    aaad...ccc
    .adddeccCc
    ..dDdeeccc
    bb.deEeec.
    bBb.eee...
    bbb..e..f.
    .b.....fff
    ......ffFf
    .......fff
  `

    const subject = Grid.fromPoints(coordinates)
      .growArea()
      .growArea()
      .toString()
    expect(subject).toEqual(expected)
  })

  test('it can grow each point', () => {
    const expected = trim`
    aaaa....c.
    aAaaa..ccc
    aaaddecccc
    aadddeccCc
    ..dDdeeccc
    bb.deEeecc
    bBb.eeee..
    bbb.eeefff
    bbb..effff
    .b...fffFf
    ......ffff
  `

    const subject = Grid.fromPoints(coordinates)
      .growArea()
      .growArea()
      .growArea()
      .toString()
    expect(subject).toEqual(expected)
  })
})

describe('#growAll', () => {
  test('it grows for the longest hypotenuse', () => {
    const expected = trim`
    aaaaa.cccc
    aAaaa.cccc
    aaaddecccc
    aadddeccCc
    ..dDdeeccc
    bb.deEeecc
    bBb.eeee..
    bbb.eeefff
    bbb.eeffff
    bbb.ffffFf
    bbb.ffffff
  `

    const subject = Grid.fromPoints(coordinates)
      .growAll()
      .toString()
    expect(subject).toEqual(expected)
  })
})

describe('#findAreas', () => {
  test('it finds areas for each id', () => {
    const subject = Grid.fromPoints(coordinates)
      .growAll()
      .findSafestArea()
    expect(subject).toEqual(17)
  })
})

const trim = (strings: TemplateStringsArray) =>
  strings
    .join('')
    .trim()
    .split('\n')
    .map(line => line.trim())
    .join('\n')
