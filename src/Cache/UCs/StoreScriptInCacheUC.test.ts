import { AppObject, AppObjectRepo, makeAppObjectRepo } from "@vived/core";
import {
  StoreScriptInCacheUC,
  makeStoreScriptInCacheUC
} from "./StoreScriptInCacheUC";
import {
  ScriptCacheEntity,
  makeScriptCacheEntity
} from "../Entities/ScriptCacheEntity";
import { makeCacheEntity } from "../Entities/CacheEntity";

describe("StoreScriptInCacheUC", () => {
  let appObjects: AppObjectRepo;
  let appObject: AppObject;
  let cacheObject: AppObject;
  let scriptCacheObject: AppObject;
  let uc: StoreScriptInCacheUC;
  let scriptCache: ScriptCacheEntity;

  beforeEach(() => {
    appObjects = makeAppObjectRepo();

    // Create CacheEntity first
    cacheObject = appObjects.getOrCreate("Cache");
    makeCacheEntity(cacheObject);

    // Create ScriptCacheEntity next
    scriptCacheObject = appObjects.getOrCreate("ScriptCache");
    scriptCache = makeScriptCacheEntity(scriptCacheObject);

    // Finally create the UseCase
    appObject = appObjects.getOrCreate("StoreScriptInCacheUC");
    uc = makeStoreScriptInCacheUC(appObject);
  });

  it("gets registered as a singleton", () => {
    const retrievedUC = StoreScriptInCacheUC.get(appObjects);
    expect(retrievedUC).toBe(uc);
  });

  it("stores script content in cache", async () => {
    const url =
      "https://d2fmo5ijqwqpei.cloudfront.net/apps/app123/1.0.0/main.js";
    const scriptContent = "console.log('Script to be cached');";

    await uc.storeScript(url, scriptContent);

    // Verify script was stored properly by checking directly with the cache entity
    const result = await scriptCache.getScript("app123", "1.0.0", "main.js");
    expect(result).toBe(scriptContent);
  });

  it("overwrites existing script content", async () => {
    const url =
      "https://d2fmo5ijqwqpei.cloudfront.net/apps/app456/2.0.0/runtime.js";
    const originalContent = "console.log('Original content');";
    const newContent = "console.log('Updated content');";

    // Store original content
    await scriptCache.storeScript(
      "app456",
      "2.0.0",
      "runtime.js",
      originalContent
    );

    // Store new content through UC
    await uc.storeScript(url, newContent);

    // Verify content was updated
    const result = await scriptCache.getScript("app456", "2.0.0", "runtime.js");
    expect(result).toBe(newContent);
  });

  it("extracts script info correctly from URL", () => {
    const url =
      "https://d2fmo5ijqwqpei.cloudfront.net/apps/appABC/3.4.5/static/js/vendor.js?token=xyz";
    const { appId, version, scriptPath } = uc.extractScriptInfo(url);

    expect(appId).toBe("appABC");
    expect(version).toBe("3.4.5");
    expect(scriptPath).toBe("static/js/vendor.js");
  });
});
