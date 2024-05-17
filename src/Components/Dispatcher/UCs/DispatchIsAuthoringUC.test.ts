import { makeHostAppObjectRepo } from '../../../HostAppObject';
import { makeMockHostDispatchEntity } from '../Mocks/MockHostDispatcher';
import { makeDispatchIsAuthoringUC, DispatchIsAuthoringUC } from './DispatchIsAuthoringUC';

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const mockDispatcher = makeMockHostDispatchEntity(appObjects);

  const uc = makeDispatchIsAuthoringUC(mockDispatcher.appObject);

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
});
