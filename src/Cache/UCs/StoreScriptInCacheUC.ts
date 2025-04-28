import {
  AppObject,
  AppObjectRepo,
  AppObjectUC,
  getSingletonComponent
} from "@vived/core";
import { ScriptCacheEntity } from "../Entities/ScriptCacheEntity";

export abstract class StoreScriptInCacheUC extends AppObjectUC {
  static readonly type = "StoreScriptInCacheUC";

  abstract storeScript(url: string, content: string): Promise<void>;
  abstract extractScriptInfo(url: string): {
    appId: string;
    version: string;
    scriptPath: string;
  };

  static get(appObjects: AppObjectRepo): StoreScriptInCacheUC | undefined {
    return getSingletonComponent(StoreScriptInCacheUC.type, appObjects);
  }
}

export function makeStoreScriptInCacheUC(
  appObject: AppObject
): StoreScriptInCacheUC {
  return new StoreScriptInCacheUCImp(appObject);
}

class StoreScriptInCacheUCImp extends StoreScriptInCacheUC {
  private get scriptCacheEntity(): ScriptCacheEntity | undefined {
    return this.getCachedSingleton<ScriptCacheEntity>(ScriptCacheEntity.type);
  }

  async storeScript(url: string, content: string): Promise<void> {
    const scriptCache = this.scriptCacheEntity;
    if (!scriptCache) {
      this.warn("ScriptCacheEntity not found");
      return;
    }

    try {
      const { appId, version, scriptPath } = this.extractScriptInfo(url);
      await scriptCache.storeScript(appId, version, scriptPath, content);
    } catch (e) {
      this.warn(`Error storing script in cache for URL: ${url}`);
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
    super(appObject, StoreScriptInCacheUC.type);
    this.appObjects.registerSingleton(this);
  }
}
