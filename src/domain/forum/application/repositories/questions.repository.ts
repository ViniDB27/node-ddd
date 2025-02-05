import { PaginateParams } from "@/core/repositories/pagination-params";
import { Question } from "../../enterprise/entities/question.entity";

export interface QuestionRepository {
  create(question: Question): Promise<void>
  update(question: Question): Promise<void>
  delete(question: Question): Promise<void>
  findById(questionId: string): Promise<Question | null>
  findBySlug(slug: string): Promise<Question | null>
  findManyRecent(params: PaginateParams): Promise<Question[]>
}