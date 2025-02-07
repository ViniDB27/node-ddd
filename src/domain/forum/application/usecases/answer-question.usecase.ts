import { UniqueEntityId } from '@/core/vos/unique-entity-id.vo'
import { Answer } from '../../enterprise/entities/answer.entity'
import { AnswersRepository } from '../repositories/answers.repository'
import { Either, right } from '@/core/either'

interface AnswerQuestionUseCaseRequest {
  instructorId: string
  questionId: string
  content: string
}

type AnswerQuestionUseCaseRespinse = Either<
  null,
  {
    answer: Answer
  }
>

export class AnswerQuestionUseCase {
  constructor(private readonly answersRepository: AnswersRepository) {}

  async execute({ instructorId, questionId, content }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseRespinse> {
    const answer = Answer.create({
      content,
      authorId: new UniqueEntityId(instructorId),
      questionId: new UniqueEntityId(questionId),
    })
    await this.answersRepository.create(answer)
    return right({ answer })
  }
}
