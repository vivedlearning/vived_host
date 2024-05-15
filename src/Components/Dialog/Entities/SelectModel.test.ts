import { makeHostAppObjectRepo } from '../../../HostAppObject';
import { SelectModelDialogEntity, selectModelDialogType } from './SelectModel';

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const ao = appObjects.getOrCreate('dialog1');

  const dialog = new SelectModelDialogEntity(ao);
  const observer = jest.fn();
  dialog.addChangeObserver(observer);

  return { dialog, observer, appObjects };
}

describe('DialogSelectModel Entity', () => {
  it('Disable outside dismiss', () => {
    const { dialog } = makeTestRig();

    expect(dialog.preventOutsideDismiss).toEqual(true);
  });

  it('Sets the dialog type', () => {
    const { dialog } = makeTestRig();

    expect(dialog.dialogType).toEqual(selectModelDialogType);
  });

  it('Notifies when the is open flag changes', () => {
    const { dialog, observer } = makeTestRig();

    dialog.isOpen = true;

    observer.mockClear();

    dialog.isOpen = true;
    dialog.isOpen = true;
    dialog.isOpen = true;

    expect(observer).not.toBeCalled();

    dialog.isOpen = false;
    dialog.isOpen = false;
    dialog.isOpen = false;

    expect(observer).toBeCalledTimes(1);

    dialog.isOpen = true;
    dialog.isOpen = true;
    dialog.isOpen = true;

    expect(observer).toBeCalledTimes(2);
  });

  it('notify when isReady is updated', () => {
    const { dialog, observer } = makeTestRig();
    dialog.isReady = true;
    expect(observer).toBeCalled();
  });

  it('Does not notify when isReady is the same', () => {
    const { dialog, observer } = makeTestRig();
    dialog.isReady = true;
    observer.mockClear();
    dialog.isReady = true;
    expect(observer).not.toBeCalled();
  });

  it('notify when container is set', () => {
    const { dialog, observer } = makeTestRig();
    const mockElement = {} as HTMLElement;
    dialog.container = mockElement;
    observer.mockClear();
    dialog.isReady = true;
    expect(observer).toBeCalled();
  });

  it('Warns if it cannot find the app object by ID when getting', () => {
    const { appObjects } = makeTestRig();

    appObjects.submitWarning = jest.fn();

    SelectModelDialogEntity.get('unknownID', appObjects);

    expect(appObjects.submitWarning).toBeCalled();
  });

  it('Warns if the App Object does not have the UC when getting', () => {
    const { appObjects } = makeTestRig();

    appObjects.submitWarning = jest.fn();

    appObjects.getOrCreate('anAppObject');
    SelectModelDialogEntity.get('anAppObject', appObjects);

    expect(appObjects.submitWarning).toBeCalled();
  });

  it('Returns the entity when getting', () => {
    const { appObjects, dialog } = makeTestRig();

    const returnedEntity = SelectModelDialogEntity.get('dialog1', appObjects);

    expect(returnedEntity).toEqual(dialog);
  });
});
