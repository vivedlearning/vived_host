import { AppObject, AppObjectRepo } from "@vived/core";
import { GetScriptFromCacheUC } from "../UCs/GetScriptFromCacheUC";

export class MockGetScriptFromCacheUC extends GetScriptFromCacheUC {
  getScript = jest.fn().mockResolvedValue("const mockScript = 'test';");
  extractScriptInfo = jest.fn().mockReturnValue({
    appId: "mockAppId",
    version: "mockVersion",
    scriptPath: "mockScriptPath"
  });

  constructor(appObject: AppObject) {
    super(appObject, GetScriptFromCacheUC.type);
    this.appObjects.registerSingleton(this);
  }
}

export function makeMockGetScriptFromCacheUC(appObjects: AppObjectRepo) {
  return new MockGetScriptFromCacheUC(
    appObjects.getOrCreate("MockGetScriptFromCacheUC")
  );
}
