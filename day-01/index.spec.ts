import chronalCalibration from '.'
import fs from 'fs'
import path from 'path'

const example1 = `
+1
+1
+1
`
const example2 = `
+1
+1
-2
`

const example3 = `
-1
-2
-3
`

const example4 = fs.readFileSync(path.join(__dirname, 'input.txt')).toString()

test.each`
  case | input       | expected
  ${1} | ${example1} | ${3}
  ${2} | ${example2} | ${0}
  ${3} | ${example3} | ${-6}
  ${4} | ${example4} | ${585}
`('case $case', ({ input, expected }) => {
  expect(chronalCalibration(input)).toEqual(expected)
})
