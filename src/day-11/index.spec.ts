import {
  calculateCellPowerLevel,
  calculateGridPowerLevel,
  findAllCellPowers,
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
        expect(findMostPowerfulGrid(serialNumber)).toEqual(expected)
      })
    })

    describe('#findAllCellPowers', () => {
      test('it matches snapshot', () => {
        expect(findAllCellPowers(serialNumber)).toMatchSnapshot()
      })
    })
  })

  describe.each`
    x      | y      | serialNumber | cellPowerLevel | gridPowerLevel
    ${122} | ${79}  | ${57}        | ${-5}          | ${false}
    ${217} | ${196} | ${39}        | ${0}           | ${false}
    ${101} | ${153} | ${71}        | ${4}           | ${false}
    ${33}  | ${45}  | ${18}        | ${4}           | ${29}
    ${21}  | ${61}  | ${42}        | ${4}           | ${30}
  `(
    'given coordinates ($x,$y) with serial number ($serialNumber)',
    ({ x, y, serialNumber, cellPowerLevel, gridPowerLevel }) => {
      test(`#calculateCellPowerLevel has a cell power level of ${cellPowerLevel}`, () => {
        expect(calculateCellPowerLevel(x, y, serialNumber)).toEqual(
          cellPowerLevel
        )
      })

      if (gridPowerLevel === false) return
      test(`#calculateGridPowerLevel has a grid power level of ${gridPowerLevel}`, () => {
        expect(calculateGridPowerLevel(x, y, serialNumber)).toEqual(
          gridPowerLevel
        )
      })
    }
  )
})

// Fuel cell at  122,79, grid serial number 57: power level -5.
// Fuel cell at 217,196, grid serial number 39: power level  0.
// Fuel cell at 101,153, grid serial number 71: power level  4.
