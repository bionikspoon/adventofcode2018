import { LinkedList, Node } from './LinkedList'

export function reducePolymers(input: string) {
  const list = createList(input)

  let node = list.firstNode

  while (true) {
    if (node === null || node.next === null) break

    if (!hasReaction(node.value, node.next.value)) {
      node = node.next
      continue
    }

    if (node === list.firstNode) {
      list.remove(list.firstNode!)
      list.remove(list.firstNode!)
      node = list.firstNode
    } else {
      node = node.prev
      list.remove(node!.next!)
      list.remove(node!.next!)
    }
  }

  return Array.from(list).join('')
}

export function hasReaction(l: string, r: string) {
  if (l.toLowerCase() !== r.toLowerCase()) return false
  if (isLowerCase(l) && isUpperCase(r)) return true
  if (isUpperCase(l) && isLowerCase(r)) return true

  return false
}

function isLowerCase(text: string) {
  return text.toLowerCase() === text
}

function isUpperCase(text: string) {
  return text.toUpperCase() === text
}

function createList(input: string) {
  const nodes = input
    .trim()
    .split('')
    .map(char => new Node(char))

  return LinkedList.from(nodes)
}
