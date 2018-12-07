import { LinkedList, Node } from './LinkedList'

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
