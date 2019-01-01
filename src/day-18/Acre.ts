import { Token } from './shared'

export class Acre {
  public static getKey(x: number, y: number) {
    return [y, x].map(n => n.toString().padStart(2, '0')).join('_')
  }
  public readonly x: number
  public readonly y: number
  public value: AcreValue
  private readonly key: string

  constructor(x: number, y: number, token: Token) {
    this.x = x
    this.y = y

    this.key = Acre.getKey(x, y)
    this.value = acreValueFromToken(token)
  }

  public toString() {
    return this.key
  }

  public evolve(neighbors: AcreValue[]) {
    const nextValue = this.value.willBecome(neighbors)
    this.value = nextValue
    return this
  }
}

function acreValueFromToken(token: Token) {
  switch (token) {
    case Token.OPEN:
      return new OpenAcre()
    case Token.TREE:
      return new TreeAcre()
    case Token.LUMBERYARD:
      return new LumberyardAcre()
  }
}

export abstract class AcreValue {
  public abstract readonly token: Token
  public abstract willBecome(neighbors: AcreValue[]): AcreValue
}

class OpenAcre extends AcreValue {
  public readonly token: Token = Token.OPEN
  public willBecome(neighbors: AcreValue[]): AcreValue {
    const neighborsWithTrees = neighbors.filter(
      neighbor => neighbor instanceof TreeAcre
    )
    return neighborsWithTrees.length >= 3 ? new TreeAcre() : this
  }
}

class TreeAcre extends AcreValue {
  public readonly token: Token = Token.TREE
  public willBecome(neighbors: AcreValue[]): AcreValue {
    const neighborsWithLumberyards = neighbors.filter(
      neighbor => neighbor instanceof LumberyardAcre
    )
    return neighborsWithLumberyards.length >= 3 ? new LumberyardAcre() : this
  }
}
class LumberyardAcre extends AcreValue {
  public readonly token: Token = Token.LUMBERYARD
  public willBecome(neighbors: AcreValue[]): AcreValue {
    const neighborsWithLumberyards = neighbors.filter(
      neighbor => neighbor instanceof LumberyardAcre
    )
    const neighborsWithTrees = neighbors.filter(
      neighbor => neighbor instanceof TreeAcre
    )
    return neighborsWithTrees.length >= 1 &&
      neighborsWithLumberyards.length >= 1
      ? this
      : new OpenAcre()
  }
}
