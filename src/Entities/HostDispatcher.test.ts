import { makeHostDispatcher } from './HostDispatcher';
import { Handler, Request } from './HostBoundary';

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

  it('Dispatches GET_APP_HANDLER_VERSION when the handler is registered', () => {
    const hostDispatcher = makeHostDispatcher();

    const mockHandler = new MockHandler();
    const spy = jest.spyOn(mockHandler, 'handler');

    hostDispatcher.registerAppHandler(mockHandler.handler);

    expect(spy).toBeCalled();
    const request = spy.mock.calls[0][0] as Request;
    expect(request.type).toEqual('GET_APP_HANDLER_VERSION');
    expect(request.version).toEqual(1);
  });

  it('It only dispatches GET_APP_HANDLER_VERSION if get app version does not respond', () => {
    const hostDispatcher = makeHostDispatcher();

    const mockHandler = new MockHandler();
    const spy = jest.spyOn(mockHandler, 'handler');

    hostDispatcher.registerAppHandler(mockHandler.handler);

    expect(spy).toBeCalledTimes(1);
  });

  it("Dispatches GET_APP_PAYLOAD_VERSION if the version responds", ()=>{
    const hostDispatcher = makeHostDispatcher();
    const mockHandler = new MockHandler();
    mockHandler.handlerVersion = 1;
    const spy = jest.spyOn(mockHandler, 'handler');
    hostDispatcher.registerAppHandler(mockHandler.handler);

    expect(spy).toBeCalledTimes(2);
    const request = spy.mock.calls[1][0] as Request;
    expect(request.type).toEqual('GET_APP_PAYLOAD_VERSION');
    expect(request.version).toEqual(2);
  })

  it('Dispataches show babylon inspector with the default version number', () => {
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

  it('Dispataches show babylon inspector with the app payload version number', () => {
    const hostDispatcher = makeHostDispatcher();
    const mockHandler = new MockHandler();
    mockHandler.handlerVersion = 1;
    mockHandler.payloadVersions.set("SHOW_BABYLON_INSPECTOR", 15)
    const spy = jest.spyOn(mockHandler, 'handler');
    hostDispatcher.registerAppHandler(mockHandler.handler);

    spy.mockClear();
    const expectedRequest: Request = {
      type: 'SHOW_BABYLON_INSPECTOR',
      version: 15,
      payload: {
        showBabylonInspector: true,
      },
    };

    hostDispatcher.showBabylonInspector(true);

    expect(spy).toBeCalledWith(expectedRequest);
  });

  it('Dispataches set is authoring with the default version number', () => {
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

  it('Dispataches set is authoring with the app payload version number', () => {
    const hostDispatcher = makeHostDispatcher();
    const mockHandler = new MockHandler();
    mockHandler.handlerVersion = 1;
    mockHandler.payloadVersions.set("SET_IS_AUTHORING", 15)
    const spy = jest.spyOn(mockHandler, 'handler');
    hostDispatcher.registerAppHandler(mockHandler.handler);

    spy.mockClear();
    const expectedRequest: Request = {
      type: 'SET_IS_AUTHORING',
      version: 15,
      payload: {
        isAuthoring: true,
      },
    };

    hostDispatcher.setIsAuthoring(true);

    expect(spy).toBeCalledWith(expectedRequest);
  });

  it('Dispatches dispose app with the default version number', () => {
    const { hostDispatcher, mockHandler } = makeTestRig();

    const expectedRequest: Request = {
      type: 'DISPOSE_APP',
      version: 1,
    };

    hostDispatcher.disposeApp();

    expect(mockHandler).toBeCalledWith(expectedRequest);
  });

  it('Dispatches dispose app with the app payload version number', () => {
    const hostDispatcher = makeHostDispatcher();
    const mockHandler = new MockHandler();
    mockHandler.handlerVersion = 1;
    mockHandler.payloadVersions.set("DISPOSE_APP", 15)
    const spy = jest.spyOn(mockHandler, 'handler');
    hostDispatcher.registerAppHandler(mockHandler.handler);

    spy.mockClear();
    const expectedRequest: Request = {
      type: 'DISPOSE_APP',
      version: 15,
    };

    hostDispatcher.disposeApp();

    expect(spy).toBeCalledWith(expectedRequest);
  });

  it('Dispatches stop app with the default version number', () => {
    const { hostDispatcher, mockHandler } = makeTestRig();

    const expectedRequest: Request = {
      type: 'STOP_APP',
      version: 1,
    };

    hostDispatcher.stopApp();

    expect(mockHandler).toBeCalledWith(expectedRequest);
  });  
  
  it('Dispatches stop app with the app payload version number', () => {
    const hostDispatcher = makeHostDispatcher();
    const mockHandler = new MockHandler();
    mockHandler.handlerVersion = 1;
    mockHandler.payloadVersions.set("STOP_APP", 15)
    const spy = jest.spyOn(mockHandler, 'handler');
    hostDispatcher.registerAppHandler(mockHandler.handler);

    spy.mockClear();
    const expectedRequest: Request = {
      type: 'STOP_APP',
      version: 15,
    };

    hostDispatcher.stopApp();

    expect(spy).toBeCalledWith(expectedRequest);
  });

  it('Dispatches set device preview with the default version number', () => {
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

  it('Dispatches set device preview with the app payload version number', () => {
    const hostDispatcher = makeHostDispatcher();
    const mockHandler = new MockHandler();
    mockHandler.handlerVersion = 1;
    mockHandler.payloadVersions.set("SET_DEVICE_PREVIEW", 15)
    const spy = jest.spyOn(mockHandler, 'handler');
    hostDispatcher.registerAppHandler(mockHandler.handler);

    spy.mockClear();
    const expectedRequest: Request = {
      type: 'SET_DEVICE_PREVIEW',
      version: 15,
      payload: {
        x: 5,
        y: 6,
      },
    };

    hostDispatcher.setDevicePreview(5, 6);

    expect(spy).toBeCalledWith(expectedRequest);
  });

  it('Dispatches start app with the default version number', () => {
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

  it('Dispatches start app with the app payload version number', () => {
    const hostDispatcher = makeHostDispatcher();
    const mockHandler = new MockHandler();
    mockHandler.handlerVersion = 1;
    mockHandler.payloadVersions.set("START_APP", 15)
    const spy = jest.spyOn(mockHandler, 'handler');
    hostDispatcher.registerAppHandler(mockHandler.handler);
    const element = document.createElement('div');

    spy.mockClear();
    const expectedRequest: Request = {
      type: 'START_APP',
      version: 15,
      payload: {
        container: element,
      },
    };

    hostDispatcher.startApp(element);

    expect(spy).toBeCalledWith(expectedRequest);
  });

  it('Dispatches set state with the default version number', () => {
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

  it('Dispatches set state with the app payload version number', () => {
    const hostDispatcher = makeHostDispatcher();
    const mockHandler = new MockHandler();
    mockHandler.handlerVersion = 1;
    mockHandler.payloadVersions.set("SET_APP_STATE", 15)
    const spy = jest.spyOn(mockHandler, 'handler');
    hostDispatcher.registerAppHandler(mockHandler.handler);

    spy.mockClear();
    const expectedRequest: Request = {
      type: 'SET_APP_STATE',
      version: 15,
      payload: {
        finalState: 'Some State',
        duration: 5,
      },
    };

    hostDispatcher.setState('Some State', 5);

    expect(spy).toBeCalledWith(expectedRequest);
  });
});

class MockHandler {
  public handlerVersion?: number;
  public payloadVersions = new Map<string, number>();

  public handler: Handler = (request: Request) => {
    if (request.type === 'GET_APP_PAYLOAD_VERSION') {
      const payload = request.payload! as any;
      const callback = payload.callback as (requestVersionLookup: Map<string, number>) => void;
      callback(this.payloadVersions);
    } else if (request.type === 'GET_APP_HANDLER_VERSION') {
      if (this.handlerVersion === undefined) return; //Do not respond

      const payload = request.payload! as any;
      const callback = payload.callback as (version: number) => void;
      callback(this.handlerVersion);
    }
  };
}
