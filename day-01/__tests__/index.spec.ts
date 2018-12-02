import { chronalCalibration1, chronalCalibration2 } from '..'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

const readFileAsync = promisify(fs.readFile)

const getInput = (file: string) =>
  readFileAsync(path.join(__dirname, 'case', file)).then(buffer =>
    buffer.toString()
  )

test.each`
  file       | expected
  ${'1.txt'} | ${3}
  ${'2.txt'} | ${0}
  ${'3.txt'} | ${-6}
  ${'4.txt'} | ${585}
`('case $file is reduced to $expected', async ({ expected, file }) => {
  const input = await getInput(file)

  expect(chronalCalibration1(input.toString())).toEqual(expected)
})

test.each`
  file                   | expected
  ${'part-2-case-1.txt'} | ${1}
  ${'part-2-case-2.txt'} | ${10}
  ${'part-2-case-3.txt'} | ${5}
  ${'part-2-case-4.txt'} | ${14}
  ${'4.txt'}             | ${83173}
`('case $file is reduced to $expected', async ({ expected, file }) => {
  const input = await getInput(file)

  expect(chronalCalibration2(input)).toEqual(expected)
})
