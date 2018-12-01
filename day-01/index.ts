export default function chronalCalibration(input: string) {
  const operation = input
    .trim()
    .split('\n')
    .map(line => line.trim())
    .join(' ')

  return eval(`0 ${operation}`)
}
