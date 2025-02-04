import { QuestionRepository } from '@/domain/forum/application/repositories/questions.repository'
import { Question } from '@/domain/forum/enterprise/entities/question.entity'

export class InMemoryQuestionRepository implements QuestionRepository {
  public intems: Question[] = []

  async create(question: Question) {
    this.intems.push(question)
  }
}
