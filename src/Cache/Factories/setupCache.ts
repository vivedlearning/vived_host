import { AppObjectRepo } from "@vived/core";
import { makeScriptCacheEntity } from "../Entities/ScriptCacheEntity";
import { makeCacheEntity } from "../Entities/CacheEntity";
import { makeGetScriptFromCacheUC } from "../UCs/GetScriptFromCacheUC";
import { makeStoreScriptInCacheUC } from "../UCs/StoreScriptInCacheUC";

/**
 * Sets up the Cache feature components
 */
export function setupCache(appObjects: AppObjectRepo): void {
  // Create Cache Entity app object
  const cacheEntityAO = appObjects.getOrCreate("Cache");

  // Create entities
  makeCacheEntity(cacheEntityAO);
  makeScriptCacheEntity(cacheEntityAO);

  // Create use cases
  makeGetScriptFromCacheUC(cacheEntityAO);
  makeStoreScriptInCacheUC(cacheEntityAO);
}
