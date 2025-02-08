import { UniqueEntityId } from '@/core/vos/unique-entity-id.vo'
import { AnswerAttchment, AnswerAttchmentProps } from '@/domain/forum/enterprise/entities/answer-attachment.entity'

export function makeAnswerAttachments(override: Partial<AnswerAttchmentProps>, id?: UniqueEntityId) {
  return AnswerAttchment.create(
    {
      answerId: new UniqueEntityId(),
      attachmentId: new UniqueEntityId(),
      ...override,
    },
    id,
  )
}
