import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeAppSandboxEntity } from "../Entities/AppSandboxEntity";
import { MockShowBabylonInspectorUC } from "../Mocks/MockShowBabylonInspectorUC";
import { toggleShowInspector } from "./toggleShowInspector";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();

  const ao = appObjects.getOrCreate("AppID");
  const sandbox = makeAppSandboxEntity(ao);
  const mockUC = new MockShowBabylonInspectorUC(ao);

  return { sandbox, appObjects, ao, mockUC };
}

describe("Start App Controller", () => {
  it("Sends the container to the UC", () => {
    const { appObjects, mockUC } = makeTestRig();

    toggleShowInspector(appObjects);

    expect(mockUC.toggleShow).toBeCalled();
  });

  it("Warns if it cannot find the component", () => {
    const { appObjects, mockUC } = makeTestRig();
    appObjects.submitWarning = jest.fn();
    mockUC.dispose();

    toggleShowInspector(appObjects);

    expect(appObjects.submitWarning).toBeCalled();
  });
});
