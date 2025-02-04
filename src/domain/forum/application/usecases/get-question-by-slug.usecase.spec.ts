import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question.repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug.usecsae'
import { Slug } from '@/domain/vos/slug.vo'
import { makeQuestion } from 'test/factories/make-questio'

describe('Get Questio By Slug Use Case', async () => {
  let questionsRepository: InMemoryQuestionRepository
  let sut: GetQuestionBySlugUseCase

  beforeEach(() => {
    questionsRepository = new InMemoryQuestionRepository()
    sut = new GetQuestionBySlugUseCase(questionsRepository)
  })

  it('shold be able to get a question by slug', async () => {
    const createQuestion = makeQuestion({
      slug: Slug.create('example-question'),
    })
    await questionsRepository.create(createQuestion)
    const { question } = await sut.execute({ slug: 'example-question' })

    expect(question.id.toValue).toEqual(createQuestion.id.toValue)
    expect(question.title).toEqual(createQuestion.title)
    expect(question.slug.value).toEqual(createQuestion.slug.value)
  })
})
