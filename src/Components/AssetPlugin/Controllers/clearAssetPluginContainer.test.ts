import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeMockAssetPluginContainerUC } from "../Mocks/MockAssetPluginContainerUC";
import { clearAssetPluginContainer } from "./clearAssetPluginContainer";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();

  const uc = makeMockAssetPluginContainerUC(appObjects);

  return { uc, appObjects };
}

describe("Set Asset Plugin Container Controller", () => {
  it("Sends the container to the UC", () => {
    const { uc, appObjects } = makeTestRig();

    clearAssetPluginContainer(appObjects);

    expect(uc.clearContainer).toBeCalled();
  });

  it("Errors if it cannot find the uc", () => {
    const { uc, appObjects } = makeTestRig();

    appObjects.submitWarning = jest.fn();
    uc.dispose();

    clearAssetPluginContainer(appObjects);

    expect(appObjects.submitWarning).toBeCalled();
  });
});
