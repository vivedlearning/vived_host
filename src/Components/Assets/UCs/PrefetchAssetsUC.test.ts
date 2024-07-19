import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeHostStateMachine } from "../../StateMachine";
import { makeMockGetAssetFileUC } from "../Mocks";
import { makePrefetchAssets } from "./PrefetchAssetsUC";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();

  const mockGetAssetFile = makeMockGetAssetFileUC(appObjects);
  mockGetAssetFile.getAssetFile.mockResolvedValue(undefined);

  const uc = makePrefetchAssets(appObjects.getOrCreate("ao"));

  const stateMachine = makeHostStateMachine(
    appObjects.getOrCreate("StateMachine")
  );
  const state1 = stateMachine.createNewState();
  state1.assets = ["id1", "id2"];

  const state2 = stateMachine.createNewState();
  state2.assets = ["id3", "id2"];

  return {
    mockGetAssetFile,
    uc,
    appObjects,
    stateMachine
  };
}

describe("Prefetch Assets", () => {
  it("Fetches the unique ids", async () => {
    const { mockGetAssetFile, uc } = makeTestRig();

    await uc.prefetchAssets();

    expect(mockGetAssetFile.getAssetFile).toBeCalledTimes(3);
    expect(mockGetAssetFile.getAssetFile).toBeCalledWith("id1");
    expect(mockGetAssetFile.getAssetFile).toBeCalledWith("id2");
    expect(mockGetAssetFile.getAssetFile).toBeCalledWith("id3");
  });

  it("Rejects if a get asset rejects", () => {
    const { mockGetAssetFile, uc } = makeTestRig();

    uc.warn = jest.fn();
    mockGetAssetFile.getAssetFile.mockRejectedValue(new Error("Some Error"));

    return expect(uc.prefetchAssets()).rejects.toEqual(new Error("Some Error"));
  });

  it("Warns if the assets rejects", async () => {
    const { mockGetAssetFile, uc } = makeTestRig();

    uc.warn = jest.fn();
    mockGetAssetFile.getAssetFile.mockRejectedValue(new Error("Some Error"));

    expect.assertions(1);
    try {
      await uc.prefetchAssets();
    } catch {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(uc.warn).toBeCalled();
    }
  });
});
