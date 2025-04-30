import {
  AppObject,
  AppObjectRepo,
  makeAppObjectRepo,
  Version,
  VersionStage
} from "@vived/core";
import { ZSpaceHostEntity, makeZSpaceHostEntity } from "./ZSpaceHost";

let appObjects: AppObjectRepo;
let appObject: AppObject;
let zSpaceHostEntity: ZSpaceHostEntity;

beforeEach(() => {
  appObjects = makeAppObjectRepo();
  appObject = appObjects.getOrCreate("test object");
  zSpaceHostEntity = makeZSpaceHostEntity(appObject);
});

it("initializes isEnabled to false", () => {
  expect(zSpaceHostEntity.isEnabled).toBe(false);
});

it("sets isEnabled property", () => {
  zSpaceHostEntity.isEnabled = true;
  expect(zSpaceHostEntity.isEnabled).toBe(true);
});

it("notifies observers when isEnabled changes", () => {
  const mockObserver = jest.fn();
  zSpaceHostEntity.addChangeObserver(mockObserver);

  zSpaceHostEntity.isEnabled = true;

  expect(mockObserver).toHaveBeenCalled();
});

it("sets supported app versions", () => {
  const version1 = new Version(1, 2, 3, VersionStage.RELEASED);
  const version2 = new Version(2, 0, 0, VersionStage.RELEASED);

  const supportedVersions = new Map<string, Version>();
  supportedVersions.set("app1", version1);
  supportedVersions.set("app2", version2);

  zSpaceHostEntity.setSupportedAppVersions(supportedVersions);

  expect(zSpaceHostEntity.isAppSupported("app1", version1)).toBe(true);
  expect(zSpaceHostEntity.isAppSupported("app2", version2)).toBe(true);
});

it("returns false for unknown app IDs", () => {
  const version = new Version(1, 0, 0, VersionStage.RELEASED);
  expect(zSpaceHostEntity.isAppSupported("unknownApp", version)).toBe(false);
});

it("returns true when major version is higher than required", () => {
  const minVersion = new Version(1, 2, 3, VersionStage.RELEASED);
  const testVersion = new Version(2, 0, 0, VersionStage.RELEASED);

  const supportedVersions = new Map<string, Version>();
  supportedVersions.set("app1", minVersion);
  zSpaceHostEntity.setSupportedAppVersions(supportedVersions);

  expect(zSpaceHostEntity.isAppSupported("app1", testVersion)).toBe(true);
});

it("returns false when major version is lower than required", () => {
  const minVersion = new Version(2, 0, 0, VersionStage.RELEASED);
  const testVersion = new Version(1, 9, 9, VersionStage.RELEASED);

  const supportedVersions = new Map<string, Version>();
  supportedVersions.set("app1", minVersion);
  zSpaceHostEntity.setSupportedAppVersions(supportedVersions);

  expect(zSpaceHostEntity.isAppSupported("app1", testVersion)).toBe(false);
});

it("returns true when major version is same and minor version is higher", () => {
  const minVersion = new Version(1, 2, 0, VersionStage.RELEASED);
  const testVersion = new Version(1, 3, 0, VersionStage.RELEASED);

  const supportedVersions = new Map<string, Version>();
  supportedVersions.set("app1", minVersion);
  zSpaceHostEntity.setSupportedAppVersions(supportedVersions);

  expect(zSpaceHostEntity.isAppSupported("app1", testVersion)).toBe(true);
});

it("returns false when major version is same and minor version is lower", () => {
  const minVersion = new Version(1, 2, 0, VersionStage.RELEASED);
  const testVersion = new Version(1, 1, 9, VersionStage.RELEASED);

  const supportedVersions = new Map<string, Version>();
  supportedVersions.set("app1", minVersion);
  zSpaceHostEntity.setSupportedAppVersions(supportedVersions);

  expect(zSpaceHostEntity.isAppSupported("app1", testVersion)).toBe(false);
});

it("returns true when major and minor versions are same and patch is equal", () => {
  const minVersion = new Version(1, 2, 3, VersionStage.RELEASED);
  const testVersion = new Version(1, 2, 3, VersionStage.RELEASED);

  const supportedVersions = new Map<string, Version>();
  supportedVersions.set("app1", minVersion);
  zSpaceHostEntity.setSupportedAppVersions(supportedVersions);

  expect(zSpaceHostEntity.isAppSupported("app1", testVersion)).toBe(true);
});

it("returns true when major and minor versions are same and patch is higher", () => {
  const minVersion = new Version(1, 2, 3, VersionStage.RELEASED);
  const testVersion = new Version(1, 2, 4, VersionStage.RELEASED);

  const supportedVersions = new Map<string, Version>();
  supportedVersions.set("app1", minVersion);
  zSpaceHostEntity.setSupportedAppVersions(supportedVersions);

  expect(zSpaceHostEntity.isAppSupported("app1", testVersion)).toBe(true);
});

it("returns false when major and minor versions are same and patch is lower", () => {
  const minVersion = new Version(1, 2, 3, VersionStage.RELEASED);
  const testVersion = new Version(1, 2, 2, VersionStage.RELEASED);

  const supportedVersions = new Map<string, Version>();
  supportedVersions.set("app1", minVersion);
  zSpaceHostEntity.setSupportedAppVersions(supportedVersions);

  expect(zSpaceHostEntity.isAppSupported("app1", testVersion)).toBe(false);
});

it("can be retrieved as singleton through static get method", () => {
  const retrievedEntity = ZSpaceHostEntity.get(appObjects);
  expect(retrievedEntity).toBe(zSpaceHostEntity);
});
