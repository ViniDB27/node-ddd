import { faker } from '@faker-js/faker'
import { UniqueEntityId } from "@/core/vos/unique-entity-id.vo";
import { Answer, AnswerProps } from '@/domain/forum/enterprise/entities/answer.entity';

export function makeAnswer(
  override: Partial<AnswerProps>,
  id?: UniqueEntityId
) {
  return Answer.create({
    authorId: new UniqueEntityId(),
    questionId: new UniqueEntityId(),
    content: faker.lorem.text(),
    ...override
  }, id)
}
