import { AppObject, makeAppObject } from "./AppObject";
import { AppObjectEntity } from "./AppObjectEntity";
import { AppObjectEntityRepo } from "./AppObjectEntityRepo";
import { makeAppObjectRepo } from "./AppObjectRepo";

class MockAppEntity extends AppObjectEntity {
  static type: string = "mockEntity";

  constructor(appObject: AppObject) {
    super(appObject, MockAppEntity.type)
  }
}

class MockEntityRepoImp extends AppObjectEntityRepo<MockAppEntity> {
  static type: string = "Mock Repo";

  makeEntity(appObj: AppObject): MockAppEntity {
    return new MockAppEntity(appObj);
  }

  constructor(appObject: AppObject) {
    super(appObject, MockAppEntity.type)
  }
}

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const repoAppObj = makeAppObject("repo", appObjects);
  const repo = new MockEntityRepoImp(repoAppObj);
  
  const appObj = makeAppObject("appObjID", appObjects);
  const observer = jest.fn();
  repo.addChangeObserver(observer);

  return { repo, observer, appObj };
}

describe("Observable Entity Repo", () => {
  it("Allows an entity to be added", () => {
    const { repo, appObj } = makeTestRig();
    const entity = new MockAppEntity(appObj);

    expect(repo.hasForAppObject("appObjID")).toEqual(false);

    repo.add(entity);

    expect(repo.hasForAppObject("appObjID")).toEqual(true);
  });

  it("Notifies when an entity is added", () => {
    const { repo, observer, appObj } = makeTestRig();
    const entity =new MockAppEntity(appObj);
    repo.add(entity);

    expect(observer).toBeCalled();
  });

  it("Forwards notification from an added entity", () => {
    const { repo, observer, appObj } = makeTestRig();
    const entity =new MockAppEntity(appObj);
    repo.add(entity);

    observer.mockClear();

    entity.notifyOnChange();

    expect(observer).toBeCalled();
  });

  it("Stops notifying if adding an entity replaces and exisitng entity", () => {
    const { repo, observer, appObj } = makeTestRig();

    console.warn = jest.fn(); //Replacing warns. This keeps the console clean

    const original =new MockAppEntity(appObj);
    repo.add(original);

    const replacement =new MockAppEntity(appObj);
    repo.add(replacement);
    observer.mockClear();

    original.notifyOnChange();

    expect(observer).not.toBeCalled();
  });

  it("Removes an entity", () => {
    const { repo, appObj } = makeTestRig();
    const entity =new MockAppEntity(appObj);

    repo.add(entity);

    expect(repo.hasForAppObject("appObjID")).toEqual(true);

    repo.removeForAppObject("appObjID");

    expect(repo.hasForAppObject("appObjID")).toEqual(false);
  });

  it("Notifies if an entity is removed", () => {
    const { repo, observer, appObj } = makeTestRig();
    const entity =new MockAppEntity(appObj);

    repo.add(entity);
    observer.mockClear();

    repo.removeForAppObject("appObjID");

    expect(observer).toBeCalled();
  });

  it("Does not notifyOnChange if the entity to be removed cannot be found", () => {
    const { repo, observer } = makeTestRig();

    repo.removeForAppObject("someId");
    repo.removeForAppObject("someId");
    repo.removeForAppObject("someId");

    expect(observer).not.toBeCalled();
  });

  it("Stops observing a removed entity", () => {
    const { repo, observer, appObj } = makeTestRig();
    const entity =new MockAppEntity(appObj);

    repo.add(entity);
    repo.removeForAppObject("appObjID");

    observer.mockClear();

    entity.notifyOnChange();

    expect(observer).not.toBeCalled();
  });

  it("Gets an entity", () => {
    const { repo, appObj } = makeTestRig();
    const entity =new MockAppEntity(appObj);
    repo.add(entity);

    expect(repo.getForAppObject("appObjID")).toEqual(entity);
  });

  it("Gets all entities", () => {
    const { repo, appObj } = makeTestRig();
    const entity =new MockAppEntity(appObj);
    repo.add(entity);

    expect(repo.getAll()).toEqual([entity]);
  });

  it("Returns undefined for an unknown entity", () => {
    const { repo } = makeTestRig();

    expect(repo.getForAppObject("unknownID")).toBeUndefined();
  });


  it("Supports notifying an observer when an entity is added", () => {
    const { repo, appObj } = makeTestRig();

    const addEntityObserver = jest.fn();
    repo.addEntityAddedObserver(addEntityObserver);

    const ent =new MockAppEntity(appObj);
    repo.add(ent);

    expect(addEntityObserver).toBeCalledWith(ent);
  });

  it("Add entity observer can be removed", () => {
    const { repo, appObj } = makeTestRig();

    const addEntityObserver = jest.fn();
    repo.addEntityAddedObserver(addEntityObserver);
    repo.removeEntityAddedObserver(addEntityObserver);

    const ent =new MockAppEntity(appObj);
    repo.add(ent);

    expect(addEntityObserver).not.toBeCalled();
  });

  it("Supports notifying an observer when an entity is removed", () => {
    const { repo, appObj } = makeTestRig();

    const removeEntityObserver = jest.fn();
    repo.addEntityRemovedObserver(removeEntityObserver);

    const ent =new MockAppEntity(appObj);
    repo.add(ent);

    repo.removeForAppObject("appObjID");

    expect(removeEntityObserver).toBeCalledWith(ent);
  });

  it("Remove entity observer can be removed", () => {
    const { repo, appObj } = makeTestRig();

    const removeEntityObserver = jest.fn();
    repo.addEntityRemovedObserver(removeEntityObserver);
    repo.removeEntityRemovedObserver(removeEntityObserver);

    const ent =new MockAppEntity(appObj);
    repo.add(ent);
    repo.removeForAppObject("appObjID");

    expect(removeEntityObserver).not.toBeCalled();
  });
});
