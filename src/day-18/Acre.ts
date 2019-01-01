import { Token } from './shared'

export function acreFromToken(x: number, y: number, token: Token) {
  switch (token) {
    case Token.OPEN:
      return new OpenAcre(x, y)
    case Token.TREE:
      return new TreeAcre(x, y)
    case Token.LUMBERYARD:
      return new LumberyardAcre(x, y)
  }
}

export abstract class Acre {
  public static getKey(x: number, y: number) {
    return [y, x].map(n => n.toString().padStart(2, '0')).join('_')
  }
  public readonly x: number
  public readonly y: number
  public abstract readonly token: Token
  private readonly key: string

  constructor(x: number, y: number) {
    this.x = x
    this.y = y

    this.key = Acre.getKey(x, y)
  }

  public toString() {
    return this.key
  }
}

class OpenAcre extends Acre {
  public token: Token = Token.OPEN
}

class TreeAcre extends Acre {
  public token: Token = Token.TREE
}
class LumberyardAcre extends Acre {
  public token: Token = Token.LUMBERYARD
}
