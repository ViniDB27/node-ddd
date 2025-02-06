import { QuestionComment } from '../../enterprise/entities/question-comment.entity'
import { QuestionCommentRepository } from '../repositories/question-comments.repository'

interface DeleteCommentQuestionUseCaseRequest {
  authorId: string
  questionCommentId: string
}

interface DeleteCommentQuestionUseCaseResponse {
  questionComment: QuestionComment
}

export class DeleteCommentQuestionUseCase {
  constructor(
    private readonly questionCommentRepository: QuestionCommentRepository,
  ) {}

  async execute({
    authorId,
    questionCommentId,
  }: DeleteCommentQuestionUseCaseRequest): Promise<DeleteCommentQuestionUseCaseResponse> {
    const questionComment =
      await this.questionCommentRepository.findById(questionCommentId)

    if (!questionComment) throw new Error('Question comment not found')
    if (questionComment.authorId.toString() !== authorId)
      throw new Error('Not allowed')

    await this.questionCommentRepository.delete(questionComment)
    return {
      questionComment,
    }
  }
}
