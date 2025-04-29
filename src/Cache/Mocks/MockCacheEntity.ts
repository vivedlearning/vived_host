import { AppObject, AppObjectRepo } from "@vived/core";
import { CacheEntity } from "../Entities/CacheEntity";

export class MockCacheEntity extends CacheEntity {
  get = jest.fn().mockResolvedValue({ value: "mockValue" });
  store = jest.fn().mockResolvedValue(undefined);
  has = jest.fn().mockResolvedValue(true);
  invalidate = jest.fn().mockResolvedValue(undefined);
  clear = jest.fn().mockResolvedValue(undefined);
  size = jest.fn().mockResolvedValue(0);

  constructor(appObject: AppObject) {
    super(appObject, CacheEntity.type);
    this.appObjects.registerSingleton(this);
  }
}

export function makeMockCacheEntity(appObjects: AppObjectRepo) {
  return new MockCacheEntity(appObjects.getOrCreate("MockCacheEntity"));
}
