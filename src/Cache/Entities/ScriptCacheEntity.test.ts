import { AppObject, AppObjectRepo, makeAppObjectRepo } from "@vived/core";
import { ScriptCacheEntity, makeScriptCacheEntity } from "./ScriptCacheEntity";
import { makeCacheEntity } from "./CacheEntity";

describe("ScriptCacheEntity", () => {
  let appObjects: AppObjectRepo;
  let appObject: AppObject;
  let cacheObject: AppObject;
  let scriptCache: ScriptCacheEntity;

  beforeEach(() => {
    appObjects = makeAppObjectRepo();
    // Create CacheEntity first since ScriptCacheEntity depends on it
    cacheObject = appObjects.getOrCreate("Cache");
    makeCacheEntity(cacheObject);

    // Now create ScriptCacheEntity
    appObject = appObjects.getOrCreate("testScriptCache");
    scriptCache = makeScriptCacheEntity(appObject);
  });

  it("initializes properly", () => {
    expect(scriptCache).toBeDefined();
  });

  it("stores and retrieves script content", async () => {
    const appId = "app123";
    const version = "1.2.3";
    const scriptPath = "static/js/runtime.js";
    const content = "console.log('Hello world!');";

    await scriptCache.storeScript(appId, version, scriptPath, content);

    const result = await scriptCache.getScript(appId, version, scriptPath);
    expect(result).toBe(content);
  });

  it("returns undefined for non-existent script", async () => {
    const result = await scriptCache.getScript(
      "non-existent",
      "1.0.0",
      "non-existent.js"
    );
    expect(result).toBeUndefined();
  });

  it("checks if script exists", async () => {
    const appId = "app456";
    const version = "2.0.0";
    const scriptPath = "static/js/main.js";

    expect(await scriptCache.hasScript(appId, version, scriptPath)).toBe(false);

    await scriptCache.storeScript(
      appId,
      version,
      scriptPath,
      "// Some JS code"
    );

    expect(await scriptCache.hasScript(appId, version, scriptPath)).toBe(true);
  });

  it("invalidates a specific script", async () => {
    const appId = "app789";
    const version = "3.0.0";
    const scriptPath = "script1.js";
    const otherScriptPath = "script2.js";

    await scriptCache.storeScript(appId, version, scriptPath, "// Code 1");
    await scriptCache.storeScript(appId, version, otherScriptPath, "// Code 2");

    // Invalidate specific script
    await scriptCache.invalidateScript(appId, version, scriptPath);

    // Check specific script is invalidated
    expect(await scriptCache.hasScript(appId, version, scriptPath)).toBe(false);
    // Other script should still be present
    expect(await scriptCache.hasScript(appId, version, otherScriptPath)).toBe(
      true
    );
  });

  it("logs warning when attempting partial invalidation", async () => {
    // Create a spy on the warning method
    const warnSpy = jest.spyOn(scriptCache, "warn");

    // Test partial invalidation (currently not fully implemented)
    await scriptCache.invalidateScript("someApp");

    // Verify warning was logged
    expect(warnSpy).toHaveBeenCalledWith(
      "Partial invalidation not fully implemented"
    );

    // Clean up spy
    warnSpy.mockRestore();
  });

  it("extracts script info from URL", () => {
    const url =
      "https://d2fmo5ijqwqpei.cloudfront.net/apps/appe860b51f49414e20ae7995dff4d9b152/1.3.4/static/js/runtime-main.6f4c7044.js?Expires=1745621478&Policy=...";

    const info = scriptCache.extractScriptInfo(url);

    expect(info.appId).toBe("appe860b51f49414e20ae7995dff4d9b152");
    expect(info.version).toBe("1.3.4");
    expect(info.scriptPath).toBe("static/js/runtime-main.6f4c7044.js");
  });
});
