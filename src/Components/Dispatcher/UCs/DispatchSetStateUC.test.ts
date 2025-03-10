import { makeAppObjectRepo } from "@vived/core";
import { MockHostDispatchEntity } from "../Mocks/MockHostDispatcher";
import {
  DispatchSetStateUC,
  makeDispatchSetStateUC,
  DispatchStateDTO,
  SetStatePayloadV2,
  SetStatePayloadV3
} from "./DispatchSetStateUC";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const ao = appObjects.getOrCreate("AO");

  const mockDispatcher = new MockHostDispatchEntity(ao);
  mockDispatcher.getRequestPayloadVersion.mockReturnValue(3);

  const uc = makeDispatchSetStateUC(ao);

  return { uc, appObjects, mockDispatcher };
}

function basicDTO(): DispatchStateDTO {
  return {
    finalState: { foo: "bar" },
    hasNextSlide: false,
    hasPreviousSlide: false,
    hideNavigation: false
  };
}

describe("Dispatch Set State", () => {
  it("Gets the UC", () => {
    const { uc } = makeTestRig();

    expect(DispatchSetStateUC.get(uc.appObject)).toEqual(uc);
  });

  it("Dispatches the correct type", () => {
    const { uc, mockDispatcher } = makeTestRig();

    const dto = basicDTO();
    uc.doDispatch(dto);

    expect(mockDispatcher.formRequestAndDispatch).toBeCalledTimes(1);
    expect(mockDispatcher.formRequestAndDispatch.mock.calls[0][0]).toEqual(
      "SET_APP_STATE"
    );
  });

  it("Warns if it cannot find the app object when getting by ID", () => {
    const { appObjects } = makeTestRig();

    appObjects.submitWarning = jest.fn();

    DispatchSetStateUC.getByID("someID", appObjects);
    expect(appObjects.submitWarning).toBeCalled();
  });

  it("Warns if that App Object does not have the UC", () => {
    const { appObjects } = makeTestRig();

    appObjects.getOrCreate("someID");
    appObjects.submitWarning = jest.fn();

    DispatchSetStateUC.getByID("someID", appObjects);
    expect(appObjects.submitWarning).toBeCalled();
  });

  it("Gets by ID", () => {
    const { appObjects, uc } = makeTestRig();

    expect(DispatchSetStateUC.getByID(uc.appObject.id, appObjects)).toEqual(uc);
  });
});

describe("Payload version 3", () => {
  it("Dispatches the version", () => {
    const { uc, mockDispatcher } = makeTestRig();

    mockDispatcher.getRequestPayloadVersion.mockReturnValue(3);

    const dto = basicDTO();
    uc.doDispatch(dto);

    expect(mockDispatcher.formRequestAndDispatch).toBeCalledTimes(1);
    expect(mockDispatcher.formRequestAndDispatch.mock.calls[0][1]).toEqual(3);
  });

  it("Dispatches the state object", () => {
    const { uc, mockDispatcher } = makeTestRig();

    mockDispatcher.getRequestPayloadVersion.mockReturnValue(3);

    const dto = basicDTO();
    uc.doDispatch(dto);

    const payload = mockDispatcher.formRequestAndDispatch.mock
      .calls[0][2] as SetStatePayloadV3;
    expect(payload.finalState).toEqual(dto.finalState);
  });

  it("Dispatches duration if it is included", () => {
    const { uc, mockDispatcher } = makeTestRig();

    mockDispatcher.getRequestPayloadVersion.mockReturnValue(3);

    const dto = basicDTO();
    dto.duration = 3;
    uc.doDispatch(dto);

    const payload = mockDispatcher.formRequestAndDispatch.mock
      .calls[0][2] as SetStatePayloadV3;
    expect(payload.duration).toEqual(3);
  });

  it("Dispatches undefined if it is not included", () => {
    const { uc, mockDispatcher } = makeTestRig();

    mockDispatcher.getRequestPayloadVersion.mockReturnValue(3);

    const dto = basicDTO();
    uc.doDispatch(dto);

    const payload = mockDispatcher.formRequestAndDispatch.mock
      .calls[0][2] as SetStatePayloadV3;
    expect(payload.duration).toBeUndefined();
  });

  it("Dispatches hide nav", () => {
    const { uc, mockDispatcher } = makeTestRig();

    mockDispatcher.getRequestPayloadVersion.mockReturnValue(3);

    const dto = basicDTO();
    dto.hideNavigation = true;
    uc.doDispatch(dto);

    const payload = mockDispatcher.formRequestAndDispatch.mock
      .calls[0][2] as SetStatePayloadV3;
    expect(payload.hideNavigation).toEqual(true);
  });

  it("Dispatches has next slide", () => {
    const { uc, mockDispatcher } = makeTestRig();

    mockDispatcher.getRequestPayloadVersion.mockReturnValue(3);

    const dto = basicDTO();
    dto.hasNextSlide = true;
    uc.doDispatch(dto);

    const payload = mockDispatcher.formRequestAndDispatch.mock
      .calls[0][2] as SetStatePayloadV3;
    expect(payload.hasNextSlide).toEqual(true);
  });

  it("Dispatches has previous slide", () => {
    const { uc, mockDispatcher } = makeTestRig();

    mockDispatcher.getRequestPayloadVersion.mockReturnValue(3);

    const dto = basicDTO();
    dto.hasPreviousSlide = true;
    uc.doDispatch(dto);

    const payload = mockDispatcher.formRequestAndDispatch.mock
      .calls[0][2] as SetStatePayloadV3;
    expect(payload.hasPreviousSlide).toEqual(true);
  });
});

