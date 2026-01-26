import {
  ActorRefFromLogic,
  assign,
  createActor,
  createMachine,
  setup,
} from '../../src/index.ts';

describe('actor.stop()', () => {
  it('should throw an error if called on a child actor directly', () => {
    const expectedErrorMessage = 'A non-root actor cannot be stopped directly.';

    const childMachine = createMachine({});

    const parentMachine = setup({
      types: {
        context: {} as {
          childActorRef: ActorRefFromLogic<typeof childMachine>;
        },
        events: {} as { type: 'stopChild' },
      },
    }).createMachine({
      context: {
        childActorRef: {} as ActorRefFromLogic<typeof childMachine>,
      },
      entry: [
        assign({
          childActorRef: ({ spawn }) => spawn(childMachine),
        }),
      ],
      on: {
        stopChild: {
          actions: [
            ({ context }) => {
              context.childActorRef.stop(); // This should throw an error
            },
          ],
        },
      },
    });
    const parentActor = createActor(parentMachine);

    const errorMessages: string[] = [];
    const subscription = parentActor.subscribe({
      error: (err) => {
        console.log('Caught error from parent actor:', err);
        if (err instanceof Error) {
          errorMessages.push(err.message);
        }
      },
    });

    parentActor.start();
    parentActor.send({ type: 'stopChild' });

    expect(errorMessages.length).toBe(1);
    expect(errorMessages[0]).toBe(expectedErrorMessage);

    const { status, error } = parentActor.getSnapshot();
    expect(status).toBe('error');
    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toBe(expectedErrorMessage);

    subscription.unsubscribe();
  });
});
