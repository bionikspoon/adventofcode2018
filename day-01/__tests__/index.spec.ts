import chronalCalibration from '..'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

const readFileAsync = promisify(fs.readFile)

test.each`
  file       | expected
  ${'1.txt'} | ${3}
  ${'2.txt'} | ${0}
  ${'3.txt'} | ${-6}
  ${'4.txt'} | ${585}
`('case $file is reduced to $expected', async ({ expected, file }) => {
  const input = await readFileAsync(path.join(__dirname, 'case', file))

  expect(chronalCalibration(input.toString())).toEqual(expected)
})