describe("Payload version 2", () => {
  it("Dispatches the version", () => {
    const { uc, mockDispatcher } = makeTestRig();

    mockDispatcher.getRequestPayloadVersion.mockReturnValue(2);

    const dto = basicDTO();
    uc.doDispatch(dto);

    expect(mockDispatcher.formRequestAndDispatch).toBeCalledTimes(1);
    expect(mockDispatcher.formRequestAndDispatch.mock.calls[0][1]).toEqual(2);
  });

  it("Dispatches the state string", () => {
    const { uc, mockDispatcher } = makeTestRig();

    mockDispatcher.getRequestPayloadVersion.mockReturnValue(2);

    const dto = basicDTO();
    uc.doDispatch(dto);

    const expectState = JSON.stringify(dto.finalState);
    const payload = mockDispatcher.formRequestAndDispatch.mock
      .calls[0][2] as SetStatePayloadV2;
    expect(payload.finalState).toEqual(expectState);
    expect(payload.duration).toBeUndefined();
  });

  it("Dispatches an empty string if the passed state is undefined", () => {
    const { uc, mockDispatcher } = makeTestRig();

    mockDispatcher.getRequestPayloadVersion.mockReturnValue(2);

    const dto = basicDTO();
    dto.finalState = undefined;
    uc.doDispatch(dto);

    const payload = mockDispatcher.formRequestAndDispatch.mock
      .calls[0][2] as SetStatePayloadV2;
    expect(payload.finalState).toEqual("");
    expect(payload.duration).toBeUndefined();
  });

  it("Dispatches duration", () => {
    const { uc, mockDispatcher } = makeTestRig();

    mockDispatcher.getRequestPayloadVersion.mockReturnValue(2);

    const dto = basicDTO();
    dto.duration = 3;
    uc.doDispatch(dto);

    const expectState = JSON.stringify(dto.finalState);
    const payload = mockDispatcher.formRequestAndDispatch.mock
      .calls[0][2] as SetStatePayloadV2;
    expect(payload.finalState).toEqual(expectState);
    expect(payload.duration).toEqual(3);
  });

  it("Dispatches payload version 2 if requested version is undefined", () => {
    const { uc, mockDispatcher } = makeTestRig();

    mockDispatcher.getRequestPayloadVersion.mockReturnValue(undefined);

    const dto = basicDTO();
    uc.doDispatch(dto);

    expect(mockDispatcher.formRequestAndDispatch).toBeCalledTimes(1);
    expect(mockDispatcher.formRequestAndDispatch.mock.calls[0][1]).toEqual(2);
  });

  it("Dispatches payload version 2 if requested version is 1", () => {
    const { uc, mockDispatcher } = makeTestRig();

    mockDispatcher.getRequestPayloadVersion.mockReturnValue(1);

    const dto = basicDTO();
    uc.doDispatch(dto);

    expect(mockDispatcher.formRequestAndDispatch).toBeCalledTimes(1);
    expect(mockDispatcher.formRequestAndDispatch.mock.calls[0][1]).toEqual(2);
  });
});
