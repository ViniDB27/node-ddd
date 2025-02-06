import { QuestionComment } from '../../enterprise/entities/question-comment.entity'

export interface QuestionCommentRepository {
  create(questionComment: QuestionComment): Promise<void>
  delete(questionComment: QuestionComment): Promise<void>
  findById(questionCommentId: string): Promise<QuestionComment| null>
}
