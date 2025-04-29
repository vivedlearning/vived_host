import {
  AppObject,
  AppObjectRepo,
  AppObjectUC,
  getSingletonComponent
} from "@vived/core";
import { ScriptCacheEntity } from "../Entities/ScriptCacheEntity";

export abstract class GetScriptFromCacheUC extends AppObjectUC {
  static readonly type = "GetScriptFromCacheUC";

  abstract getScript(url: string): Promise<string | undefined>;
  abstract extractScriptInfo(url: string): {
    appId: string;
    version: string;
    scriptPath: string;
  };

  static get(appObjects: AppObjectRepo): GetScriptFromCacheUC | undefined {
    return getSingletonComponent(GetScriptFromCacheUC.type, appObjects);
  }
}

export function makeGetScriptFromCacheUC(
  appObject: AppObject
): GetScriptFromCacheUC {
  return new GetScriptFromCacheUCImp(appObject);
}

class GetScriptFromCacheUCImp extends GetScriptFromCacheUC {
  private get scriptCacheEntity(): ScriptCacheEntity | undefined {
    return this.getCachedSingleton<ScriptCacheEntity>(ScriptCacheEntity.type);
  }

   getScript =  async(url: string): Promise<string | undefined> => {
    const scriptCache = this.scriptCacheEntity;
    if (!scriptCache) {
      this.warn("ScriptCacheEntity not found");
      return undefined;
    }

    try {
      const { appId, version, scriptPath } = this.extractScriptInfo(url);
      return await scriptCache.getScript(appId, version, scriptPath);
    } catch (e) {
      this.warn(`Error retrieving script from cache for URL: ${url}`);
      return undefined;
    }
  }

  extractScriptInfo(url: string): {
    appId: string;
    version: string;
    scriptPath: string;
  } {
    const scriptCache = this.scriptCacheEntity;
    if (!scriptCache) {
      this.warn("ScriptCacheEntity not found");
      return { appId: "unknown", version: "unknown", scriptPath: "unknown" };
    }

    return scriptCache.extractScriptInfo(url);
  }

  constructor(appObject: AppObject) {
    super(appObject, GetScriptFromCacheUC.type);
    this.appObjects.registerSingleton(this);
  }
}
