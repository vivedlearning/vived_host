import { makeHostAppObjectRepo } from '../../../HostAppObject';
import { MockHostDispatchEntity } from '../Mocks/MockHostDispatcher';
import { DispatchStopAppUC, makeDispatchStopAppUC } from './DispatchStopAppUC';

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const ao = appObjects.getOrCreate("AO");
  const mockDispatcher = new MockHostDispatchEntity(ao);

  const uc = makeDispatchStopAppUC(ao);

  return { uc, appObjects, mockDispatcher };
}

describe('Dispatch Stop App', () => {
  it('Gets the UC', () => {
    const { uc } = makeTestRig();

    expect(DispatchStopAppUC.get(uc.appObject)).toEqual(uc);
  });

  it('Dispatches the correct type', () => {
    const { uc, mockDispatcher } = makeTestRig();

    uc.doDispatch();

    expect(mockDispatcher.formRequestAndDispatch).toBeCalledTimes(1);
    expect(mockDispatcher.formRequestAndDispatch.mock.calls[0][0]).toEqual('STOP_APP');
  });

  it('Dispatches the correct version', () => {
    const { uc, mockDispatcher } = makeTestRig();

    uc.doDispatch();

    expect(mockDispatcher.formRequestAndDispatch).toBeCalledTimes(1);
    expect(mockDispatcher.formRequestAndDispatch.mock.calls[0][1]).toEqual(1);
  });

  it("Warns if it cannot find the app object when getting by ID", () => {
    const { appObjects } = makeTestRig();

    appObjects.submitWarning = jest.fn();

    DispatchStopAppUC.getByID("someID", appObjects);
    expect(appObjects.submitWarning).toBeCalled();
  });

  it("Warns if that App Object does not have the UC", () => {
    const { appObjects } = makeTestRig();

    appObjects.getOrCreate("someID");
    appObjects.submitWarning = jest.fn();

    DispatchStopAppUC.getByID("someID", appObjects);
    expect(appObjects.submitWarning).toBeCalled();
  });

  it("Gets by ID", () => {
    const { appObjects, uc } = makeTestRig();

    expect(DispatchStopAppUC.getByID(uc.appObject.id, appObjects)).toEqual(uc);
  });
});
