import { DialogConfirm, DialogConfirmDTO } from "./DialogConfirm";

describe("Alert Dialog", () => {
  it("Sets the open to false when cancel is called", () => {
    const data: DialogConfirmDTO = {
      confirmButtonLabel: "confirm label",
      cancelButtonLabel: "cancel label",
      message: "a message",
      onCancel: jest.fn(),
      onConfirm: jest.fn(),
      title: "a title",
    };

    const alert = new DialogConfirm(data);
    alert.isOpen = true;
    alert.cancel();

    expect(alert.isOpen).toEqual(false);
  });

  it("Calls the onCancel when cancelled", () => {
    const data: DialogConfirmDTO = {
      confirmButtonLabel: "confirm label",
      cancelButtonLabel: "cancel label",
      message: "a message",
      onCancel: jest.fn(),
      onConfirm: jest.fn(),
      title: "a title",
    };

    const alert = new DialogConfirm(data);
    alert.cancel();

    expect(data.onCancel).toBeCalled();
  });

  it("Sets the open to false when accept is called", () => {
    const data: DialogConfirmDTO = {
      confirmButtonLabel: "confirm label",
      cancelButtonLabel: "cancel label",
      message: "a message",
      onCancel: jest.fn(),
      onConfirm: jest.fn(),
      title: "a title",
    };

    const alert = new DialogConfirm(data);
    alert.isOpen = true;
    alert.confirm();

    expect(alert.isOpen).toEqual(false);
  });

  it("Calls the onAccept when accepted", () => {
    const data: DialogConfirmDTO = {
      confirmButtonLabel: "confirm label",
      cancelButtonLabel: "cancel label",
      message: "a message",
      onCancel: jest.fn(),
      onConfirm: jest.fn(),
      title: "a title",
    };

    const alert = new DialogConfirm(data);
    alert.confirm();

    expect(data.onConfirm).toBeCalled();
  });
});
