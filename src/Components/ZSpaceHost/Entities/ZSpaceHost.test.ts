import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeZSpaceHostEntity } from "./ZSpaceHost";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const zSpace = makeZSpaceHostEntity(appObjects.getOrCreate("ZSpace"));
  const observer = jest.fn();
  zSpace.addChangeObserver(observer);

  return { zSpace, observer };
}

describe("ZSpace Host Entity", () => {
  it("Notifies when is supported changes", () => {
    const { zSpace, observer } = makeTestRig();

    expect(zSpace.isSupported).toEqual(false);

    zSpace.isSupported = true;

    expect(zSpace.isSupported).toEqual(true);
    expect(observer).toBeCalled();
    observer.mockClear();

    zSpace.isSupported = false;

    expect(zSpace.isSupported).toEqual(false);
    expect(observer).toBeCalled();
  });

  it("Does not notify if the is supported flag is set but does not change", () => {
    const { zSpace, observer } = makeTestRig();
    expect(zSpace.isSupported).toEqual(false);

    zSpace.isSupported = false;
    zSpace.isSupported = false;
    zSpace.isSupported = false;

    expect(observer).not.toBeCalled();
  });

  it("Notifies when is active changes", () => {
    const { zSpace, observer } = makeTestRig();

    expect(zSpace.isActive).toEqual(false);

    zSpace.isActive = true;

    expect(zSpace.isActive).toEqual(true);
    expect(observer).toBeCalled();
    observer.mockClear();

    zSpace.isActive = false;

    expect(zSpace.isActive).toEqual(false);
    expect(observer).toBeCalled();
  });

  it("Does not notify if the is active is set but does not change", () => {
    const { zSpace, observer } = makeTestRig();
    expect(zSpace.isActive).toEqual(false);

    zSpace.isActive = false;
    zSpace.isActive = false;
    zSpace.isActive = false;

    expect(observer).not.toBeCalled();
  });

  it("Notifies when is emulate changes", () => {
    const { zSpace, observer } = makeTestRig();

    expect(zSpace.emulate).toEqual(true);

    zSpace.emulate = false;

    expect(zSpace.emulate).toEqual(false);
    expect(observer).toBeCalled();
    observer.mockClear();

    zSpace.emulate = true;

    expect(zSpace.emulate).toEqual(true);
    expect(observer).toBeCalled();
  });

  it("Does not notify if the emulate flag is set but does not change", () => {
    const { zSpace, observer } = makeTestRig();
    expect(zSpace.emulate).toEqual(true);

    zSpace.emulate = true;
    zSpace.emulate = true;
    zSpace.emulate = true;

    expect(observer).not.toBeCalled();
  });
});
