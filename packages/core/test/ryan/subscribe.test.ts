import { createActor, setup } from '../../src/index.ts';

describe('actor.subscribe(…)', () => {
  it('should notify the error observer when subscribed to an actor that is stopped but has an `error` status', async () => {
    const errorSpy = vi.fn();

    const machine = setup({
      types: {
        events: {} as { type: 'throwErrorEvent' },
      },
      actions: {
        throwError: () => {
          throw new Error('Test Error');
        },
      },
    }).createMachine({
      on: {
        throwErrorEvent: {
          actions: ['throwError'],
        },
      },
    });

    const actor = createActor(machine);

    const subscription = actor.subscribe({
      error: errorSpy,
    });

    actor.start();
    actor.send({ type: 'throwErrorEvent' });

    expect(errorSpy).toHaveBeenCalledTimes(1);
    subscription.unsubscribe?.();

    actor.stop();

    actor.subscribe({
      error: errorSpy,
    });

    // The error observer should be called immediately upon subscription since the actor is stopped with an error
    expect(errorSpy).toHaveBeenCalledTimes(2);
  });
});
