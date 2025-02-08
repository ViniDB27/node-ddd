import { PaginateParams } from '@/core/repositories/pagination-params'
import { AnswerAttachmentRepository } from '@/domain/forum/application/repositories/answer-attachments.repository'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers.repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer.entity'

export class InMemoryAnswersRepository implements AnswersRepository {
  constructor(private readonly answerAttachmentRepository: AnswerAttachmentRepository) {}
  public items: Answer[] = []

  async create(answer: Answer) {
    this.items.push(answer)
  }

  async update(answer: Answer) {
    const itemIndex = this.items.findIndex((item) => item.id === answer.id)
    this.items[itemIndex] = answer
  }

  async delete(answer: Answer) {
    const itemIndex = this.items.findIndex((item) => item.id === answer.id)
    this.items.splice(itemIndex, 1)
    this.answerAttachmentRepository.deleteManyByAnswerId(answer.id.toString())
  }

  async findById(answerId: string) {
    return (
      this.items.find((item) => item.id.toString() === answerId) ??
      null
    )
  }

  async findManyByQuestioId(questionId: string, { page }: PaginateParams) {
    return this.items.filter((item) => item.questionId.toString() === questionId)
    .slice((page -1 ) * 20, page * 20)
  }
}
