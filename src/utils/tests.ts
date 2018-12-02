import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

const readFileAsync = promisify(fs.readFile)

export const getInput = (dirname: string, file: string) =>
  readFileAsync(path.join(dirname, 'case', file)).then(buffer =>
    buffer.toString()
  )
