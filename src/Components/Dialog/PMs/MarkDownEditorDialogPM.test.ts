import { makeHostAppObjectRepo } from "../../../HostAppObject";
import {
  DialogMarkDownEditorDTO,
  MarkDownEditorDialogEntity
} from "../Entities";
import {
  makeMarkDownEditorDialogPM,
  MarkDownEditorDialogPM,
  MarkDownEditorDialogVM
} from "./MarkDownEditorDialogPM";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const ao = appObjects.getOrCreate("dialog1");

  const mockConfirm = jest.fn();
  const data: DialogMarkDownEditorDTO = {
    initialText: "initial text",
    onConfirm: mockConfirm
  };

  const dialog = new MarkDownEditorDialogEntity(data, ao);
  const pm = makeMarkDownEditorDialogPM(ao);

  return { pm, dialog, appObjects, mockConfirm };
}

describe("MarkDown Editor Dialog PM", () => {
  it("Initializes the last vm", () => {
    const { pm } = makeTestRig();
    expect(pm.lastVM).not.toBeUndefined();
  });

  it("Warns if it cannot find the app object by ID when getting", () => {
    const { appObjects } = makeTestRig();

    appObjects.submitWarning = jest.fn();

    MarkDownEditorDialogPM.get("unknownID", appObjects);

    expect(appObjects.submitWarning).toBeCalled();
  });

  it("Warns if the App Object does not have the UC when getting", () => {
    const { appObjects } = makeTestRig();

    appObjects.submitWarning = jest.fn();

    appObjects.getOrCreate("anAppObject");
    MarkDownEditorDialogPM.get("anAppObject", appObjects);

    expect(appObjects.submitWarning).toBeCalled();
  });

  it("Returns the PM when getting", () => {
    const { appObjects, pm } = makeTestRig();

    const returnedPM = MarkDownEditorDialogPM.get("dialog1", appObjects);

    expect(returnedPM).toEqual(pm);
  });

  it("Checks for equal VMs", () => {
    const { pm } = makeTestRig();

    const vm1: MarkDownEditorDialogVM = {
      initialText: "some text",
      confirm: jest.fn()
    };

    const vm2 = { ...vm1 };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(true);
  });

  it("Checks for a change in the initialText", () => {
    const { pm } = makeTestRig();

    const vm1: MarkDownEditorDialogVM = {
      initialText: "some text",
      confirm: jest.fn()
    };

    const vm2 = { ...vm1, initialText: "Something Else" };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Sets up the vm from the entity", () => {
    const { pm, dialog } = makeTestRig();

    expect(pm.lastVM?.initialText).toEqual(dialog.initialText);
  });

  it("Wires up the callbacks", () => {
    const { pm, mockConfirm } = makeTestRig();

    pm.lastVM?.confirm("some text");
    expect(mockConfirm).toBeCalledWith("some text");
  });
});
