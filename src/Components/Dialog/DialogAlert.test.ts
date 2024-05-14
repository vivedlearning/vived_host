import { DialogAlert, DialogAlertDTO } from "./DialogAlert";

describe("Alert Dialog", () => {
  it("Sets the open to false when close is called", () => {
    const data: DialogAlertDTO = {
      buttonLabel: "button label",
      message: "a message",
      onClose: jest.fn(),
      title: "a title",
    };

    const alert = new DialogAlert(data);
    alert.isOpen = true;

    alert.close();

    expect(alert.isOpen).toEqual(false);
  });

  it("Calls the onClose when closed", () => {
    const data: DialogAlertDTO = {
      buttonLabel: "button label",
      message: "a message",
      onClose: jest.fn(),
      title: "a title",
    };

    const alert = new DialogAlert(data);
    alert.close();

    expect(data.onClose).toBeCalled();
  });
});
