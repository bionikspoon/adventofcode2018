import { LinkedList, Node } from '../utils/LinkedList'

// PART 1
export function reducePolymers(input: string) {
  const list = createList(input)

  let node = list.firstNode

  while (node !== null && node.next !== null) {
    if (!hasReaction(node.value, node.next.value)) {
      node = node.next
      continue
    }

    node = handleReaction(list, node)
  }

  return Array.from(list).join('')
}

// PART 2
const LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('')

export function reduceCrushedPolymers(input: string) {
  return LETTERS.map(getReducedPolymerLength).reduce((l, r) => Math.min(l, r))

  function getReducedPolymerLength(letter: string) {
    const crushedPolymers = crushPolymers(letter, input)
    const reducedPolymers = reducePolymers(crushedPolymers)
    return reducedPolymers.length
  }
}

// SHARED
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
  const nodes = input.trim().split('')

  return LinkedList.from(nodes)
}

function handleReaction<T>(list: LinkedList<T>, node: Node<T>) {
  let _node: Node<T> | null = node
  if (_node === list.firstNode) {
    list.remove(list.firstNode!)
    list.remove(list.firstNode!)
    _node = list.firstNode
  } else {
    _node = _node.prev
    list.remove(_node!.next!)
    list.remove(_node!.next!)
  }
  return _node
}

export function crushPolymers(charToRemove: string, input: string) {
  if (!isLowerCase(charToRemove)) {
    throw new Error(`Expected charToRemove to be lowercase: ${charToRemove}`)
  }

  return input
    .split('')
    .filter(letter => letter.toLowerCase() !== charToRemove)
    .join('')
}
