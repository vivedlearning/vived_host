import { AppObject, AppObjectRepo } from "@vived/core";
import { StoreScriptInCacheUC } from "../UCs/StoreScriptInCacheUC";

export class MockStoreScriptInCacheUC extends StoreScriptInCacheUC {
  storeScript = jest.fn().mockResolvedValue(undefined);
  extractScriptInfo = jest.fn().mockReturnValue({
    appId: "mockAppId",
    version: "mockVersion",
    scriptPath: "mockScriptPath"
  });

  constructor(appObject: AppObject) {
    super(appObject, StoreScriptInCacheUC.type);
    this.appObjects.registerSingleton(this);
  }
}

export function makeMockStoreScriptInCacheUC(appObjects: AppObjectRepo) {
  return new MockStoreScriptInCacheUC(
    appObjects.getOrCreate("MockStoreScriptInCacheUC")
  );
}
