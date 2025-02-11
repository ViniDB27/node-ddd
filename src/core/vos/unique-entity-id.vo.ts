import { randomUUID } from 'node:crypto'

export class UniqueEntityId {
  private readonly value: string

  constructor(value?: string) {
    this.value = value ?? randomUUID()
  }

  toString() {
    return this.value
  }

  toValue() {
    return this.value
  }

  equals(id: UniqueEntityId): boolean {
    if (id.toValue() === this.toValue()) {
      return true
    }

    return false
  }
}
