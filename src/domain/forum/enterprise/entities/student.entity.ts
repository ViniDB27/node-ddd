import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/vos/unique-entity-id.vo'

interface StudentProps {
  name: string
}

export class Student extends Entity<StudentProps> {
  get name() {
    return this.props.name
  }

  static create(props: StudentProps, id?: UniqueEntityId): Student {
    return new Student(props, id)
  }
}
