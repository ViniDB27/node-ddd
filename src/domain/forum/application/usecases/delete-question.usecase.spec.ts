import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question.repository'
import { DeleteQuestionUseCase } from './delete-question.usecsae'
import { makeQuestion } from 'test/factories/make-questio'
import { UniqueEntityId } from '@/core/vos/unique-entity-id.vo'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments.repository'
import { makeQuestionAttachments } from 'test/factories/make-question-attachments'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

describe('Delete Question Use Case', async () => {
  let questionsRepository: InMemoryQuestionRepository
  let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
  let sut: DeleteQuestionUseCase

  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionsRepository = new InMemoryQuestionRepository(questionAttachmentsRepository)
    sut = new DeleteQuestionUseCase(questionsRepository)
  })

  it('shold be able to delete a question', async () => {
    const createQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('question-1'),
    )
    await questionsRepository.create(createQuestion)
        questionAttachmentsRepository.items.push(makeQuestionAttachments({ questionId: createQuestion.id, attachmentId: new UniqueEntityId('1') }))
        questionAttachmentsRepository.items.push(makeQuestionAttachments({ questionId: createQuestion.id, attachmentId: new UniqueEntityId('2') }))
    await sut.execute({
      authorId: 'author-1',
      questionId: 'question-1',
    })
    expect(questionsRepository.items).toHaveLength(0)
    expect(questionAttachmentsRepository.items).toHaveLength(0)
  })

  it('shold not be able to delete a question from another user', async () => {
    const createQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('question-1'),
    )
    await questionsRepository.create(createQuestion)
    const result = await sut.execute({
      authorId: 'author-2',
      questionId: 'question-1',
    })
    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('shold be able to delete a question with wrong id', async () => {
    const result = await sut.execute({
      authorId: 'wrong-id',
      questionId: 'wrong-id',
    })
    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
