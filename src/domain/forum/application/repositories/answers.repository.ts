import { Answer } from "../../enterprise/entities/answer.entity";

export interface AnswersRepository {
  create(answer: Answer): Promise<void>
}