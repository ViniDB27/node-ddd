import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/vos/unique-entity-id.vo'

interface InstructorProps {
  name: string
}

export class Instructor extends Entity<InstructorProps> {
  get name() {
    return this.props.name
  }

  static create(props: InstructorProps, id?: UniqueEntityId): Instructor {
    return new Instructor(props, id)
  }
}
