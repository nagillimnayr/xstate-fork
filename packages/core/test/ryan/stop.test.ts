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
    const errorSpy = vi.fn();
    const subscription = parentActor.subscribe({
      error: errorSpy,
    });

    parentActor.start();
    parentActor.send({ type: 'stopChild' });

    expect(errorSpy).toHaveBeenCalledTimes(1);
    const errorCallArg = errorSpy.mock.calls[0][0];
    expect(errorCallArg).toBeInstanceOf(Error);
    expect((errorCallArg as Error).message).toBe(expectedErrorMessage);

    const { status, error } = parentActor.getSnapshot();
    expect(status).toBe('error');
    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toBe(expectedErrorMessage);

    subscription.unsubscribe();
  });
});
