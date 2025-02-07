import { Either, right } from '@/core/either'
import { Answer } from '../../enterprise/entities/answer.entity'
import { AnswersRepository } from '../repositories/answers.repository'

interface FetchQuestionAnswersCaseRequest {
  questionId: string
  page: number
}

type FetchQuestionAnswersCaseResponse = Either<
  null,
  {
    answers: Answer[]
  }
>

export class FetchQuestionAnswersCase {
  constructor(private readonly questionRepository: AnswersRepository) {}

  async execute({ questionId, page }: FetchQuestionAnswersCaseRequest): Promise<FetchQuestionAnswersCaseResponse> {
    const answers = await this.questionRepository.findManyByQuestioId(questionId, { page })
    return right({ answers })
  }
}
