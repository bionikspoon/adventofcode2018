export default function parseLines(input: string) {
  return input
    .trim()
    .split('\n')
    .map(line => line.trim())
}
