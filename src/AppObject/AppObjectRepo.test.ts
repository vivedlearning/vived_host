import { AppObject, makeAppObject } from "./AppObject";
import { AppObjectComponent } from "./AppObjectComponent";
import { makeAppObjectRepo } from "./AppObjectRepo";

function makeTestRig() {
  const repo = makeAppObjectRepo();

  const observer = jest.fn();
  repo.addObserver(observer);

  return { repo, observer };
}

describe("Observable appObject Repo", () => {
  it("Allows an App Object to be added", () => {
    const { repo } = makeTestRig();
    const appObject = makeAppObject("appObj", repo);

    expect(repo.has(appObject.id)).toEqual(true);
  });

  it("Notifies when an appObject is added", () => {
    const { repo, observer } = makeTestRig();
    makeAppObject("appObj", repo);

    expect(observer).toBeCalled();
  });

  it("Forwards notification from an added App Object", () => {
    const { repo, observer } = makeTestRig();
    const appObject = makeAppObject("appObj", repo);

    observer.mockClear();

    appObject.notify();

    expect(observer).toBeCalled();
  });

  it("Stops notifying if adding an App Object replaces and existing appObject", () => {
    const { repo, observer } = makeTestRig();

    const original = makeAppObject("appObj", repo);
    makeAppObject("appObj", repo);
    observer.mockClear();

    original.notify();

    expect(observer).not.toBeCalled();
  });

  it("Removes an App Object", () => {
    const { repo } = makeTestRig();
    const appObject = makeAppObject("appObj", repo);

    expect(repo.has(appObject.id)).toEqual(true);

    repo.remove(appObject.id);

    expect(repo.has(appObject.id)).toEqual(false);
  });

  it("Notifies if an App Object is removed", () => {
    const { repo, observer } = makeTestRig();
    const appObject = makeAppObject("appObj", repo);
    observer.mockClear();

    repo.remove(appObject.id);

    expect(observer).toBeCalled();
  });

  it("Does not notify if the App Object to be removed cannot be found", () => {
    const { repo, observer } = makeTestRig();

    repo.remove("someId");

    expect(observer).not.toBeCalled();
  });

  it("Stops observing a removed App Object", () => {
    const { repo, observer } = makeTestRig();
    const appObject = makeAppObject("appObj", repo);

    repo.remove(appObject.id);

    observer.mockClear();

    appObject.notify();

    expect(observer).not.toBeCalled();
  });

  it("Gets an App Object", () => {
    const { repo } = makeTestRig();
    const appObject = makeAppObject("appObj", repo);

    expect(repo.get("appObj")).toEqual(appObject);
  });

  it("Gets all App Objects", () => {
    const { repo } = makeTestRig();
    const appObject = makeAppObject("appObj", repo);

    expect(repo.getAll()).toEqual([appObject]);
  });

  it("Returns undefined for an unknown App Object", () => {
    const { repo } = makeTestRig();

    expect(repo.get("unknownID")).toBeUndefined();
  });

  it("Supports notifying an observer when an App Object is added", () => {
    const { repo } = makeTestRig();

    const addEntityObserver = jest.fn();
    repo.addAppObjectAddedObserver(addEntityObserver);

    const ent = makeAppObject("appObj", repo);

    expect(addEntityObserver).toBeCalledWith(ent);
  });

  it("Add App Object observer can be removed", () => {
    const { repo } = makeTestRig();

    const addEntityObserver = jest.fn();
    repo.addAppObjectAddedObserver(addEntityObserver);
    repo.removeAppObjectAddedObserver(addEntityObserver);

    makeAppObject("appObj", repo);

    expect(addEntityObserver).not.toBeCalled();
  });

  it("Supports notifying an observer when an App Object is removed", () => {
    const { repo } = makeTestRig();

    const removeEntityObserver = jest.fn();
    repo.addAppObjectRemovedObserver(removeEntityObserver);

    const ent = makeAppObject("appObj", repo);

    repo.remove("appObj");

    expect(removeEntityObserver).toBeCalledWith(ent);
  });

  it("Remove App Object observer can be removed", () => {
    const { repo } = makeTestRig();

    const removeEntityObserver = jest.fn();
    repo.addAppObjectRemovedObserver(removeEntityObserver);
    repo.removedAppObjectRemovedObserver(removeEntityObserver);

    makeAppObject("appObj", repo);
    repo.remove("appObj");

    expect(removeEntityObserver).not.toBeCalled();
  });

  it("Creats a new App Object when getOrCreate is called but the AO does not exist", () => {
    const { repo } = makeTestRig();

    expect(repo.has("ao1")).toEqual(false);

    const ao = repo.getOrCreate("ao1");

    expect(ao.id).toEqual("ao1");
    expect(repo.has("ao1")).toEqual(true);
  });

  it("Gets the existing App Object when getOrCreate is called and the AO exists", () => {
    const { repo } = makeTestRig();

    const appObject = makeAppObject("appObj", repo);
    const ao = repo.getOrCreate("appObj");

    expect(ao).toEqual(appObject);
  });

  it("Get all App Objects with component type", () => {
    const { repo } = makeTestRig();

    expect(repo.getAllAppObjectsWithComponent(MockComponent.type)).toEqual([]);

    makeAppObject("appObj1", repo);
    const appObj2 = makeAppObject("appObj2", repo);
    const appObj3 = makeAppObject("appObj3", repo);

    new MockComponent(appObj2);
    new MockComponent(appObj3);

    expect(repo.getAllAppObjectsWithComponent(MockComponent.type)).toEqual([
      appObj2,
      appObj3,
    ]);
  });

  it("Get a component on an object", () => {
    const { repo } = makeTestRig();

    const appObj = repo.getOrCreate("appObj");

    const comp = new MockComponent(appObj);

    expect(repo.getAppObjectComponent("appObj", MockComponent.type)).toEqual(
      comp
    );
  });

  it("Returns undefined if the App Object does not have an entity when calling get entity on object", () => {
    const { repo } = makeTestRig();

    repo.getOrCreate("appObj");

    expect(repo.getAppObjectComponent("appObj", MockComponent.type)).toEqual(
      undefined
    );
  });

  it("Returns undefined if the App Object does not exist when calling get entity on object", () => {
    const { repo } = makeTestRig();
    expect(repo.getAppObjectComponent("appObj", MockComponent.type)).toEqual(
      undefined
    );
  });

  it("Get all Components", () => {
    const { repo } = makeTestRig();

    expect(repo.getAllComponents<MockComponent>(MockComponent.type)).toEqual(
      []
    );

    const appObj1 = makeAppObject("appObj2", repo);
    const comp1 = new MockComponent(appObj1);

    const appObj2 = makeAppObject("appObj3", repo);
    const comp2 = new MockComponent(appObj2);

    expect(repo.getAllComponents<MockComponent>(MockComponent.type)).toEqual([
      comp1,
      comp2,
    ]);
  });

  it("Registers a singleton", () => {
    const { repo } = makeTestRig();
    const appObj1 = makeAppObject("appObj2", repo);
    const comp1 = new MockComponent(appObj1);

    repo.registerSingleton(comp1);

    expect(repo.getSingleton(MockComponent.type)).toEqual(comp1);
  });

  it("Warns and replaces if multiple singleton are registered", () => {
    const { repo } = makeTestRig();
    const appObj1 = makeAppObject("appObj1", repo);
    const comp1 = new MockComponent(appObj1);

    repo.registerSingleton(comp1);

    const appObj2 = makeAppObject("appObj2", repo);
    const comp2 = new MockComponent(appObj2);

    repo.submitWarning = jest.fn();

    repo.registerSingleton(comp2);
    expect(repo.getSingleton(MockComponent.type)).toEqual(comp2);
    expect(repo.submitWarning).toBeCalled();
  });

  it("Searches for a singleton that has not been registered", () => {
    const { repo } = makeTestRig();
    const appObj1 = makeAppObject("appObj2", repo);
    const comp1 = new MockComponent(appObj1);

    repo.registerSingleton(comp1);

    expect(repo.getSingleton(MockComponent.type)).toEqual(comp1);
  });

  it("Warns if it cannot find a singleton", () => {
    const { repo } = makeTestRig();

    repo.submitWarning = jest.fn();

    repo.getSingleton(MockComponent.type);

    expect(repo.submitWarning).toBeCalled();
  });

  
  it("Warns if it finds multiple singletons and returns the first one", () => {
    const { repo } = makeTestRig();
    const appObj1 = makeAppObject("appObj1", repo);
    const comp1 = new MockComponent(appObj1);
    
    const appObj2 = makeAppObject("appObj2", repo);
    new MockComponent(appObj2);

    repo.submitWarning = jest.fn();

    expect(repo.getSingleton(MockComponent.type)).toEqual(comp1);
    expect(repo.submitWarning).toBeCalled();
  });
});

class MockComponent extends AppObjectComponent {
  static readonly type: string = "mockComponent";
  constructor(appObject: AppObject) {
    super(appObject, MockComponent.type);
  }
}
