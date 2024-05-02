import { AppObject, makeAppObject } from "./AppObject";
import { AppObjectComponent } from "./AppObjectComponent";
import { makeAppObjectRepo } from "./AppObjectRepo";

export function makeTestRig() {
  const repo = makeAppObjectRepo();
  const appObj = makeAppObject("obj id", repo);
  const observer = jest.fn();
  appObj.addObserver(observer);

  return { repo, appObj, observer };
}

describe("App Object", () => {
  it("Adds itself to the repo", () => {
    const { repo, appObj } = makeTestRig();

    expect(repo.has(appObj.id)).toEqual(true);
  });

  it("Removes itself from the repo when disposed", () => {
    const { repo, appObj } = makeTestRig();

    appObj.dispose();
    expect(repo.has(appObj.id)).toEqual(false);
  });

  it("Checks to see it has a component", () => {
    const { appObj } = makeTestRig();

    expect(appObj.hasComponent(MockComponent.type)).toEqual(false);

    new MockComponent(appObj);

    expect(appObj.hasComponent(MockComponent.type)).toEqual(true);
  });

  it("Notifies when an component is added", () => {
    const { appObj, observer } = makeTestRig();

    new MockComponent(appObj);

    expect(observer).toBeCalled();
  });

  it("Gets a component", () => {
    const { appObj } = makeTestRig();

    expect(appObj.getComponent(MockComponent.type)).toEqual(undefined);

    const mockComponent = new MockComponent(appObj);

    expect(appObj.getComponent(MockComponent.type)).toEqual(mockComponent);
  });

  it("Warns if a component is replaced", () => {
    const { appObj } = makeTestRig();

    console.warn = jest.fn();

    const mockComponent = new MockComponent(appObj);
    appObj.addComponent(mockComponent);
    appObj.addComponent(new MockComponent(appObj));

    expect(console.warn).toBeCalled();
  });

  it("Returns the component list", () => {
    const { appObj } = makeTestRig();

    expect(appObj.allComponents()).toEqual([]);

    const mockComponent = new MockComponent(appObj);
    appObj.addComponent(mockComponent);

    const anotherMockComponent = new AnotherMockComponent(appObj);
    appObj.addComponent(anotherMockComponent)

    expect(appObj.allComponents()).toEqual([mockComponent, anotherMockComponent]);
  });

  it("Removes a component", () => {
    const { appObj } = makeTestRig();
    const comp = new MockComponent(appObj);
    appObj.addComponent(comp)

    expect(appObj.hasComponent(MockComponent.type)).toEqual(true);

    appObj.removeComponent(MockComponent.type);

    expect(appObj.hasComponent(MockComponent.type)).toEqual(false);
  });

  it("Notifies when an component is removed", () => {
    const { appObj, observer } = makeTestRig();
    const comp = new MockComponent(appObj);
    appObj.addComponent(comp)
    observer.mockClear();

    appObj.removeComponent(MockComponent.type);
    appObj.removeComponent(MockComponent.type);
    appObj.removeComponent(MockComponent.type);

    expect(observer).toHaveBeenCalledTimes(1);
  });

  it("Disposes all components when the App Object is disposed", () => {
    const { appObj } = makeTestRig();

    const comp = new MockComponent(appObj);
    appObj.addComponent(comp)

    const spy = jest.spyOn(comp, "dispose");

    appObj.dispose();

    expect(spy).toBeCalled();
  });

  it("Clears the component list when disposed", () => {
    const { appObj } = makeTestRig();

    const comp = new MockComponent(appObj);
    appObj.addComponent(comp)

    expect(appObj.allComponents()).toHaveLength(1);

    appObj.dispose();

    expect(appObj.allComponents()).toHaveLength(0);
  });

  it("If an entity is replace, it disposes the original", () => {
    const { appObj } = makeTestRig();

    const comp = new MockComponent(appObj);
    appObj.addComponent(comp)

    const spy = jest.spyOn(comp, "dispose");
    appObj.addComponent(new MockComponent(appObj))

    expect(spy).toBeCalled();
  });
});

class MockComponent extends AppObjectComponent {
  static readonly type: string = "mockComponent";
  constructor(appObject: AppObject) {
    super(appObject, MockComponent.type)
  }
}

class AnotherMockComponent extends AppObjectComponent {
  static readonly type: string = "mockComponent2";
  constructor(appObject: AppObject) {
    super(appObject, AnotherMockComponent.type)
  }
}