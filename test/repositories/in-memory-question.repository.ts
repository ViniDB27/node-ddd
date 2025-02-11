import { DomainEvents } from '@/core/events/domain-events'
import { PaginateParams } from '@/core/repositories/pagination-params'
import { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachments.repository'
import { QuestionRepository } from '@/domain/forum/application/repositories/questions.repository'
import { Question } from '@/domain/forum/enterprise/entities/question.entity'

export class InMemoryQuestionRepository implements QuestionRepository {
  constructor(private readonly questionAttachmentRepository: QuestionAttachmentRepository) {}
  public items: Question[] = []

  async create(question: Question) {
    this.items.push(question)
     DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async update(question: Question) {
    const itemIndex = this.items.findIndex((item) => item.id === question.id)
    this.items[itemIndex] = question
    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async delete(question: Question) {
    const itemIndex = this.items.findIndex((item) => item.id === question.id)
    this.items.splice(itemIndex, 1)
    this.questionAttachmentRepository.deleteManyByQuestionId(question.id.toString())
  }

  async findBySlug(slug: string) {
    return this.items.find((item) => item.slug.value === slug) ?? null
  }

  async findById(questionId: string) {
    return this.items.find((item) => item.id.toString() === questionId) ?? null
  }

  async findManyRecent({ page }: PaginateParams) {
    const question = this.items.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice((page - 1) * 20, page * 20)
    return question
  }
}
