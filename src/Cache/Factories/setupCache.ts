import { AppObjectRepo } from "@vived/core";
import { makeScriptCacheEntity } from "../Entities/ScriptCacheEntity";
import { makeCacheEntity } from "../Entities/CacheEntity";
import { makeAssetCacheEntity } from "../Entities/AssetCacheEntity";
import { makeGetScriptFromCacheUC } from "../UCs/GetScriptFromCacheUC";
import { makeStoreScriptInCacheUC } from "../UCs/StoreScriptInCacheUC";
import { makeGetAssetFromCacheUC } from "../UCs/GetAssetFromCacheUC";
import { makeStoreAssetInCacheUC } from "../UCs/StoreAssetInCacheUC";

/**
 * Sets up the Cache feature components
 */
export function setupCache(appObjects: AppObjectRepo): void {
  // Create Cache Entity app object
  const cacheEntityAO = appObjects.getOrCreate("Cache");

  // Create entities
  makeCacheEntity(cacheEntityAO);
  makeScriptCacheEntity(cacheEntityAO);
  makeAssetCacheEntity(cacheEntityAO);

  // Create use cases
  makeGetScriptFromCacheUC(cacheEntityAO);
  makeStoreScriptInCacheUC(cacheEntityAO);
  makeGetAssetFromCacheUC(cacheEntityAO);
  makeStoreAssetInCacheUC(cacheEntityAO);
}
