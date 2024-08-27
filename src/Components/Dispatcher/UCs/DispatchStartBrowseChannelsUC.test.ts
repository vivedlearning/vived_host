import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { MockHostDispatchEntity } from "../Mocks/MockHostDispatcher";
import {
  BrowseChannelDTO,
  DispatchStartBrowseChannelsUC,
  makeDispatchStartBrowseChannelsUC
} from "./DispatchStartBrowseChannelsUC";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const ao = appObjects.getOrCreate("AO");
  const mockDispatcher = new MockHostDispatchEntity(ao);

  const uc = makeDispatchStartBrowseChannelsUC(ao);

  return { uc, appObjects, mockDispatcher };
}

function makeDTO(): BrowseChannelDTO {
  return {
    baseApiURL: "base.api.url",
    callback: jest.fn(),
    channelID: "aChannel",
    container: document.createElement("div")
  };
}

describe("Dispatch Start Browse Channel Models", () => {
  it("Gets the UC", () => {
    const { uc } = makeTestRig();

    expect(DispatchStartBrowseChannelsUC.get(uc.appObject)).toEqual(uc);
  });

  it("Dispatches the correct type", () => {
    const { uc, mockDispatcher } = makeTestRig();

    uc.doDispatch(makeDTO());

    expect(mockDispatcher.formRequestAndDispatch).toBeCalledTimes(1);
    expect(mockDispatcher.formRequestAndDispatch.mock.calls[0][0]).toEqual(
      "START_SELECT_CHANNEL_MODEL"
    );
  });

  it("Dispatches the correct version", () => {
    const { uc, mockDispatcher } = makeTestRig();

    uc.doDispatch(makeDTO());

    expect(mockDispatcher.formRequestAndDispatch).toBeCalledTimes(1);
    expect(mockDispatcher.formRequestAndDispatch.mock.calls[0][1]).toEqual(1);
  });

  it("Forms the expected payload", () => {
    const { uc, mockDispatcher } = makeTestRig();

    const dto = makeDTO();
    uc.doDispatch(dto);

    expect(mockDispatcher.formRequestAndDispatch).toBeCalledTimes(1);
    expect(mockDispatcher.formRequestAndDispatch.mock.calls[0][2]).toEqual({
      channelID: dto.channelID,
      container: dto.container,
      baseApiUrl: dto.baseApiURL,
      callback: dto.callback
    });
  });

  it("Warns if it cannot find the app object when getting by ID", () => {
    const { appObjects } = makeTestRig();

    appObjects.submitWarning = jest.fn();

    DispatchStartBrowseChannelsUC.getByID("someID", appObjects);
    expect(appObjects.submitWarning).toBeCalled();
  });

  it("Warns if that App Object does not have the UC", () => {
    const { appObjects } = makeTestRig();

    appObjects.getOrCreate("someID");
    appObjects.submitWarning = jest.fn();

    DispatchStartBrowseChannelsUC.getByID("someID", appObjects);
    expect(appObjects.submitWarning).toBeCalled();
  });

  it("Gets by ID", () => {
    const { appObjects, uc } = makeTestRig();

    expect(DispatchStartBrowseChannelsUC.getByID(uc.appObject.id, appObjects)).toEqual(uc);
  });
});
