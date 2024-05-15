import { makeHostAppObjectRepo } from '../../../HostAppObject';
import { DialogSpinnerEntity, spinnerDialogType, DialogSpinnerDTO } from './DialogSpinner';

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const ao = appObjects.getOrCreate('dialog1');

  const dto: DialogSpinnerDTO = {
    message: 'a message',
    title: 'title',
  };

  const spinner = new DialogSpinnerEntity(dto, ao);
  const observer = jest.fn();
  spinner.addChangeObserver(observer);

  return { spinner, observer, appObjects };
}

describe('Spinner Dialog', () => {
  it('Notifies when the message changes', () => {
    const { spinner, observer } = makeTestRig();

    spinner.message = 'A new message';

    expect(spinner.message).toEqual('A new message');
    expect(observer).toBeCalled();
  });

  it('Closes if it has been alive long enough', () => {
    const { spinner, observer } = makeTestRig();

    const mockTime = jest.fn();
    Date.now = mockTime;
    mockTime.mockReturnValue(0);

    spinner.isOpen = true;
    observer.mockClear();

    mockTime.mockReturnValue(spinner.mininumuLifespan + 1);

    spinner.close();

    expect(spinner.isOpen).toEqual(false);
    expect(observer).toBeCalled();
  });

  it("Doesn't close until the min lifespan has passed", () => {
    jest.useFakeTimers();
    const { spinner, observer } = makeTestRig();

    const mockTime = jest.fn();
    Date.now = mockTime;
    mockTime.mockReturnValue(0);

    spinner.isOpen = true;
    observer.mockClear();

    mockTime.mockReturnValue(0.5 * spinner.mininumuLifespan);

    spinner.close();

    expect(spinner.isOpen).toEqual(true);
    expect(observer).not.toBeCalled();

    jest.advanceTimersByTime(0.5 * spinner.mininumuLifespan);

    expect(spinner.isOpen).toEqual(false);
    expect(observer).toBeCalled();
  });

  it('Bases the lifespan on when it was opened', () => {
    jest.useFakeTimers();
    const { spinner, observer } = makeTestRig();
    observer.mockClear();

    const mockTime = jest.fn();
    Date.now = mockTime;
    mockTime.mockReturnValue(2 * spinner.mininumuLifespan);

    expect(observer).not.toBeCalled();

    spinner.isOpen = true;
    observer.mockClear();

    mockTime.mockReturnValue(2.5 * spinner.mininumuLifespan);

    spinner.close();

    expect(spinner.isOpen).toEqual(true);
    expect(observer).not.toBeCalled();

    jest.advanceTimersByTime(0.5 * spinner.mininumuLifespan);

    expect(spinner.isOpen).toEqual(false);
    expect(observer).toBeCalled();
  });

  it('Disable outside dismiss', () => {
    const { spinner } = makeTestRig();

    expect(spinner.preventOutsideDismiss).toEqual(true);
  });

  it('Sets the dialog type', () => {
    const { spinner } = makeTestRig();

    expect(spinner.dialogType).toEqual(spinnerDialogType);
  });

  it('Notifies when the is open flag changes', () => {
    const { spinner, observer } = makeTestRig();

    spinner.isOpen = true;

    observer.mockClear();

    spinner.isOpen = true;
    spinner.isOpen = true;
    spinner.isOpen = true;

    expect(observer).not.toBeCalled();

    spinner.isOpen = false;
    spinner.isOpen = false;
    spinner.isOpen = false;

    expect(observer).toBeCalledTimes(1);

    spinner.isOpen = true;
    spinner.isOpen = true;
    spinner.isOpen = true;

    expect(observer).toBeCalledTimes(2);
  });

  it('Warns if it cannot find the app object by ID when getting', () => {
    const { appObjects } = makeTestRig();

    appObjects.submitWarning = jest.fn();

    DialogSpinnerEntity.get('unknownID', appObjects);

    expect(appObjects.submitWarning).toBeCalled();
  });

  it('Warns if the App Object does not have the UC when getting', () => {
    const { appObjects } = makeTestRig();

    appObjects.submitWarning = jest.fn();

    appObjects.getOrCreate('anAppObject');
    DialogSpinnerEntity.get('anAppObject', appObjects);

    expect(appObjects.submitWarning).toBeCalled();
  });

  it('Returns the UC when getting', () => {
    const { appObjects, spinner } = makeTestRig();

    const returnedUC = DialogSpinnerEntity.get('dialog1', appObjects);

    expect(returnedUC).toEqual(spinner);
  });
});
