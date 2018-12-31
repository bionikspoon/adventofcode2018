export class GameOverError extends Error {
  constructor() {
    super('Game Over.')
  }
}

export class ElfDiedError extends Error {
  constructor() {
    super('Elf Died')
  }
}
