import { AppObject, AppObjectRepo, makeAppObjectRepo } from "@vived/core";
import {
  GetScriptFromCacheUC,
  makeGetScriptFromCacheUC
} from "./GetScriptFromCacheUC";
import {
  ScriptCacheEntity,
  makeScriptCacheEntity
} from "../Entities/ScriptCacheEntity";
import { makeCacheEntity } from "../Entities/CacheEntity";

describe("GetScriptFromCacheUC", () => {
  let appObjects: AppObjectRepo;
  let appObject: AppObject;
  let cacheObject: AppObject;
  let scriptCacheObject: AppObject;
  let uc: GetScriptFromCacheUC;
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
    appObject = appObjects.getOrCreate("GetScriptFromCacheUC");
    uc = makeGetScriptFromCacheUC(appObject);
  });

  it("gets registered as a singleton", () => {
    const retrievedUC = GetScriptFromCacheUC.get(appObjects);
    expect(retrievedUC).toBe(uc);
  });

  it("returns undefined when script is not in cache", async () => {
    const url = "https://example.com/apps/app123/1.0.0/script.js";
    const result = await uc.getScript(url);
    expect(result).toBeUndefined();
  });

  it("returns script content when it exists in cache", async () => {
    const url =
      "https://d2fmo5ijqwqpei.cloudfront.net/apps/app123/1.0.0/main.js";
    const scriptContent = "console.log('Cached script');";

    // Store directly in the cache entity
    await scriptCache.storeScript("app123", "1.0.0", "main.js", scriptContent);

    // Should retrieve via the use case
    const result = await uc.getScript(url);
    expect(result).toBe(scriptContent);
  });

  it("extracts script info from URL correctly", () => {
    // Standard URL
    const url1 =
      "https://d2fmo5ijqwqpei.cloudfront.net/apps/app123/1.2.3/static/js/main.js";
    const info1 = uc.extractScriptInfo(url1);
    expect(info1.appId).toBe("app123");
    expect(info1.version).toBe("1.2.3");
    expect(info1.scriptPath).toBe("static/js/main.js");

    // URL with query parameters
    const url2 =
      "https://d2fmo5ijqwqpei.cloudfront.net/apps/app456/2.3.4/runtime.js?token=abc";
    const info2 = uc.extractScriptInfo(url2);
    expect(info2.appId).toBe("app456");
    expect(info2.version).toBe("2.3.4");
    expect(info2.scriptPath).toBe("runtime.js");

    // Complex URL with multiple path segments and query params
    const url3 =
      "https://d2fmo5ijqwqpei.cloudfront.net/apps/app789/3.4.5/static/js/chunk/vendor.js?Expires=1234&Policy=abcd";
    const info3 = uc.extractScriptInfo(url3);
    expect(info3.appId).toBe("app789");
    expect(info3.version).toBe("3.4.5");
    expect(info3.scriptPath).toBe("static/js/chunk/vendor.js");
  });
});
