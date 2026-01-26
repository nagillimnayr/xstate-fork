import { ProcessingStatus } from '../../src/createActor.ts';
import {
  AnyActorRef,
  createActor,
  createMachine,
  setup,
  stopChild,
} from '../../src/index.ts';

describe('stopChild Action', () => {
  it('should throw an error if trying to stop an actor that is not a child', async () => {
    const actor1 = createActor(createMachine({})).start();
    const machine = setup({
      types: {
        events: {} as { type: 'stopChildEvent'; actorRef: AnyActorRef },
      },
    }).createMachine({
      context: { actorRef: actor1 },
      on: {
        stopChildEvent: {
          actions: stopChild(({ event }) => event.actorRef),
        },
      },
    });

    const actor2 = createActor(machine, {
      input: { actorRef: actor1 },
    }).start();

    const expectedErrorMessage = `Cannot stop child actor ${actor1.id} of ${actor2.id} because it is not a child`;

    const errorSpy = vi.fn();
    // Catch unhandled errors from actor2
    const subscription = actor2.subscribe({
      error: errorSpy,
    });

    actor2.send({ type: 'stopChildEvent', actorRef: actor1 });

    const { status, error } = actor2.getSnapshot();
    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(status).toBe('error');
    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toBe(expectedErrorMessage);

    // Make sure actor1 is still running
    expect(actor1.getSnapshot().status).not.toBe(ProcessingStatus.Stopped);

    subscription.unsubscribe();
  });
});
