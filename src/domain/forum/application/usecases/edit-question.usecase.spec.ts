import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question.repository'
import { makeQuestion } from 'test/factories/make-questio'
import { UniqueEntityId } from '@/core/vos/unique-entity-id.vo'
import { EditQuestionUseCase } from './edit-question.usecase'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments.repository'
import { makeQuestionAttachments } from 'test/factories/make-question-attachments'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

describe('Edit Question Use Case', async () => {
  let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
  let questionsRepository: InMemoryQuestionRepository
  let sut: EditQuestionUseCase

  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionsRepository = new InMemoryQuestionRepository(questionAttachmentsRepository)
    sut = new EditQuestionUseCase(questionsRepository, questionAttachmentsRepository)
  })

  it('shold be able to edit a question', async () => {
    const createQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('question-1'),
    )
    await questionsRepository.create(createQuestion)
    questionAttachmentsRepository.items.push(makeQuestionAttachments({ questionId: createQuestion.id, attachmentId: new UniqueEntityId('1') }))
    questionAttachmentsRepository.items.push(makeQuestionAttachments({ questionId: createQuestion.id, attachmentId: new UniqueEntityId('2') }))
    const result = await sut.execute({
      authorId: 'author-1',
      questionId: 'question-1',
      title: 'new title',
      content: 'new content',
      attachmentsIds: ['1', '3'],
    })
    expect(result.isRight()).toEqual(true)
    expect(questionsRepository.items[0].attachments.currentItems).toHaveLength(2)
    expect(questionsRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
    ])
  })

  it('shold not be able to edit a question from another user', async () => {
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
      title: 'new title',
      content: 'new content',
      attachmentsIds: [],
    })
    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('shold be able to edit a question with wrong id', async () => {
    const result = await sut.execute({
      authorId: 'wrong-id',
      questionId: 'wrong-id',
      title: 'new title',
      content: 'new content',
      attachmentsIds: [],
    })
    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
