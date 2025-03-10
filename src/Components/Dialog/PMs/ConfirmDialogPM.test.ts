import { makeAppObjectRepo } from "@vived/core";
import { DialogConfirmDTO, ConfirmDialogEntity } from "../Entities";
import {
  ConfirmDialogPM,
  ConfirmDialogVM,
  makeConfirmDialogPM
} from "./ConfirmDialogPM";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const ao = appObjects.getOrCreate("dialog1");

  const mockConfirm = jest.fn();
  const mockCancel = jest.fn();

  const data: DialogConfirmDTO = {
    cancelButtonLabel: "a cancel button",
    confirmButtonLabel: "a confirm button",
    message: "a message",
    onCancel: mockCancel,
    onConfirm: mockConfirm,
    title: "a title"
  };
  const dialog = new ConfirmDialogEntity(data, ao);
  const pm = makeConfirmDialogPM(ao);

  return { pm, dialog, appObjects, mockConfirm, mockCancel };
}

describe("Confirm Dialog PM", () => {
  it("Initializes the last vm", () => {
    const { pm } = makeTestRig();
    expect(pm.lastVM).not.toBeUndefined();
  });

  it("Warns if it cannot find the app object by ID when getting", () => {
    const { appObjects } = makeTestRig();

    appObjects.submitWarning = jest.fn();

    ConfirmDialogPM.get("unknownID", appObjects);

    expect(appObjects.submitWarning).toBeCalled();
  });

  it("Warns if the App Object does not have the UC when getting", () => {
    const { appObjects } = makeTestRig();

    appObjects.submitWarning = jest.fn();

    appObjects.getOrCreate("anAppObject");
    ConfirmDialogPM.get("anAppObject", appObjects);

    expect(appObjects.submitWarning).toBeCalled();
  });

  it("Returns the PM when getting", () => {
    const { appObjects, pm } = makeTestRig();

    const returnedPM = ConfirmDialogPM.get("dialog1", appObjects);

    expect(returnedPM).toEqual(pm);
  });

  it("Checks for equal VMs", () => {
    const { pm } = makeTestRig();

    const vm1: ConfirmDialogVM = {
      cancelButtonLabel: "a cancel button",
      confirmButtonLabel: "a confirm button",
      message: "a message",
      cancel: jest.fn(),
      confirm: jest.fn(),
      title: "a title"
    };

    const vm2 = { ...vm1 };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(true);
  });

  it("Checks for a change in the message", () => {
    const { pm } = makeTestRig();

    const vm1: ConfirmDialogVM = {
      cancelButtonLabel: "a cancel button",
      confirmButtonLabel: "a confirm button",
      message: "a message",
      cancel: jest.fn(),
      confirm: jest.fn(),
      title: "a title"
    };

    const vm2 = { ...vm1, message: "Something Else" };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Checks for a change in the title", () => {
    const { pm } = makeTestRig();

    const vm1: ConfirmDialogVM = {
      cancelButtonLabel: "a cancel button",
      confirmButtonLabel: "a confirm button",
      message: "a message",
      cancel: jest.fn(),
      confirm: jest.fn(),
      title: "a title"
    };

    const vm2 = { ...vm1, title: "Something Else" };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Checks for a change in the confirm button", () => {
    const { pm } = makeTestRig();

    const vm1: ConfirmDialogVM = {
      cancelButtonLabel: "a cancel button",
      confirmButtonLabel: "a confirm button",
      message: "a message",
      cancel: jest.fn(),
      confirm: jest.fn(),
      title: "a title"
    };

    const vm2 = { ...vm1, confirmButtonLabel: "Something Else" };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Checks for a change in the cancel button", () => {
    const { pm } = makeTestRig();

    const vm1: ConfirmDialogVM = {
      cancelButtonLabel: "a cancel button",
      confirmButtonLabel: "a confirm button",
      message: "a message",
      cancel: jest.fn(),
      confirm: jest.fn(),
      title: "a title"
    };

    const vm2 = { ...vm1, cancelButtonLabel: "Something Else" };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Sets up the vm from the entity", () => {
    const { pm, dialog } = makeTestRig();

    expect(pm.lastVM?.cancelButtonLabel).toEqual(dialog.cancelButtonLabel);
    expect(pm.lastVM?.confirmButtonLabel).toEqual(dialog.confirmButtonLabel);
    expect(pm.lastVM?.message).toEqual(dialog.message);
    expect(pm.lastVM?.title).toEqual(dialog.title);
  });

  it("Wires up the callbacks", () => {
    const { pm, mockCancel, mockConfirm } = makeTestRig();

    pm.lastVM?.cancel();
    expect(mockCancel).toBeCalled();

    pm.lastVM?.confirm();
    expect(mockConfirm).toBeCalled();
  });
});
