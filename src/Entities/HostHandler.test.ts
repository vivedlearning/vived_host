import { RequestHandler, makeHostHandler, UnsupportedRequestVerion, Request } from './HostHandler';

class MockHandler extends RequestHandler {
  readonly requestType: string = 'A_REQUEST';
  handleRequest = jest.fn();
}

function makeTestRig() {
  const hostHandler = makeHostHandler();
  const mockRequestHandler = new MockHandler();
  hostHandler.registerRequestHandler(mockRequestHandler);

  return { hostHandler, mockRequestHandler };
}

describe('Host Handler', () => {
  it('Warns if multiple request handers are added for the same type', () => {
    const { hostHandler } = makeTestRig();
    console.warn = jest.fn();
    const anotherHandler = new MockHandler();

    hostHandler.registerRequestHandler(anotherHandler);

    expect(console.warn).toBeCalled();
  });

  it('Triggers the handler when a request recieved', () => {
    const { hostHandler, mockRequestHandler } = makeTestRig();
    const request: Request = {
      type: 'A_REQUEST',
      version: 2,
      payload: { foo: 'bar' },
    };

    hostHandler.handler(request);

    expect(mockRequestHandler.handleRequest).toBeCalledWith(2, { foo: 'bar' });
  });

  it('Warns if a request type has not been registered', () => {
    const { hostHandler } = makeTestRig();
    console.warn = jest.fn();
    const request: Request = {
      type: 'A_DIFFERENT_REQUEST',
      version: 2,
      payload: { foo: 'bar' },
    };

    hostHandler.handler(request);
    expect(console.warn).toBeCalled();
  });

  it('Consoles a warn if the the handler throw an error', () => {
    const { hostHandler, mockRequestHandler } = makeTestRig();
    console.warn = jest.fn();
    const request: Request = {
      type: 'A_REQUEST',
      version: 2,
      payload: { foo: 'bar' },
    };

    mockRequestHandler.handleRequest.mockImplementation(() => {
      throw new UnsupportedRequestVerion('A_REQUEST', 2);
    });

    hostHandler.handler(request);

    expect(console.warn).toBeCalled();
  });
});
