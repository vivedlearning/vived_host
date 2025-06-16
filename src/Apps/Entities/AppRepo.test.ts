import { makeAppObjectRepo } from "@vived/core";
import { makeAppRepo } from "./AppRepo";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const repo = makeAppRepo(appObjects.getOrCreate("AppRepo"));
  const repoChangeObserver = jest.fn();

  repo.addChangeObserver(repoChangeObserver);

  return { repo, repoChangeObserver };
}

test("Creating an app", () => {
  const { repo, repoChangeObserver } = makeTestRig();

  expect(repo.getAllApps()).toHaveLength(0);

  const app = repo.getOrCreate("appID");

  expect(app.id).toEqual("appID");
  expect(repo.getAllApps()).toHaveLength(1);
  expect(repoChangeObserver).toBeCalled();
});

test("Has", () => {
  const { repo } = makeTestRig();

  repo.getOrCreate("appID");

  expect(repo.hasApp("appID")).toEqual(true);
  expect(repo.hasApp("otherApp")).toEqual(false);
});

test("Getting an app", () => {
  const { repo } = makeTestRig();

  const app = repo.getOrCreate("appID");
  const gottenApp = repo.getApp("appID");

  expect(gottenApp).toEqual(app);
});

test("Getting an unknown app should return undefined", () => {
  const { repo } = makeTestRig();
  const app = repo.getApp("yolo");
  expect(app).toBeUndefined();
});

test("Deleting an app", () => {
  const { repo, repoChangeObserver } = makeTestRig();
  repo.getOrCreate("appID");

  repoChangeObserver.mockClear();

  repo.deleteApp("appID");

  expect(repo.getAllApps()).toHaveLength(0);
  expect(repoChangeObserver).toBeCalled();
});

test("Deleting an unknown app should not notify", () => {
  const { repo, repoChangeObserver } = makeTestRig();
  repo.getOrCreate("appID");

  repoChangeObserver.mockClear();

  repo.deleteApp("unknown");

  expect(repoChangeObserver).not.toBeCalled();
});

test("Any app change observer is hooked up", () => {
  const { repo, repoChangeObserver } = makeTestRig();

  const app = repo.getOrCreate("appID");

  app.errorMessage = "An Error";

  expect(repoChangeObserver).toBeCalled();
});

test("Deleting all apps", () => {
  const { repo, repoChangeObserver } = makeTestRig();
  repo.getOrCreate("app1");
  repo.getOrCreate("app2");
  repo.getOrCreate("app3");

  repoChangeObserver.mockClear();

  repo.deleteAllApps();

  expect(repo.getAllApps()).toHaveLength(0);
  expect(repoChangeObserver).toBeCalledTimes(3);
});

test("getOrCreate returns existing app when one exists", () => {
  const { repo } = makeTestRig();

  const app1 = repo.getOrCreate("appID");
  const app2 = repo.getOrCreate("appID");

  expect(app1).toBe(app2);
  expect(repo.getAllApps()).toHaveLength(1);
});

test("getOrCreate creates new app using factory when none exists", () => {
  const { repo } = makeTestRig();

  expect(repo.getAllApps()).toHaveLength(0);

  const app = repo.getOrCreate("newAppID");

  expect(app.id).toEqual("newAppID");
  expect(repo.getAllApps()).toHaveLength(1);
});

test("appFactory creates valid AppEntity instances", () => {
  const { repo } = makeTestRig();

  const app = repo.appFactory("factoryTestID");

  expect(app.id).toEqual("factoryTestID");
  expect(app).toBeDefined();
});

test("Factory method can be overridden for custom behavior", () => {
  const { repo } = makeTestRig();

  // Store original factory
  const originalFactory = repo.appFactory;

  // Override the factory
  repo.appFactory = (id: string) => {
    const app = originalFactory.call(repo, id);
    app.name = "Factory Created App";
    return app;
  };

  const newApp = repo.getOrCreate("overriddenID");

  expect(newApp.name).toEqual("Factory Created App");
});
