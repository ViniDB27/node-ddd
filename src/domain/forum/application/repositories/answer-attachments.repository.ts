import { AnswerAttchment } from '../../enterprise/entities/answer-attachment.entity'

export interface AnswerAttachmentRepository {
  findManyByAnswerId(answerId: string): Promise<AnswerAttchment[]>
  deleteManyByAnswerId(answerId: string): Promise<void>
}
