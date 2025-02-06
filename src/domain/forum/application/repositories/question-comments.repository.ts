import { QuestionComment } from "../../enterprise/entities/question-comment.entity";

export interface QuestionCommentRepository {
  create(questionComment: QuestionComment): Promise<void>
}