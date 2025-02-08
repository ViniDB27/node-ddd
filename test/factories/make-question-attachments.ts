import { UniqueEntityId } from '@/core/vos/unique-entity-id.vo'
import { QuestionAttchment, QuestionAttchmentProps } from '@/domain/forum/enterprise/entities/question-attachment.entity'

export function makeQuestionAttachments(override: Partial<QuestionAttchmentProps>, id?: UniqueEntityId) {
  return QuestionAttchment.create(
    {
      questionId: new UniqueEntityId(),
      attachmentId: new UniqueEntityId(),
      ...override,
    },
    id,
  )
}
