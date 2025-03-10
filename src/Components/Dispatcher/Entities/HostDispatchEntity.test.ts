import { makeAppObjectRepo, Handler, Request } from "@vived/core";
import {  } from "../../../Types";
import {
  HostDispatchEntity,
  makeHostDispatchEntity
} from "./HostDispatchEntity";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const dispatcherAO = appObjects.getOrCreate("appDispatcher");
  const mockHandler = jest.fn();

  const dispatcher = makeHostDispatchEntity(dispatcherAO);

  return { dispatcher, appObjects, mockHandler, dispatcherAO };
}

describe("Host Dispatch Entity", () => {
  it("Gets the Dispatcher", () => {
    const { dispatcher, dispatcherAO } = makeTestRig();
    expect(HostDispatchEntity.get(dispatcherAO)).toEqual(dispatcher);
  });

  it("Gets the Dispatcher by ID", () => {
    const { dispatcher, dispatcherAO, appObjects } = makeTestRig();
    expect(HostDispatchEntity.getByID(dispatcherAO.id, appObjects)).toEqual(
      dispatcher
    );
  });

  it("Dispatches to the host", () => {
    const { dispatcher, mockHandler } = makeTestRig();

    dispatcher.registerAppHandler(mockHandler);

    const request: Request = {
      type: "a type",
      version: 1,
      payload: { foo: "bar" }
    };

    dispatcher.dispatch(request);

    expect(mockHandler).toBeCalledWith(request);
  });

  it("Forms and dispatches a request", () => {
    const { dispatcher, mockHandler } = makeTestRig();

    dispatcher.registerAppHandler(mockHandler);

    const request: Request = {
      type: "a type",
      version: 1,
      payload: { foo: "bar" }
    };

    dispatcher.formRequestAndDispatch("a type", 1, { foo: "bar" });

    expect(mockHandler).toBeCalledWith(request);
  });

  it("Errors if dispatch is called without a handler", () => {
    const { dispatcher } = makeTestRig();

    dispatcher.error = jest.fn();

    dispatcher.formRequestAndDispatch("a type", 1, { foo: "bar" });
    expect(dispatcher.error).toBeCalledTimes(1);
  });

  it("Errors if dispatch is called without a handler", () => {
    const { dispatcher } = makeTestRig();

    dispatcher.error = jest.fn();

    const request: Request = {
      type: "a type",
      version: 1,
      payload: { foo: "bar" }
    };

    dispatcher.dispatch(request);
    expect(dispatcher.error).toBeCalledTimes(1);
  });

  it("Allows the handler to be cleared", () => {
    const { dispatcher, mockHandler } = makeTestRig();

    dispatcher.registerAppHandler(mockHandler);
    dispatcher.clearAppHandler();

    dispatcher.error = jest.fn();

    const request: Request = {
      type: "a type",
      version: 1,
      payload: { foo: "bar" }
    };

    dispatcher.dispatch(request);
    expect(dispatcher.error).toBeCalledTimes(1);
  });

  it("Requests the App Handler version when the handler is registered", () => {
    const { dispatcher, mockHandler } = makeTestRig();

    dispatcher.registerAppHandler(mockHandler);

    const request = mockHandler.mock.calls[0][0];
    expect(request.type).toEqual("GET_APP_HANDLER_VERSION");
  });

  it("Sets the app handler version", () => {
    const { dispatcher } = makeTestRig();

    const handleGetVersion: Handler = (request: Request) => {
      const cb = (request.payload as any).callback;
      cb(1);
    };

    expect(dispatcher.appHandlerVersion).toEqual(0);

    dispatcher.registerAppHandler(handleGetVersion);

    expect(dispatcher.appHandlerVersion).toEqual(1);
  });

  it("Requests the payload versions after an app version is returned", () => {
    const { dispatcher } = makeTestRig();

    const handleGetVersion = jest
      .fn()
      .mockImplementation((request: Request) => {
        if (request.type === "GET_APP_HANDLER_VERSION") {
          const cb = (request.payload as any).callback;
          cb(1);
        }
      });

    dispatcher.registerAppHandler(handleGetVersion);

    expect(handleGetVersion).toBeCalledTimes(2);
    const request = handleGetVersion.mock.calls[1][0];
    expect(request.type).toEqual("GET_APP_PAYLOAD_VERSION");
  });

  it("Does not requests the payload versions if getting the app version throws an error", () => {
    const { dispatcher, appObjects } = makeTestRig();

    appObjects.submitWarning = jest.fn();

    const handleGetVersion = jest
      .fn()
      .mockImplementation((request: Request) => {
        if (request.type === "GET_APP_HANDLER_VERSION") {
          throw new Error("Some Error");
        }
      });

    dispatcher.registerAppHandler(handleGetVersion);

    expect(handleGetVersion).toBeCalledTimes(1);
  });

  it("Sets the app payload versions", () => {
    const { dispatcher } = makeTestRig();

    const handleGetVersion = jest
      .fn()
      .mockImplementation((request: Request) => {
        const cb = (request.payload as any).callback;
        if (request.type === "GET_APP_HANDLER_VERSION") {
          cb(1);
        } else if (request.type === "GET_APP_PAYLOAD_VERSION") {
          const payloadVersions = new Map<string, number>();
          payloadVersions.set("someType", 7);
          cb(payloadVersions);
        }
      });

    expect(dispatcher.getRequestPayloadVersion("someType")).toBeUndefined();

    dispatcher.registerAppHandler(handleGetVersion);

    expect(dispatcher.getRequestPayloadVersion("someType")).toEqual(7);
  });
});
