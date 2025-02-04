import { UniqueEntityId } from '../vos/unique-entity-id.vo'

export class Entity<Props> {
  private readonly _id: UniqueEntityId
  protected props: Props

  get id() {
    return this._id
  }

  protected constructor(props: any, id?: UniqueEntityId) {
    this._id = id ?? new UniqueEntityId()
    this.props = props
  }
}
