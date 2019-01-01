import { filter, is } from 'ramda'
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
    return selectInstances(TreeAcre, neighbors).length >= 3
      ? new TreeAcre()
      : this
  }
}

class TreeAcre extends AcreValue {
  public readonly token: Token = Token.TREE
  public willBecome(neighbors: AcreValue[]): AcreValue {
    return selectInstances(LumberyardAcre, neighbors).length >= 3
      ? new LumberyardAcre()
      : this
  }
}
class LumberyardAcre extends AcreValue {
  public readonly token: Token = Token.LUMBERYARD
  public willBecome(neighbors: AcreValue[]): AcreValue {
    return selectInstances(TreeAcre, neighbors).length >= 1 &&
      selectInstances(LumberyardAcre, neighbors).length >= 1
      ? this
      : new OpenAcre()
  }
}

const selectInstances = <T>(ctor: any, items: T[]): T[] =>
  filter(is(ctor), items)
