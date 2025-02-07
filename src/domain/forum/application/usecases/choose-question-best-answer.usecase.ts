import { UniqueEntityId } from '@/core/vos/unique-entity-id.vo'
import { Question } from '../../enterprise/entities/question.entity'
import { QuestionRepository } from '../repositories/questions.repository'
import { AnswersRepository } from '../repositories/answers.repository'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'

interface ChooseQuestionBestAnswerUseCaseRequest {
  authorId: string
  answerId: string
}

type ChooseQuestionBestAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question
  }
>

export class ChooseQuestionBestAnswerUseCase {
  constructor(
    private readonly questionRepository: QuestionRepository,
    private readonly answersRepository: AnswersRepository,
  ) {}

  async execute({ authorId, answerId }: ChooseQuestionBestAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)
    if (!answer) return left(new ResourceNotFoundError())
    const question = await this.questionRepository.findById(answer.questionId.toString())
    if (!question) return left(new ResourceNotFoundError())
    if (authorId !== question.authorId.toString()) return left(new NotAllowedError())
    question.bestAnswerId = new UniqueEntityId(answerId)
    await this.questionRepository.update(question)
    return right({ question })
  }
}
