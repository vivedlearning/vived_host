import { makeAppObjectRepo } from "@vived/core";
import { DialogAlertDTO, AlertDialogEntity } from "../Entities";
import {
  AlertDialogPM,
  AlertDialogVM,
  makeAlertDialogPM
} from "./AlertDialogPM";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const ao = appObjects.getOrCreate("dialog1");

  const data: DialogAlertDTO = {
    buttonLabel: "a button",
    message: "a message",
    onClose: jest.fn(),
    title: "a title"
  };
  const dialog = new AlertDialogEntity(data, ao);
  const pm = makeAlertDialogPM(ao);

  return { pm, dialog, appObjects };
}

describe("Alert Dialog PM", () => {
  it("Initializes the last vm", () => {
    const { pm } = makeTestRig();
    expect(pm.lastVM).not.toBeUndefined();
  });

  it("Warns if it cannot find the app object by ID when getting", () => {
    const { appObjects } = makeTestRig();

    appObjects.submitWarning = jest.fn();

    AlertDialogPM.get("unknownID", appObjects);

    expect(appObjects.submitWarning).toBeCalled();
  });

  it("Warns if the App Object does not have the UC when getting", () => {
    const { appObjects } = makeTestRig();

    appObjects.submitWarning = jest.fn();

    appObjects.getOrCreate("anAppObject");
    AlertDialogPM.get("anAppObject", appObjects);

    expect(appObjects.submitWarning).toBeCalled();
  });

  it("Returns the UC when getting", () => {
    const { appObjects, pm } = makeTestRig();

    const returnedPM = AlertDialogPM.get("dialog1", appObjects);

    expect(returnedPM).toEqual(pm);
  });

  it("Checks for equal VMs", () => {
    const { pm } = makeTestRig();

    const vm1: AlertDialogVM = {
      message: "a message",
      buttonLabel: "a button",
      close: () => {},
      title: "A Title"
    };

    const vm2 = { ...vm1 };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(true);
  });

  it("Checks for a change in the message", () => {
    const { pm } = makeTestRig();

    const vm1: AlertDialogVM = {
      message: "a message",
      buttonLabel: "a button",
      close: () => {},
      title: "A Title"
    };

    const vm2 = { ...vm1, message: "Something Else" };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Checks for a change in the title", () => {
    const { pm } = makeTestRig();

    const vm1: AlertDialogVM = {
      message: "a message",
      buttonLabel: "a button",
      close: () => {},
      title: "A Title"
    };

    const vm2 = { ...vm1, title: "Something Else" };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Checks for a change in the buttonLabel", () => {
    const { pm } = makeTestRig();

    const vm1: AlertDialogVM = {
      message: "a message",
      buttonLabel: "a button",
      close: () => {},
      title: "A Title"
    };

    const vm2 = { ...vm1, buttonLabel: "Something Else" };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Sets up the vm from the entity", () => {
    const { pm, dialog } = makeTestRig();

    expect(pm.lastVM?.buttonLabel).toEqual(dialog.buttonLabel);
    expect(pm.lastVM?.close).toEqual(dialog.close);
    expect(pm.lastVM?.message).toEqual(dialog.message);
    expect(pm.lastVM?.title).toEqual(dialog.title);
  });
});
