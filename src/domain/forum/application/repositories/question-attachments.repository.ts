import { QuestionAttchment } from '../../enterprise/entities/question-attachment.entity'

export interface QuestionAttachmentRepository {
  findManyByQuestionId(questionId: string): Promise<QuestionAttchment[]>
  deleteManyByQuestionId(questionId: string): Promise<void>
}
