import { AnswersRepository } from '@/domain/forum/application/repositories/answers.repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer.entity'

export class InMemoryAnswersRepository implements AnswersRepository {
  public intems: Answer[] = []

  async create(answer: Answer) {
    this.intems.push(answer)
  }

  async update(answer: Answer) {
    const itemIndex = this.intems.findIndex((item) => item.id === answer.id)
    this.intems[itemIndex] = answer
  }

  async delete(answer: Answer) {
    const itemIndex = this.intems.findIndex((item) => item.id === answer.id)
    this.intems.splice(itemIndex, 1)
  }

  async findById(answerId: string) {
    return (
      this.intems.find((item) => item.id.toString() === answerId) ??
      null
    )
  }
}
