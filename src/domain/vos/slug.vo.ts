export class Slug {
  private readonly _value: string

  constructor(value: string) {
    this._value = value
  }

  get value() {
    return this._value
  }

  static createFromText(text: string) {
    const slugTest = text
      .normalize('NFKD')
      .toLocaleLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/_/g, '')
      .replace(/--/g, '-')
      .replace(/-$/g, '')

    return new Slug(slugTest)
  }
}
