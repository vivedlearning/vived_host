import { makeHostAppObjectRepo } from "../../../HostAppObject";
import {
  MockHostDispatchEntity
} from "../Mocks/MockHostDispatcher";
import {
  DispatchStartZSpaceUC, makeDispatchStartZSpaceUC
} from "./DispatchStartZSpaceUC";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const ao = appObjects.getOrCreate("AO");
  const mockDispatcher = new MockHostDispatchEntity(ao);

  const uc = makeDispatchStartZSpaceUC(ao);

  return { uc, appObjects, mockDispatcher };
}

describe("Dispatch start zSpace", () => {
  it("Gets the UC", () => {
    const { uc } = makeTestRig();

    expect(DispatchStartZSpaceUC.get(uc.appObject)).toEqual(uc);
  });

  it("Dispatches the correct type", () => {
    const { uc, mockDispatcher } = makeTestRig();

    uc.doDispatch("mockSession", true);

    expect(mockDispatcher.formRequestAndDispatch).toBeCalledTimes(1);
    expect(mockDispatcher.formRequestAndDispatch.mock.calls[0][0]).toEqual(
      "START_ZSPACE"
    );
  });

  it("Dispatches version 2 if needed", () => {
    const { uc, mockDispatcher } = makeTestRig();

    mockDispatcher.getRequestPayloadVersion = jest.fn().mockReturnValue(2);

    uc.doDispatch("mockSession", true);

    const version = mockDispatcher.formRequestAndDispatch.mock.calls[0][1];
    const payload = mockDispatcher.formRequestAndDispatch.mock.calls[0][2];
    expect(version).toEqual(2);
    expect(payload).toEqual({
      device: "INSPIRE",
      session: "mockSession",
      emulate: true
    });
  });

  it("Dispatches version 3", () => {
    const { uc, mockDispatcher } = makeTestRig();

    mockDispatcher.getRequestPayloadVersion = jest.fn().mockReturnValue(3);

    uc.doDispatch("mockSession", true);

    expect(mockDispatcher.formRequestAndDispatch).toBeCalledTimes(1);

    const version = mockDispatcher.formRequestAndDispatch.mock.calls[0][1];
    const payload = mockDispatcher.formRequestAndDispatch.mock.calls[0][2];
    expect(version).toEqual(3);
    expect(payload).toEqual({
      session: "mockSession",
      emulate: true
    });
  });

  it("Dispatches version 3 by default", () => {
    const { uc, mockDispatcher } = makeTestRig();

    uc.doDispatch("mockSession", true);

    expect(mockDispatcher.formRequestAndDispatch).toBeCalledTimes(1);

    const version = mockDispatcher.formRequestAndDispatch.mock.calls[0][1];
    const payload = mockDispatcher.formRequestAndDispatch.mock.calls[0][2];
    expect(version).toEqual(3);
    expect(payload).toEqual({
      session: "mockSession",
      emulate: true
    });
  });

  it("Defaults to version 3 if an unsupported version is requested", () => {
    const { uc, mockDispatcher } = makeTestRig();

    uc.warn = jest.fn(); //suppresses consoles
    mockDispatcher.getRequestPayloadVersion = jest.fn().mockReturnValue(-1);

    uc.doDispatch("mockSession", true);

    const version = mockDispatcher.formRequestAndDispatch.mock.calls[0][1];
    const payload = mockDispatcher.formRequestAndDispatch.mock.calls[0][2];
    expect(version).toEqual(3);
    expect(payload).toEqual({
      session: "mockSession",
      emulate: true
    });
  });

  it("Warns if an unsupported version is requested", () => {
    const { uc, mockDispatcher } = makeTestRig();

    uc.warn = jest.fn();
    mockDispatcher.getRequestPayloadVersion = jest.fn().mockReturnValue(-1);

    uc.doDispatch("mockSession", true);

    expect(uc.warn).toBeCalled();
  });
});
