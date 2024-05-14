import { DialogBase } from "./DialogBase";

function makeTestRig() {
  const dialog = new DialogBase("mock_dialog");
  const observer = jest.fn();
  dialog.addObserver(observer);

  return { dialog, observer };
}

describe("Dialog Base Entity Class", () => {
  it("Stores the type", () => {
    const { dialog } = makeTestRig();
    expect(dialog.type).toEqual("mock_dialog");
  });

  it("Notifies when isOpen changes", () => {
    const { dialog, observer } = makeTestRig();

    expect(dialog.isOpen).toEqual(false);

    dialog.isOpen = true;

    expect(dialog.isOpen).toEqual(true);
    expect(observer).toBeCalled();
    observer.mockClear();

    dialog.isOpen = false;

    expect(dialog.isOpen).toEqual(false);
    expect(observer).toBeCalled();
  });

  it("Does not notify if there is no change in the flag", ()=>{
    const { dialog, observer } = makeTestRig();

    expect(dialog.isOpen).toEqual(false);

    dialog.isOpen = false;
    dialog.isOpen = false;
    dialog.isOpen = false;

    expect(observer).not.toBeCalled();
  })
});
