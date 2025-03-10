import { makeAppObjectRepo } from "@vived/core";
import { makeZSpaceHostEntity } from "../Entities/ZSpaceHost";
import { checkForWebXRSupport } from "./checkForZSpaceSupport";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const zSpace = makeZSpaceHostEntity(appObjects.getOrCreate("zSpace"));

  const mockIsSupported = jest.fn();
  (navigator as any).xr = {
    isSessionSupported: mockIsSupported
  };

  return { zSpace, mockIsSupported, appObjects };
}

describe("Checks for ZSpace Support", () => {
  it("Sets is supported if it comes back as supported", async () => {
    const { zSpace, mockIsSupported, appObjects } = makeTestRig();
    mockIsSupported.mockResolvedValue(true);
    expect(zSpace.isSupported).toEqual(false);

    await checkForWebXRSupport(appObjects);

    expect(zSpace.isSupported).toEqual(true);
  });

  it("Sets is supported to false is it isnt", async () => {
    const { zSpace, mockIsSupported, appObjects } = makeTestRig();
    mockIsSupported.mockResolvedValue(false);
    zSpace.isSupported = true;

    await checkForWebXRSupport(appObjects);

    expect(zSpace.isSupported).toEqual(false);
  });

  it("Sets is supported to false if it rejects", async () => {
    const { appObjects, mockIsSupported, zSpace } = makeTestRig();
    mockIsSupported.mockRejectedValue(false);
    zSpace.isSupported = true;

    await checkForWebXRSupport(appObjects);

    expect(zSpace.isSupported).toEqual(false);
  });
});
