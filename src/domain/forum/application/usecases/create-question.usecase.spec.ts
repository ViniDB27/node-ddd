import { UniqueEntityId } from '@/core/vos/unique-entity-id.vo'
import { CreateQuestionUseCase } from './create-question.usecsae'
import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question.repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments.repository'

describe('Create Question Use Case', async () => {
  let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
  let questionsRepository: InMemoryQuestionRepository
  let sut: CreateQuestionUseCase

  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionsRepository = new InMemoryQuestionRepository(questionAttachmentsRepository)
    sut = new CreateQuestionUseCase(questionsRepository)
  })

  it('shold be able to create a question', async () => {
    const result = await sut.execute({
      authorId: '1',
      title: 'new question',
      content: 'new question content',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isRight()).toEqual(true)
    expect(questionsRepository.items[0]).toEqual(result.value?.question)
    expect(questionsRepository.items[0].attachments.currentItems).toHaveLength(2)
    expect(questionsRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('2') }),
    ])
  })
})
