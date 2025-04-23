import { makeAppObjectRepo, Version, VersionStage } from "@vived/core";
import { AppEntity, AppState, makeAppEntity } from "./AppEntity";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const app = makeAppEntity(appObjects.getOrCreate("appID"));
  const observer = jest.fn();
  app.addChangeObserver(observer);

  return { app, observer, appObjects };
}

describe("App Entity", () => {
  it("Gets by ID", () => {
    const { app, appObjects } = makeTestRig();

    expect(AppEntity.get("appID", appObjects)).toEqual(app);
  });

  it("Initializes as expected", () => {
    const { app } = makeTestRig();

    expect(app.id).toEqual("appID");
    expect(app.name).toEqual("");
    expect(app.description).toEqual("");
    expect(app.image_url).toEqual("");
    expect(app.imageAssetId).toBeUndefined();
    expect(app.isMounted).toEqual(false);
    expect(app.versions).toHaveLength(0);
    expect(app.mountedVersion).toBeUndefined();
    expect(app.styles).toHaveLength(0);
    expect(app.appAssetFolderURL).toBeUndefined();
    expect(app.assignedToOwner).toEqual(false);
  });

  it("Sets the loaded version", () => {
    const { app, observer } = makeTestRig();

    const version = new Version(1, 2, 3, VersionStage.RELEASED);
    app.mountedVersion = version;

    expect(app.isMounted).toEqual(true);
    expect(app.mountedVersion).toEqual(version);
    expect(observer).toBeCalled();
  });

  it("Sets the same loaded version should not notify", () => {
    const { app, observer } = makeTestRig();

    const version = new Version(1, 2, 3, VersionStage.RELEASED);
    app.mountedVersion = version;

    observer.mockClear();

    app.mountedVersion = version;
    app.mountedVersion = version;
    app.mountedVersion = version;

    expect(observer).not.toBeCalled();
  });

  it("Clears the loaded version", () => {
    const { app, observer } = makeTestRig();

    const version = new Version(1, 2, 3, VersionStage.RELEASED);
    app.mountedVersion = version;

    observer.mockClear();

    app.mountedVersion = undefined;

    expect(app.isMounted).toEqual(false);
    expect(app.mountedVersion).toBeUndefined();
    expect(observer).toBeCalled();

    observer.mockClear();

    app.mountedVersion = undefined;
    app.mountedVersion = undefined;
    app.mountedVersion = undefined;

    expect(observer).not.toBeCalled();
  });

  it("Reports if an update is available", () => {
    const { app } = makeTestRig();
    app.versions = [
      new Version(1, 2, 3, VersionStage.RELEASED),
      new Version(1, 0, 3, VersionStage.RELEASED),
      new Version(2, 5, 6, VersionStage.RELEASED)
    ];

    const version = new Version(1, 2, 3, VersionStage.RELEASED);
    app.mountedVersion = version;

    expect(app.updateIsAvailable).toEqual(true);
  });

  it("Sets an error message", () => {
    const { app, observer } = makeTestRig();
    expect(app.errorMessage).toBeUndefined();
    expect(app.hasError).toEqual(false);

    app.errorMessage = "uh oh!";

    expect(app.errorMessage).toEqual("uh oh!");
    expect(observer).toBeCalled();
    expect(app.hasError).toEqual(true);

    observer.mockClear();

    app.errorMessage = "uh oh!";
    app.errorMessage = "uh oh!";
    app.errorMessage = "uh oh!";

    expect(observer).not.toBeCalled();
  });

  it("Gets and sets the state", () => {
    const { app, observer } = makeTestRig();

    expect(app.state).toBe(AppState.INIT);

    app.state = AppState.ERROR;

    expect(app.state).toBe(AppState.ERROR);

    expect(observer).toBeCalled();
  });

  it("Gets and sets assignedToOwner", () => {
    const { app, observer } = makeTestRig();

    expect(app.assignedToOwner).toEqual(false);

    app.assignedToOwner = true;

    expect(app.assignedToOwner).toEqual(true);

    expect(observer).toBeCalled();
  });

  it("Gets and sets imageAssetId", () => {
    const { app, observer } = makeTestRig();

    expect(app.imageAssetId).toBeUndefined();

    app.imageAssetId = "assetID123";

    expect(app.imageAssetId).toEqual("assetID123");
    expect(observer).toBeCalled();

    observer.mockClear();

    app.imageAssetId = "assetID123";
    app.imageAssetId = "assetID123";

    expect(observer).not.toBeCalled();

    app.imageAssetId = "differentAssetID";

    expect(app.imageAssetId).toEqual("differentAssetID");
    expect(observer).toBeCalled();

    observer.mockClear();

    app.imageAssetId = undefined;

    expect(app.imageAssetId).toBeUndefined();
    expect(observer).toBeCalled();
  });

  it("Gets and sets image_url with change notifications", () => {
    const { app, observer } = makeTestRig();

    expect(app.image_url).toEqual("");

    app.image_url = "https://example.com/image.jpg";

    expect(app.image_url).toEqual("https://example.com/image.jpg");
    expect(observer).toBeCalled();

    observer.mockClear();

    app.image_url = "https://example.com/image.jpg";
    app.image_url = "https://example.com/image.jpg";

    expect(observer).not.toBeCalled();

    app.image_url = "https://example.com/different-image.jpg";

    expect(app.image_url).toEqual("https://example.com/different-image.jpg");
    expect(observer).toBeCalled();
  });
});
