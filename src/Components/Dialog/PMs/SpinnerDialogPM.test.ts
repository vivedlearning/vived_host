import { makeHostAppObjectRepo } from '../../../HostAppObject';
import { SpinnerDialogEntity, DialogSpinnerDTO } from '../Entities';
import { SpinnerDialogPM, SpinnerDialogVM } from './SpinnerDialogPM';

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const ao = appObjects.getOrCreate('dialog1');

  const dto: DialogSpinnerDTO = {
    message: 'a message',
    title: 'title',
  };
  const dialog = new SpinnerDialogEntity(dto, ao);
  const pm = new SpinnerDialogPM(ao);

  return { pm, dialog, appObjects };
}

describe('Spinner Dialog PM', () => {
  it('Initializes the last vm', () => {
    const { pm } = makeTestRig();
    expect(pm.lastVM).not.toBeUndefined();
  });

  it('Warns if it cannot find the app object by ID when getting', () => {
    const { appObjects } = makeTestRig();

    appObjects.submitWarning = jest.fn();

    SpinnerDialogPM.get('unknownID', appObjects);

    expect(appObjects.submitWarning).toBeCalled();
  });

  it('Warns if the App Object does not have the UC when getting', () => {
    const { appObjects } = makeTestRig();

    appObjects.submitWarning = jest.fn();

    appObjects.getOrCreate('anAppObject');
    SpinnerDialogPM.get('anAppObject', appObjects);

    expect(appObjects.submitWarning).toBeCalled();
  });

  it('Returns the PM when getting', () => {
    const { appObjects, pm } = makeTestRig();

    const returnedPM = SpinnerDialogPM.get('dialog1', appObjects);

    expect(returnedPM).toEqual(pm);
  });

  it('Checks for equal VMs', () => {
    const { pm } = makeTestRig();

    const vm1: SpinnerDialogVM = {
      message: 'a message',
      title: 'a title',
    };

    const vm2 = { ...vm1 };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(true);
  });

  it('Checks for a change in the message', () => {
    const { pm } = makeTestRig();

    const vm1: SpinnerDialogVM = {
      message: 'a message',
      title: 'a title',
    };

    const vm2 = { ...vm1, message: 'Something Else' };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it('Checks for a change in the title', () => {
    const { pm } = makeTestRig();

    const vm1: SpinnerDialogVM = {
      message: 'a message',
      title: 'a title',
    };

    const vm2 = { ...vm1, title: 'Something Else' };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it('Sets up the vm from the entity', () => {
    const { pm, dialog } = makeTestRig();

    expect(pm.lastVM?.message).toEqual(dialog.message);
    expect(pm.lastVM?.title).toEqual(dialog.title);
  });
});
