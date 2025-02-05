import { Question } from '../../enterprise/entities/question.entity'
import { QuestionRepository } from '../repositories/questions.repository'

interface FetchRecentQuestionsCaseRequest {
  page: number
}

interface FetchRecentQuestionsCaseResponse {
  questions: Question[]
}

export class FetchRecentQuestionsCase {
  constructor(private readonly questionRepository: QuestionRepository) {}

  async execute({
    page,
  }: FetchRecentQuestionsCaseRequest): Promise<FetchRecentQuestionsCaseResponse> {
    const questions = await this.questionRepository.findManyRecent({ page })
    return {
      questions,
    }
  }
}
