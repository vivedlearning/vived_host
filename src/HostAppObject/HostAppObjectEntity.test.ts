import { HostAppObject, makeAppObject } from './HostAppObject';
import { HostAppObjectEntity } from './HostAppObjectEntity';
import { makeAppObjectRepo } from './HostAppObjectRepo';

class MockEntity extends HostAppObjectEntity {
  static type = 'mockEntity';

  constructor(appObject: HostAppObject) {
    super(appObject, MockEntity.type);
  }
}

function makeTestRig() {
  const appObjectRepo = makeAppObjectRepo();
  const appObj = makeAppObject('appObj', appObjectRepo);
  const appObjectEntity = new MockEntity(appObj);

  const onChangeObserver = jest.fn();
  appObjectEntity.addChangeObserver(onChangeObserver);

  return { appObjectEntity, onChangeObserver, appObj, appObjectRepo };
}

describe('Abstract Observable Entity', () => {
  it('Sets the type', () => {
    const { appObjectEntity } = makeTestRig();
    expect(appObjectEntity.type).toEqual('mockEntity');
  });

  it('Notifies on change', () => {
    const { onChangeObserver, appObjectEntity } = makeTestRig();
    appObjectEntity.notifyOnChange();

    expect(onChangeObserver).toBeCalled();
  });

  it('Removes an on change onChangeObserver', () => {
    const { onChangeObserver, appObjectEntity } = makeTestRig();
    appObjectEntity.removeChangeObserver(onChangeObserver);
    appObjectEntity.notifyOnChange();

    expect(onChangeObserver).not.toBeCalled();
  });

  it('Notifies when disposed', () => {
    const { appObjectEntity } = makeTestRig();
    const disposeObserver = jest.fn();
    appObjectEntity.addOnDisposeObserver(disposeObserver);

    appObjectEntity.dispose();

    expect(disposeObserver).toBeCalled();
  });

  it('Removes a dispose onChangeObserver', () => {
    const { appObjectEntity } = makeTestRig();
    const disposeObserver = jest.fn();
    appObjectEntity.addOnDisposeObserver(disposeObserver);
    appObjectEntity.removeOnDisposeObserver(disposeObserver);

    appObjectEntity.dispose();
    expect(disposeObserver).not.toBeCalled();
  });

  it('Clears all observers when disposed', () => {
    const { onChangeObserver, appObjectEntity } = makeTestRig();
    const disposeObserver = jest.fn();
    appObjectEntity.addOnDisposeObserver(disposeObserver);

    appObjectEntity.dispose();

    disposeObserver.mockClear();
    onChangeObserver.mockClear();

    appObjectEntity.notifyOnChange();
    appObjectEntity.dispose();

    expect(onChangeObserver).not.toBeCalled();
    expect(disposeObserver).not.toBeCalled();
  });

  it('Stores the app object', () => {
    const { appObjectEntity, appObj } = makeTestRig();
    expect(appObjectEntity.appObject).toEqual(appObj);
  });

  it('Adds itself to the app object', () => {
    const { appObjectEntity, appObj } = makeTestRig();

    expect(appObj.hasComponent(appObjectEntity.type)).toEqual(true);
  });

  it('Removes itself from the app object when disposed', () => {
    const { appObjectEntity, appObj } = makeTestRig();

    appObjectEntity.dispose();

    expect(appObj.hasComponent(appObjectEntity.type)).toEqual(false);
  });

  it('Forwards notifications to the App Object observers', () => {
    const { appObjectEntity, appObj } = makeTestRig();

    const appObjObserver = jest.fn();
    appObj.addObserver(appObjObserver);

    appObjectEntity.notifyOnChange();

    expect(appObjObserver).toBeCalled();
  });

  it('Stops forwarding notifications to the App Object observers when disposed', () => {
    const { appObjectEntity, appObj } = makeTestRig();

    const appObjObserver = jest.fn();
    appObj.addObserver(appObjObserver);

    appObjectEntity.dispose();
    appObjObserver.mockClear();

    appObjectEntity.notifyOnChange();

    expect(appObjObserver).not.toBeCalled();
  });

  it('Returns the repo', () => {
    const { appObjectEntity, appObjectRepo } = makeTestRig();
    expect(appObjectEntity.appObjects).toEqual(appObjectRepo);
  });

  it('Forwards a warn to the App Object Repo warn', () => {
    const { appObjectEntity, appObjectRepo } = makeTestRig();
    appObjectRepo.submitWarning = jest.fn();

    appObjectEntity.warn('Some warning');

    expect(appObjectRepo.submitWarning).toBeCalledWith(`appObj/mockEntity`, 'Some warning');
  });
});
