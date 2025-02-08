import { AnswerAttachmentRepository } from '@/domain/forum/application/repositories/answer-attachments.repository'
import { AnswerAttchment } from '@/domain/forum/enterprise/entities/answer-attachment.entity'

export class InMemoryAnswerAttachmentsRepository implements AnswerAttachmentRepository {
  public items: AnswerAttchment[] = []

  async findManyByAnswerId(answerId: string): Promise<AnswerAttchment[]> {
    return this.items.filter((item) => item.answerId.toString() === answerId)
  }

  async deleteManyByAnswerId(answerId: string) {
    this.items = this.items.filter((item) => item.answerId.toString() !== answerId)
  }
}
