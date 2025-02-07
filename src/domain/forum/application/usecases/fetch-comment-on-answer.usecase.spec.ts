import { InMemoryAnswerCommentRepository } from 'test/repositories/in-memory-answer-comments.repository'
import { FetchCommentAnswerUseCase } from './fetch-comment-on-answer.usecase'
import { UniqueEntityId } from '@/core/vos/unique-entity-id.vo'
import { makeAnswerComment } from 'test/factories/make-answer-comment'

describe('Fetch Comment Answer Use Case', async () => {
  let answerCommentsRepository: InMemoryAnswerCommentRepository
  let sut: FetchCommentAnswerUseCase

  beforeEach(() => {
    answerCommentsRepository = new InMemoryAnswerCommentRepository()
    sut = new FetchCommentAnswerUseCase(answerCommentsRepository)
  })

  it('shold be able to fetch comments of the answer', async () => {
    await answerCommentsRepository.create(makeAnswerComment({ answerId: new UniqueEntityId('answer-id') }))
    await answerCommentsRepository.create(makeAnswerComment({ answerId: new UniqueEntityId('answer-id') }))
    await answerCommentsRepository.create(makeAnswerComment({ answerId: new UniqueEntityId('answer-id') }))
    const result = await sut.execute({
      answerId: 'answer-id',
      page: 1,
    })
    expect(result.isRight()).toEqual(true)
    expect(result.value?.answerComments.length).toEqual(3)
    expect(result.value?.answerComments).toEqual([
      expect.objectContaining({
        answerId: new UniqueEntityId('answer-id'),
      }),
      expect.objectContaining({
        answerId: new UniqueEntityId('answer-id'),
      }),
      expect.objectContaining({
        answerId: new UniqueEntityId('answer-id'),
      }),
    ])
  })

  it('shold be able to fetch paginated comments of the answer', async () => {
    for (let i = 1; i <= 22; i++) {
      await answerCommentsRepository.create(makeAnswerComment({ answerId: new UniqueEntityId('answer-id') }))
    }
    const result = await sut.execute({
      answerId: 'answer-id',
      page: 2,
    })
    expect(result.value?.answerComments.length).toEqual(2)
  })
})
