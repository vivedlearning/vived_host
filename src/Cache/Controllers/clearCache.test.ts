import { makeAppObjectRepo } from "@vived/core";
import { CacheEntity } from "../Entities/CacheEntity";
import { makeMockCacheEntity } from "../Mocks/MockCacheEntity";
import { clearCache } from "./clearCache";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();

  const mockCache = makeMockCacheEntity(appObjects);

  return {
    appObjects,
    mockCache
  };
}

describe("Cache Controller", () => {
  it("Calls the clear method on CacheEntity as expected", async () => {
    const { appObjects, mockCache } = makeTestRig();

    await clearCache(appObjects);

    expect(mockCache.clear).toHaveBeenCalled();
  });

  it("Submits a warning and rejects when CacheEntity is not found", async () => {
    const appObjects = makeAppObjectRepo();

    // Spy on submitWarning
    const submitWarningSpy = jest.fn();
		appObjects.submitWarning = submitWarningSpy;

    // Ensure the original get method is preserved
    const originalGet = CacheEntity.get;
    CacheEntity.get = jest.fn().mockReturnValue(null);

    await expect(clearCache(appObjects)).rejects.toEqual(undefined);

    expect(submitWarningSpy).toHaveBeenCalledWith(
      "clearCache",
      "Unable to find CacheEntity"
    );

    // Restore original method
    CacheEntity.get = originalGet;
  });

  it("Propagates rejection when clear operation fails", async () => {
    const { appObjects, mockCache } = makeTestRig();

    mockCache.clear.mockRejectedValue(new Error("Clear failed"));

    await expect(clearCache(appObjects)).rejects.toEqual(
      new Error("Clear failed")
    );
  });
});
