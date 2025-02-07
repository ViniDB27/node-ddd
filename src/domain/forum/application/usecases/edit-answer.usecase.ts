import { Either, left, right } from '@/core/either'
import { Answer } from '../../enterprise/entities/answer.entity'
import { AnswersRepository } from '../repositories/answers.repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'

interface EditAnswerUseCaseRequest {
  authorId: string
  answerId: string
  content: string
}

type EditAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    answer: Answer
  }
>

export class EditAnswerUseCase {
  constructor(private readonly answerRepository: AnswersRepository) {}

  async execute({ authorId, answerId, content }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId)
    if (!answer) return left(new ResourceNotFoundError())
    if (authorId !== answer.authorId.toString()) return left(new NotAllowedError())
    answer.content = content
    await this.answerRepository.update(answer)
    return right({ answer })
  }
}
