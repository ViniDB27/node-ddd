import { Either, right } from '@/core/either'
import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { AnswerCommentRepository } from '../repositories/answer-comments.repository'

interface FetchCommentAnswerUseCaseRequest {
  answerId: string
  page: number
}

type FetchCommentAnswerUseCaseResponse = Either<
  null,
  {
    answerComments: AnswerComment[]
  }
>

export class FetchCommentAnswerUseCase {
  constructor(private readonly answerCommentRepository: AnswerCommentRepository) {}

  async execute({ answerId, page }: FetchCommentAnswerUseCaseRequest): Promise<FetchCommentAnswerUseCaseResponse> {
    const answerComments = await this.answerCommentRepository.findByAnswerId(answerId, { page })
    return right({ answerComments })
  }
}
