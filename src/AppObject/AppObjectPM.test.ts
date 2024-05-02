import { AppObject } from "./AppObject";
import { AppObjectPM } from "./AppObjectPM";
import { makeAppObjectRepo } from "./AppObjectRepo";

interface MockVM {
  val: number;
}

class MockPM extends AppObjectPM<MockVM> {
  static readonly type = "MockPM";

  readonly defaultVM = { val: 0 };
  get currentVM(): MockVM {
    return { val: 5 };
  }

  vmsAreEqual(a: MockVM, b: MockVM): boolean {
    return a.val === b.val;
  }

  constructor(appObj: AppObject) {
    super(appObj, MockPM.type);
  }
}

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const appObj = appObjects.getOrCreate("appObj");

  return { appObj, appObjects };
}

describe("App Object PM", () => {
  it("Initializes with the last VM if it has been set", () => {
    const { appObj } = makeTestRig();
    const pm = new MockPM(appObj);
    const view = jest.fn();

    pm.doUpdateView({ val: 6 });

    pm.addView(view);

    expect(view).toBeCalledWith({ val: 6 });
  });

  it("Adds a view but does not call it if no VM has been set", () => {
    const { appObj } = makeTestRig();
    const pm = new MockPM(appObj);
    const view = jest.fn();

    pm.addView(view);

    expect(view).not.toBeCalled();
  });

  it("Doesn't notify if the vms are equal", () => {
    const { appObj } = makeTestRig();
    const pm = new MockPM(appObj);
    const view = jest.fn();

    pm.doUpdateView({ val: 6 });
    pm.addView(view);

    view.mockClear();

    pm.doUpdateView({ val: 6 });
    pm.doUpdateView({ val: 6 });
    pm.doUpdateView({ val: 6 });

    expect(view).not.toBeCalled();
  });

  it("Removes a view", () => {
    const { appObj } = makeTestRig();
    const pm = new MockPM(appObj);
    const view = jest.fn();

    pm.addView(view);

    view.mockClear();

    pm.removeView(view);

    pm.doUpdateView({ val: 10 });

    expect(view).not.toBeCalled();
  });

  it("Can be disposed", () => {
    const { appObj } = makeTestRig();
    const pm = new MockPM(appObj);
    const view = jest.fn();

    pm.addView(view);
    view.mockClear();

    pm.dispose();

    pm.doUpdateView({ val: 10 });

    expect(view).not.toBeCalled();
  });

  it("Adds itself to the App Object", () => {
    const { appObj } = makeTestRig();

    expect(appObj.hasComponent(MockPM.type)).toEqual(false);

    const pm = new MockPM(appObj);

    expect(appObj.hasComponent(MockPM.type)).toEqual(true);
  });

  it("Removes itself from the App Object when disposed", () => {
    const { appObj } = makeTestRig();
    const pm = new MockPM(appObj);

    expect(appObj.hasComponent(MockPM.type)).toEqual(true);

    pm.dispose();

    expect(appObj.hasComponent(MockPM.type)).toEqual(false);
  });

  it("Returns the repo", () => {
    const { appObj, appObjects } = makeTestRig();

    const pm = new MockPM(appObj);
    expect(pm.appObjects).toEqual(appObjects);
  });

  it("Forwards a warn to the App Object Repo warn", () => {
    const { appObj, appObjects } = makeTestRig();
    appObjects.submitWarning = jest.fn();

    const pm = new MockPM(appObj);
    pm.warn("Some warning");

    expect(appObjects.submitWarning).toBeCalledWith(
      `appObj/MockPM`,
      "Some warning"
    );
  });
});
