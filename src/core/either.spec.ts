import { Either, Left, left, Right, right } from './either'

function foSomething(shouldSuccess: boolean): Either<string, number> {
  if (shouldSuccess) {
    return right(10)
  }
  return left('error')
}

test('success result', () => {
  const sucessResult = foSomething(true)
  expect(sucessResult.value).toEqual(10)
  expect(sucessResult.isRight()).toBeTruthy()
  expect(sucessResult.isLeft()).toBeFalsy()
  expect(sucessResult).instanceOf(Right)
})

test('error result', () => {
  const errorResult = foSomething(false)
  expect(errorResult.value).toEqual('error')
  expect(errorResult.isRight()).toBeFalsy()
  expect(errorResult.isLeft()).toBeTruthy()
  expect(errorResult).instanceOf(Left)
})
