import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { MockMarkDownEditorDialogPM } from "../Mocks";
import { defaultMarkDownEditorDialogVM } from "../PMs";
import { markDownEditorDialogAdapters } from "./markDownEditorDialogAdapters";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const ao = appObjects.getOrCreate("id");

  const mockPM = new MockMarkDownEditorDialogPM(ao);
  return { appObjects, mockPM };
}

describe("Markdown Dialog PM Adapter", () => {
  it("Sets the Default VM", () => {
    expect(markDownEditorDialogAdapters.defaultVM).toEqual(
      defaultMarkDownEditorDialogVM
    );
  });

  it("Add a view on subscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.addView = jest.fn();
    const setVM = jest.fn();

    markDownEditorDialogAdapters.subscribe("id", appObjects, setVM);

    expect(mockPM.addView).toBeCalledWith(setVM);
  });

  it("Removes a view on unsubscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.removeView = jest.fn();
    const setVM = jest.fn();

    markDownEditorDialogAdapters.unsubscribe("id", appObjects, setVM);

    expect(mockPM.removeView).toBeCalledWith(setVM);
  });
});
