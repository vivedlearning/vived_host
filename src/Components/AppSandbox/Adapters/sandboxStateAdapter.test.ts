import { makeHostAppObjectRepo } from "../../../HostAppObject/HostAppObjectRepo";
import { SandboxState } from "../Entities/AppSandboxEntity";
import { makeRenderAppPMMock } from "../Mocks/RenderAppPMMock";
import { sandboxStateAdapter } from "./sandboxStateAdapter";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const mockPM = makeRenderAppPMMock(appObjects);
  return { appObjects, mockPM };
}

describe("Sandbox State PM Adapter", () => {
  it("Sets the Default VM", () => {
    expect(sandboxStateAdapter.defaultVM).toEqual(SandboxState.UNMOUNTED);
  });

  it("Add a view on subscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.addView = jest.fn();
    const setVM = jest.fn();

    sandboxStateAdapter.subscribe(appObjects, setVM);

    expect(mockPM.addView).toBeCalledWith(setVM);
  });

  it("Removes a view on unsubscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.removeView = jest.fn();
    const setVM = jest.fn();

    sandboxStateAdapter.unsubscribe(appObjects, setVM);

    expect(mockPM.removeView).toBeCalledWith(setVM);
  });
});
