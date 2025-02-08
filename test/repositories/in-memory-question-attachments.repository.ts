import { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachments.repository'
import { QuestionAttchment } from '@/domain/forum/enterprise/entities/question-attachment.entity'

export class InMemoryQuestionAttachmentsRepository implements QuestionAttachmentRepository {
  public items: QuestionAttchment[] = []

  async findManyByQuestionId(questionId: string): Promise<QuestionAttchment[]> {
    return this.items.filter((item) => item.questionId.toString() === questionId)
  }

  async deleteManyByQuestionId(questionId: string) {
    this.items = this.items.filter((item) => item.questionId.toString() !== questionId)
  }
}
