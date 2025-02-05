import { PaginateParams } from '@/core/repositories/pagination-params'
import { QuestionRepository } from '@/domain/forum/application/repositories/questions.repository'
import { Question } from '@/domain/forum/enterprise/entities/question.entity'

export class InMemoryQuestionRepository implements QuestionRepository {
  public intems: Question[] = []

  async create(question: Question) {
    this.intems.push(question)
  }

  async update(question: Question) {
    const itemIndex = this.intems.findIndex((item) => item.id === question.id)
    this.intems[itemIndex] = question
  }

  async delete(question: Question) {
    const itemIndex = this.intems.findIndex((item) => item.id === question.id)
    this.intems.splice(itemIndex, 1)
  }

  async findBySlug(slug: string) {
    return this.intems.find((item) => item.slug.value === slug) ?? null
  }

  async findById(questionId: string) {
    return this.intems.find((item) => item.id.toString() === questionId) ?? null
  }

  async findManyRecent({ page }: PaginateParams) {
    const question = this.intems
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)
    return question
  }
}
