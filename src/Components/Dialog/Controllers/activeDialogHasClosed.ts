import { HostAppObjectRepo } from '../../../HostAppObject';
import { DialogQueue } from '../Entities';

export function activeDialogHasClosed(appObjects: HostAppObjectRepo) {
  const dialogQueue = DialogQueue.get(appObjects);
  if (dialogQueue) {
    dialogQueue.activeDialogHasClosed();
  } else {
    appObjects.submitWarning('activeDialogHasClosed', 'Unable to find DialogQueue');
  }
}
