import { AppObjectRepo } from "@vived/core";
import { makeAssetCacheEntity } from "../Entities/AssetCacheEntity";
import { makeScriptCacheEntity } from "../Entities/ScriptCacheEntity";
import { makeGetAssetFromCacheUC } from "../UCs/GetAssetFromCacheUC";
import { makeGetScriptFromCacheUC } from "../UCs/GetScriptFromCacheUC";
import { makeStoreAssetInCacheUC } from "../UCs/StoreAssetInCacheUC";
import { makeStoreScriptInCacheUC } from "../UCs/StoreScriptInCacheUC";

/**
 * Sets up the Cache feature components
 */
export function setupCache(appObjects: AppObjectRepo): void {
  // Create Cache Entity app object
  const cacheEntityAO = appObjects.getOrCreate("Cache");

  // Create entities
  makeScriptCacheEntity(cacheEntityAO);
  makeAssetCacheEntity(cacheEntityAO);

  // Create use cases
  makeGetScriptFromCacheUC(cacheEntityAO);
  makeStoreScriptInCacheUC(cacheEntityAO);
  makeGetAssetFromCacheUC(cacheEntityAO);
  makeStoreAssetInCacheUC(cacheEntityAO);
}
