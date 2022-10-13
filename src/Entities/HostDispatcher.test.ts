import { makeHostDispatcher } from './HostDispatcher';
import { Request } from './HostBoundary';

function makeTestRig() {
  const hostDispatcher = makeHostDispatcher();
  const mockHandler = jest.fn();
  hostDispatcher.registerAppHandler(mockHandler);
  return { hostDispatcher, mockHandler };
}

describe('Host Dispatcher', () => {
  it('Errors if there is no app handler and we try to dispatch', () => {
    const hostDispatcher = makeHostDispatcher();
    console.error = jest.fn();

    const request: Request = {
      type: 'SOME_TYPE',
      version: 1,
      payload: { foo: 'bar' },
    };

    hostDispatcher.dispatch(request);

    expect(console.error).toBeCalled();
  });

  it('Allows for a generic dispatch', () => {
    const { hostDispatcher, mockHandler } = makeTestRig();

    const request: Request = {
      type: 'SOME_TYPE',
      version: 1,
      payload: { foo: 'bar' },
    };

    hostDispatcher.dispatch(request);

    expect(mockHandler).toBeCalledWith(request);
  });

  it('Dispataches show babylon inspector', () => {
    const { hostDispatcher, mockHandler } = makeTestRig();

    const expectedRequest: Request = {
      type: 'SHOW_BABYLON_INSPECTOR',
      version: 1,
      payload: {
        showBabylonInspector: true,
      },
    };

    hostDispatcher.showBabylonInspector(true);

    expect(mockHandler).toBeCalledWith(expectedRequest);
  });

  it('Dispataches set is authoring', () => {
    const { hostDispatcher, mockHandler } = makeTestRig();

    const expectedRequest: Request = {
      type: 'SET_IS_AUTHORING',
      version: 1,
      payload: {
        isAuthoring: true,
      },
    };

    hostDispatcher.setIsAuthoring(true);

    expect(mockHandler).toBeCalledWith(expectedRequest);
  });

  it('Dispatches dispose app', () => {
    const { hostDispatcher, mockHandler } = makeTestRig();

    const expectedRequest: Request = {
      type: 'DISPOSE_APP',
      version: 1,
    };

    hostDispatcher.disposeApp();

    expect(mockHandler).toBeCalledWith(expectedRequest);
  });

  it('Dispatches stop app', () => {
    const { hostDispatcher, mockHandler } = makeTestRig();

    const expectedRequest: Request = {
      type: 'STOP_APP',
      version: 1,
    };

    hostDispatcher.stopApp();

    expect(mockHandler).toBeCalledWith(expectedRequest);
  });

  it('Dispatches set device preview', () => {
    const { hostDispatcher, mockHandler } = makeTestRig();

    const expectedRequest: Request = {
      type: 'SET_DEVICE_PREVIEW',
      version: 1,
      payload: {
        x: 5,
        y: 6,
      },
    };

    hostDispatcher.setDevicePreview(5, 6);

    expect(mockHandler).toBeCalledWith(expectedRequest);
  });

  it('Dispatches start app', () => {
    const { hostDispatcher, mockHandler } = makeTestRig();
    const element = document.createElement('div');

    const expectedRequest: Request = {
      type: 'START_APP',
      version: 2,
      payload: {
        container: element,
      },
    };

    hostDispatcher.startApp(element);

    expect(mockHandler).toBeCalledWith(expectedRequest);
  });

  it('Dispatches set state', () => {
    const { hostDispatcher, mockHandler } = makeTestRig();

    const expectedRequest: Request = {
      type: 'SET_APP_STATE',
      version: 2,
      payload: {
        finalState: 'Some State',
        duration: 5,
      },
    };

    hostDispatcher.setState('Some State', 5);

    expect(mockHandler).toBeCalledWith(expectedRequest);
  });
});
