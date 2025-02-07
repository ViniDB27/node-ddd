import { UniqueEntityId } from '@/core/vos/unique-entity-id.vo'
import { AnswersRepository } from '../repositories/answers.repository'
import { AnswerCommentRepository } from '../repositories/answer-comments.repository'
import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface CommentAnswerUseCaseRequest {
  authorId: string
  answerId: string
  content: string
}

type CommentAnswerUseCaseResponse = Either<
ResourceNotFoundError,
  {
    answerComment: AnswerComment
  }
>
export class CommentAnswerUseCase {
  constructor(
    private readonly answerRepository: AnswersRepository,
    private readonly answerCommentRepository: AnswerCommentRepository,
  ) {}

  async execute({ authorId, answerId, content }: CommentAnswerUseCaseRequest): Promise<CommentAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId)
    if (!answer) return left(new ResourceNotFoundError())
    const answerComment = AnswerComment.create({
      authorId: new UniqueEntityId(authorId),
      answerId: answer.id,
      content,
    })
    await this.answerCommentRepository.create(answerComment)
    return right({ answerComment })
  }
}
