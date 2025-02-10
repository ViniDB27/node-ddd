import { Either, left, right } from '@/core/either'
import { AnswerCommentRepository } from '../repositories/answer-comments.repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'

interface DeleteCommentAnswerUseCaseRequest {
  authorId: string
  answerCommentId: string
}

type DeleteCommentAnswerUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {}>

export class DeleteCommentAnswerUseCase {
  constructor(private readonly answerCommentRepository: AnswerCommentRepository) {}

  async execute({ authorId, answerCommentId }: DeleteCommentAnswerUseCaseRequest): Promise<DeleteCommentAnswerUseCaseResponse> {
    const answerComment = await this.answerCommentRepository.findById(answerCommentId)
    if (!answerComment) return left(new ResourceNotFoundError())
    if (answerComment.authorId.toString() !== authorId) return left(new NotAllowedError())
    await this.answerCommentRepository.delete(answerComment)
    return right({})
  }
}
