import { faker } from '@faker-js/faker'
import { UniqueEntityId } from "@/core/vos/unique-entity-id.vo";
import { AnswerComment, AnswerCommentProps } from '@/domain/forum/enterprise/entities/answer-comment.entity';

export function makeAnswerComment(
  override: Partial<AnswerCommentProps>,
  id?: UniqueEntityId
) {
  return AnswerComment.create({
    authorId: new UniqueEntityId(),
    answerId: new UniqueEntityId(),
    content: faker.lorem.text(),
    ...override
  }, id)
}
