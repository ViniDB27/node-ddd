import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question.repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug.usecase'
import { makeQuestion } from 'test/factories/make-questio'
import { Question } from '../../enterprise/entities/question.entity'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments.repository'
import { Slug } from '../../enterprise/vos/slug.vo'

describe('Get Questio By Slug Use Case', async () => {
  let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
  let questionsRepository: InMemoryQuestionRepository
  let sut: GetQuestionBySlugUseCase

  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionsRepository = new InMemoryQuestionRepository(questionAttachmentsRepository)
    sut = new GetQuestionBySlugUseCase(questionsRepository)
  })

  it('shold be able to get a question by slug', async () => {
    const createQuestion = makeQuestion({
      slug: Slug.create('example-question'),
    })
    await questionsRepository.create(createQuestion)
    const result = await sut.execute({ slug: 'example-question' })
    expect(result.isRight()).toEqual(true)
    expect(questionsRepository.items[0]).toEqual(
      (
        result.value as {
          question: Question
        }
      ).question,
    )
  })
})
