import { Slug } from './slug.vo'

describe('Slug Vo', async () => {
  it('should be able to create a new slug instance', () => {
    const slug = Slug.create('an-example-slug')
    expect(slug.value).toEqual('an-example-slug')
  })

  it('should be able to create a new slug instance wiht create static method', () => {
    const slug = Slug.createFromText('An Example Slug')
    expect(slug.value).toEqual('an-example-slug')
  })
})
