import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeAppRepo } from "./AppRepo";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const repo = makeAppRepo(appObjects.getOrCreate("AppRepo"));
  const repoChangeObserver = jest.fn();

  repo.addChangeObserver(repoChangeObserver);

  return { repo, repoChangeObserver };
}

test("Creating an app", () => {
  const { repo, repoChangeObserver } = makeTestRig();

  expect(repo.getAllApps()).toHaveLength(0);

  const app = repo.createApp("appID");

  expect(app.id).toEqual("appID");
  expect(repo.getAllApps()).toHaveLength(1);
  expect(repoChangeObserver).toBeCalled();
});

test("Has", () => {
  const { repo } = makeTestRig();

  repo.createApp("appID");

  expect(repo.hasApp("appID")).toEqual(true);
  expect(repo.hasApp("otherApp")).toEqual(false);
});

test("Getting an app", () => {
  const { repo } = makeTestRig();

  const app = repo.createApp("appID");
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
  repo.createApp("appID");

  repoChangeObserver.mockClear();

  repo.deleteApp("appID");

  expect(repo.getAllApps()).toHaveLength(0);
  expect(repoChangeObserver).toBeCalled();
});

test("Deleting an unknown app should not notify", () => {
  const { repo, repoChangeObserver } = makeTestRig();
  repo.createApp("appID");

  repoChangeObserver.mockClear();

  repo.deleteApp("unknown");

  expect(repoChangeObserver).not.toBeCalled();
});

test("Any app change observer is hooked up", () => {
  const { repo, repoChangeObserver } = makeTestRig();

  const app = repo.createApp("appID");

  app.errorMessage = "An Error";

  expect(repoChangeObserver).toBeCalled();
});

test("Deleting all apps", () => {
  const { repo, repoChangeObserver } = makeTestRig();
  repo.createApp("app1");
  repo.createApp("app2");
  repo.createApp("app3");

  repoChangeObserver.mockClear();

  repo.deleteAllApps();

  expect(repo.getAllApps()).toHaveLength(0);
  expect(repoChangeObserver).toBeCalledTimes(3);
});
