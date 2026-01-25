import {
  ActorLogic,
  ActorRef,
  ActorRefFrom,
  AnyActorRef,
  EventObject,
  Observer,
  Snapshot,
  setup,
  Subscribable,
  createActor,
  createMachine,
  waitFor,
  stopChild,
  assign
} from '../../src/index.ts';

describe('stopChild action', () => {
  it('should throw an error if trying to stop an actor that is not a child', async () => {
    const machine1 = setup({
      actions: {
        STOP_CHILD: (_, params: { target: AnyActorRef }) =>
          stopChild(params.target)
      }
    }).createMachine({
      id: 'machine1',
      initial: 'active',
      states: {
        active: {}
      }
    });
    const actor1 = createActor(machine1);
    actor1.start();

    const machine2 = createMachine({
      id: 'machine2',
      initial: 'active',
      states: {
        active: {}
      }
    });
    const actor2 = createActor(machine2); // Not spawned by actor1
    actor2.start();

    expect(() =>
      actor1.send({
        type: 'STOP_CHILD',
        target: actor2
      })
    ).toThrowError(
      `Cannot stop child actor ${actor2.id} of ${actor1.id} because it is not a child`
    );
  });
});
