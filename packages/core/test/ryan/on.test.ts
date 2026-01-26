import { createActor, emit, setup } from '../../src/index.ts';

describe('actor.on(…)', () => {
  it('should allow listeners to be unsubscribed', async () => {
    const machine = setup({
      types: {
        emitted: {} as { type: 'emitted' },
      },
    }).createMachine({
      on: {
        emitEvent: {
          actions: emit({ type: 'emitted' }),
        },
      },
    });

    const actor = createActor(machine);

    let count = 0;
    const subscription = actor.on('emitted', () => {
      count++;
    });

    actor.start();

    actor.send({ type: 'emitEvent' });
    expect(count).toBe(1);

    actor.send({ type: 'emitEvent' });
    expect(count).toBe(2);

    subscription.unsubscribe?.();

    actor.send({ type: 'emitEvent' });
    expect(count).toBe(2); // count should not have increased
  });
});
