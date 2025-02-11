import { AggregateRoot } from '../entities/aggregate-root'
import { UniqueEntityId } from '../vos/unique-entity-id.vo'
import { DomainEvent } from './domain-event'
import { DomainEvents } from './domain-events'

class CustomAggrageteCreated implements DomainEvent {
  public ocurredAt: Date
  private readonly aggregate: CustomAggragete

  constructor(aggregate: CustomAggragete) {
    this.ocurredAt = new Date()
    this.aggregate = aggregate
  }

  public getAggregateId(): UniqueEntityId {
    return this.aggregate.id
  }
}

class CustomAggragete extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggragete(null)
    aggregate.addDomainEvents(new CustomAggrageteCreated(aggregate))
    return aggregate
  }
}

describe('Domain Events', async () => {
  it('should be able to dispatch and listen to events', async () => {
    const callbackSpy = vi.fn()
    DomainEvents.register(callbackSpy, CustomAggrageteCreated.name)
    const aggregate = CustomAggragete.create()
    expect(aggregate.domainEvents).toHaveLength(1)
    expect(callbackSpy).not.toHaveBeenCalled()
    DomainEvents.dispatchEventsForAggregate(aggregate.id)
    expect(aggregate.domainEvents).toHaveLength(0)
    expect(callbackSpy).toHaveBeenCalled()
  })
})
