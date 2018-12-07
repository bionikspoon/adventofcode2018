import { LinkedList, Node } from './LinkedList'

export function reducePolymers(input: string) {
  const list = LinkedList.from(
    input
      .trim()
      .split('')
      .map(char => new Node(char))
  )

  let node = list.firstNode

  while (true) {
    if (node === null) break

    if (hasReaction(node)) {
      if (node === list.firstNode) {
        list.remove(list.firstNode!)
        list.remove(list.firstNode!)
        node = list.firstNode
      } else {
        node = node.prev
        list.remove(node!.next!)
        list.remove(node!.next!)
      }
    } else {
      node = node.next
    }
  }

  return Array.from(list).join('')
}

function hasReaction(l: Node<string>) {
  if (l.next === null) return false

  const r = l.next

  if (l.value.toLowerCase() !== r.value.toLowerCase()) return false
  if (isLowerCase(l.value) && isUpperCase(r.value)) return true
  if (isUpperCase(l.value) && isLowerCase(r.value)) return true

  return false
}

function isLowerCase(text: string) {
  return text.toLowerCase() === text
}

function isUpperCase(text: string) {
  return text.toUpperCase() === text
}
