import { makeHostAppObjectRepo } from '../../../HostAppObject';
import { makeDialogQueue } from '../Entities/DialogQueue';
import { activeDialogHasClosed } from './activeDialogHasClosed';

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const queue = makeDialogQueue(appObjects.getOrCreate('Dialog'));

  const mockClose = jest.fn();
  queue.activeDialogHasClosed = mockClose;

  return { mockClose, queue, appObjects };
}

describe('Active Dialog Has Closed Controller', () => {
  it('Calls the Entity', () => {
    const { mockClose, appObjects } = makeTestRig();

    activeDialogHasClosed(appObjects);

    expect(mockClose).toBeCalled();
  });

  it('Warns if it cannot find the entity', () => {
    const appObjects = makeHostAppObjectRepo();
    appObjects.submitWarning = jest.fn();

    activeDialogHasClosed(appObjects);

    expect(appObjects.submitWarning).toBeCalled();
  });
});
