import { AppObjectRepo } from "@vived/core";
import { CacheEntity } from "../Entities/CacheEntity";

export function clearCache(appObjects: AppObjectRepo): Promise<void> {
  const cacheEntity = CacheEntity.get(appObjects);
  if (!cacheEntity) {
    appObjects.submitWarning("clearCache", "Unable to find CacheEntity");
    return Promise.reject();
  }

  return cacheEntity.clear();
}
