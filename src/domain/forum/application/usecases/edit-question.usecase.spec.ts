import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question.repository'
import { makeQuestion } from 'test/factories/make-questio'
import { UniqueEntityId } from '@/core/vos/unique-entity-id.vo'
import { EditQuestionUseCase } from './edit-question.usecase'

describe('Edit Question Use Case', async () => {
  let questionsRepository: InMemoryQuestionRepository
  let sut: EditQuestionUseCase

  beforeEach(() => {
    questionsRepository = new InMemoryQuestionRepository()
    sut = new EditQuestionUseCase(questionsRepository)
  })

  it('shold be able to edit a question', async () => {
    const createQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('question-1'),
    )
    await questionsRepository.create(createQuestion)
    const { question } = await sut.execute({
      authorId: 'author-1',
      questionId: 'question-1',
      title: 'new title',
      content: 'new content',
    })

    expect(question.id.toString()).toEqual(createQuestion.id.toString())
    expect(question.title).toEqual('new title')
    expect(question.content).toEqual('new content')
  })

  it('shold not be able to edit a question from another user', async () => {
    const createQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('question-1'),
    )
    await questionsRepository.create(createQuestion)
    await expect(() =>
      sut.execute({
        authorId: 'author-2',
        questionId: 'question-1',
        title: 'new title',
        content: 'new content',
      }),
    ).rejects.instanceOf(Error)
  })

  it('shold be able to edit a question with wrong id', async () => {
    await expect(() =>
      sut.execute({
        authorId: 'wrong-id',
        questionId: 'wrong-id',
        title: 'new title',
        content: 'new content',
      }),
    ).rejects.instanceOf(Error)
  })
})
