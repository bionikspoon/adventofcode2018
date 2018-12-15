import {
  calculateCellPowerLevel,
  findBestCellFactory,
  findMostPowerful3by3grid,
  findMostPowerfulGrid,
} from '.'

describe('part 1', () => {
  describe.each`
    serialNumber | expected
    ${42}        | ${'21,61'}
    ${7672}      | ${'22,18'}
  `('given grid serial number: $serialNumber', ({ serialNumber, expected }) => {
    describe('#findMostPowerfulGrid', () => {
      test('it finds the grid with the largest total power', () => {
        expect(findMostPowerful3by3grid(serialNumber)).toEqual(expected)
      })
    })

    describe('#findAllCellPowers', () => {
      test('it matches snapshot', () => {
        expect(findBestCellFactory(serialNumber)(3)).toMatchSnapshot()
      })
    })
  })
})

describe('part 2', () => {
  describe.each`
    serialNumber | expected
    ${18}        | ${'90,269,16'}
    ${42}        | ${'232,251,12'}
    ${7672}      | ${'232,251,12'}
  `('given grid serial number: $serialNumber', ({ serialNumber, expected }) => {
    describe('#findMostPowerfulGrid', () => {
      test('it finds the grid with the largest total power', () => {
        expect(findMostPowerfulGrid(serialNumber)).toEqual(expected)
      })
    })
  })
})

describe.each`
  x      | y      | serialNumber | cellPowerLevel
  ${122} | ${79}  | ${57}        | ${-5}
  ${217} | ${196} | ${39}        | ${0}
  ${101} | ${153} | ${71}        | ${4}
  ${33}  | ${45}  | ${18}        | ${4}
  ${21}  | ${61}  | ${42}        | ${4}
  ${90}  | ${269} | ${18}        | ${3}
  ${232} | ${251} | ${42}        | ${2}
`(
  'given coordinates ($x,$y) with serial number ($serialNumber)',
  ({ x, y, serialNumber, cellPowerLevel }) => {
    test(`#calculateCellPowerLevel has a cell power level of ${cellPowerLevel}`, () => {
      expect(calculateCellPowerLevel(x, y, serialNumber)).toEqual(
        cellPowerLevel
      )
    })
  }
)
