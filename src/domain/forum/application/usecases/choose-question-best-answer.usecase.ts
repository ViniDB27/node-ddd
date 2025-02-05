import { UniqueEntityId } from '@/core/vos/unique-entity-id.vo'
import { Question } from '../../enterprise/entities/question.entity'
import { QuestionRepository } from '../repositories/questions.repository'
import { AnswersRepository } from '../repositories/answers.repository'

interface ChooseQuestionBestAnswerUseCaseRequest {
  authorId: string
  answerId: string
}

interface ChooseQuestionBestAnswerUseCaseResponse {
  question: Question
}

export class ChooseQuestionBestAnswerUseCase {
  constructor(
    private readonly questionRepository: QuestionRepository,
    private readonly answersRepository: AnswersRepository,
  ) {}

  async execute({
    authorId,
    answerId,
  }: ChooseQuestionBestAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) throw new Error('Answer not found')

    const question = await this.questionRepository.findById(
      answer.questionId.toString(),
    )

    if (!question) throw new Error('Question not found')

    if (authorId !== question.authorId.toString())
      throw new Error('Not allowed')

    question.bestAnswerId = new UniqueEntityId(answerId)

    await this.questionRepository.update(question)

    return {
      question: question,
    }
  }
}
