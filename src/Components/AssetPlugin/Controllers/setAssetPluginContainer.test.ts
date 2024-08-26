import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeMockAssetPluginContainerUC } from "../Mocks/MockAssetPluginContainerUC";
import { setAssetPluginContainer } from "./setAssetPluginContainer";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();

  const uc = makeMockAssetPluginContainerUC(appObjects);

  return { uc, appObjects };
}

describe("Set Asset Plugin Container Controller", () => {
  it("Sends the container to the UC", () => {
    const { uc, appObjects } = makeTestRig();

    const container = document.createElement("div");
    setAssetPluginContainer(container, appObjects);

    expect(uc.setContainer).toBeCalledWith(container);
  });

  it("Errors if it cannot find the uc", () => {
    const { uc, appObjects } = makeTestRig();

    appObjects.submitWarning = jest.fn();
    uc.dispose();
    const container = document.createElement("div");
    setAssetPluginContainer(container, appObjects);

    expect(appObjects.submitWarning).toBeCalled();
  });
});
