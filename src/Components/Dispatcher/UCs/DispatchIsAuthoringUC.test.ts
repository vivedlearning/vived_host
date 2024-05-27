import { makeHostAppObjectRepo } from '../../../HostAppObject';
import { MockHostDispatchEntity } from '../Mocks/MockHostDispatcher';
import { DispatchIsAuthoringUC, makeDispatchIsAuthoringUC } from './DispatchIsAuthoringUC';

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const ao = appObjects.getOrCreate("AO");
  const mockDispatcher = new MockHostDispatchEntity(ao);

  const uc = makeDispatchIsAuthoringUC(ao);

  return { uc, appObjects, mockDispatcher };
}

describe('Dispatch is authoring', () => {
  it('Gets the UC', () => {
    const { uc } = makeTestRig();

    expect(DispatchIsAuthoringUC.get(uc.appObject)).toEqual(uc);
  });

  it('Dispatches the correct type', () => {
    const { uc, mockDispatcher } = makeTestRig();

    uc.doDispatch(true);

    expect(mockDispatcher.formRequestAndDispatch).toBeCalledTimes(1);
    expect(mockDispatcher.formRequestAndDispatch.mock.calls[0][0]).toEqual('SET_IS_AUTHORING');
  });

  it('Dispatches the correct version', () => {
    const { uc, mockDispatcher } = makeTestRig();

    uc.doDispatch(true);

    expect(mockDispatcher.formRequestAndDispatch).toBeCalledTimes(1);
    expect(mockDispatcher.formRequestAndDispatch.mock.calls[0][1]).toEqual(1);
  });

  it('Dispatches the show flag', () => {
    const { uc, mockDispatcher } = makeTestRig();

    uc.doDispatch(true);

    expect(mockDispatcher.formRequestAndDispatch).toBeCalledTimes(1);
    const payload = mockDispatcher.formRequestAndDispatch.mock.calls[0][2];

    expect(payload).toEqual({ isAuthoring: true });
  });
  it('Dispatches the hide flag', () => {
    const { uc, mockDispatcher } = makeTestRig();

    uc.doDispatch(false);

    expect(mockDispatcher.formRequestAndDispatch).toBeCalledTimes(1);
    const payload = mockDispatcher.formRequestAndDispatch.mock.calls[0][2];

    expect(payload).toEqual({ isAuthoring: false });
  });

  it("Warns if it cannot find the app object when getting by ID", () => {
    const { appObjects } = makeTestRig();

    appObjects.submitWarning = jest.fn();

    DispatchIsAuthoringUC.getByID("someID", appObjects);
    expect(appObjects.submitWarning).toBeCalled();
  });

  it("Warns if that App Object does not have the UC", () => {
    const { appObjects } = makeTestRig();

    appObjects.getOrCreate("someID");
    appObjects.submitWarning = jest.fn();

    DispatchIsAuthoringUC.getByID("someID", appObjects);
    expect(appObjects.submitWarning).toBeCalled();
  });

  it("Gets by ID", () => {
    const { appObjects, uc } = makeTestRig();

    expect(DispatchIsAuthoringUC.getByID(uc.appObject.id, appObjects)).toEqual(uc);
  });
});
