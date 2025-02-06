import { faker } from '@faker-js/faker'
import { UniqueEntityId } from "@/core/vos/unique-entity-id.vo";
import { QuestionComment, QuestionCommentProps } from '@/domain/forum/enterprise/entities/question-comment.entity';

export function makeQuestionComment(
  override: Partial<QuestionCommentProps>,
  id?: UniqueEntityId
) {
  return QuestionComment.create({
    authorId: new UniqueEntityId(),
    questionId: new UniqueEntityId(),
    content: faker.lorem.text(),
    ...override
  }, id)
}
