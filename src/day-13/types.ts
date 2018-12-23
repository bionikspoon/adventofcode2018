export type SegmentSymbol =
  | ' '
  | '|'
  | 'v'
  | '^'
  | '-'
  | '>'
  | '<'
  | '\\'
  | '/'
  | '+'

export type CartSymbol = '>' | '<' | 'v' | '^'

export function isCartSymbol(symbol: string): symbol is CartSymbol {
  const cartSymbols = ['>', '<', 'v', '^']

  return cartSymbols.includes(symbol)
}
