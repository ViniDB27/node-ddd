import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question.repository'
import { makeQuestion } from 'test/factories/make-questio'
import { UniqueEntityId } from '@/core/vos/unique-entity-id.vo'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers.repository'
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer.usecase'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments.repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments.repository'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

describe('Choose Question Best Answer Use Case', async () => {
  let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
  let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
  let questionsRepository: InMemoryQuestionRepository
  let answersRepository: InMemoryAnswersRepository
  let sut: ChooseQuestionBestAnswerUseCase

  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionsRepository = new InMemoryQuestionRepository(questionAttachmentsRepository)
    answersRepository = new InMemoryAnswersRepository(answerAttachmentsRepository)
    sut = new ChooseQuestionBestAnswerUseCase(questionsRepository, answersRepository)
  })

  it('shold be able to choose the best enswer', async () => {
    const createQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('question-1'),
    )
    const createAnswer = makeAnswer(
      {
        authorId: new UniqueEntityId('author-2'),
        questionId: new UniqueEntityId('question-1'),
      },
      new UniqueEntityId('answer-1'),
    )
    await questionsRepository.create(createQuestion)
    await answersRepository.create(createAnswer)
    const result = await sut.execute({
      authorId: 'author-1',
      answerId: createAnswer.id.toString(),
    })
    expect(result.isRight()).toEqual(true)
  })

  it('shold not be able to choose the best enswer from another user', async () => {
    const createQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('question-1'),
    )
    const createAnswer = makeAnswer(
      {
        authorId: new UniqueEntityId('author-2'),
        questionId: new UniqueEntityId('question-1'),
      },
      new UniqueEntityId('answer-1'),
    )
    await questionsRepository.create(createQuestion)
    await answersRepository.create(createAnswer)
    const result = await sut.execute({
      authorId: 'author-2',
      answerId: createAnswer.id.toString(),
    })
    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('shold be able to choose the best enswer with wrong id', async () => {
    const result = await sut.execute({
      authorId: 'wrong-id',
      answerId: 'wrong-id',
    })
    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
