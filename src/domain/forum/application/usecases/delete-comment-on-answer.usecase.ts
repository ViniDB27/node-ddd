import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { AnswerCommentRepository } from '../repositories/answer-comments.repository'

interface DeleteCommentAnswerUseCaseRequest {
  authorId: string
  answerCommentId: string
}

interface DeleteCommentAnswerUseCaseResponse {
  answerComment: AnswerComment
}

export class DeleteCommentAnswerUseCase {
  constructor(
    private readonly answerCommentRepository: AnswerCommentRepository,
  ) {}

  async execute({
    authorId,
    answerCommentId,
  }: DeleteCommentAnswerUseCaseRequest): Promise<DeleteCommentAnswerUseCaseResponse> {
    const answerComment =
      await this.answerCommentRepository.findById(answerCommentId)

    if (!answerComment) throw new Error('Answer comment not found')
    if (answerComment.authorId.toString() !== authorId)
      throw new Error('Not allowed')

    await this.answerCommentRepository.delete(answerComment)
    return {
      answerComment,
    }
  }
}
