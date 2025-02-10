import { faker } from '@faker-js/faker'
import { UniqueEntityId } from "@/core/vos/unique-entity-id.vo";
import { Question, QuestionProps } from "@/domain/forum/enterprise/entities/question.entity";
import { Slug } from '@/domain/forum/enterprise/vos/slug.vo';

export function makeQuestion(
  override: Partial<QuestionProps>,
  id?: UniqueEntityId
) {
  return Question.create({
    authorId: new UniqueEntityId(),
    title: faker.lorem.sentence(),
    slug: Slug.create(faker.lorem.slug()),
    content: faker.lorem.text(),
    ...override
  }, id)
}
