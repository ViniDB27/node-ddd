import { Answer } from '../../enterprise/entities/answer.entity'

export interface AnswersRepository {
  create(answer: Answer): Promise<void>
  update(answer: Answer): Promise<void>
  delete(answer: Answer): Promise<void>
  findById(answerId: string): Promise<Answer | null>
}
