import {
  AppObject,
  AppObjectEntity,
  AppObjectRepo,
  getSingletonComponent
} from "@vived/core";
import { CacheEntity } from "./CacheEntity";

/**
 * Entity responsible for managing script caching operations.
 * Provides functionality to store, retrieve, check existence, and invalidate scripts
 * in the cache based on app ID, version, and script path.
 */
export abstract class ScriptCacheEntity extends AppObjectEntity {
  static readonly type = "ScriptCacheEntity";

  /**
   * Retrieves a script from the cache.
   * @param appId - Unique identifier of the app
   * @param version - Version of the app
   * @param scriptPath - Path of the script within the app
   * @returns Promise with the script content if found, undefined otherwise
   */
  abstract getScript(
    appId: string,
    version: string,
    scriptPath: string
  ): Promise<string | undefined>;

  /**
   * Stores a script in the cache.
   * @param appId - Unique identifier of the app
   * @param version - Version of the app
   * @param scriptPath - Path of the script within the app
   * @param content - Content of the script to store
   */
  abstract storeScript(
    appId: string,
    version: string,
    scriptPath: string,
    content: string
  ): Promise<void>;

  /**
   * Checks if a script exists in the cache.
   * @param appId - Unique identifier of the app
   * @param version - Version of the app
   * @param scriptPath - Path of the script within the app
   * @returns Promise resolving to true if script exists, false otherwise
   */
  abstract hasScript(
    appId: string,
    version: string,
    scriptPath: string
  ): Promise<boolean>;

  /**
   * Invalidates scripts in the cache.
   * Can invalidate a specific script, all scripts for a version, or all scripts for an app.
   * @param appId - Unique identifier of the app
   * @param version - Optional version of the app
   * @param scriptPath - Optional path of the script within the app
   */
  abstract invalidateScript(
    appId: string,
    version?: string,
    scriptPath?: string
  ): Promise<void>;

  /**
   * Extracts app ID, version, and script path from a script URL.
   * @param url - The URL to parse
   * @returns Object containing extracted appId, version, and scriptPath
   */
  abstract extractScriptInfo(url: string): {
    appId: string;
    version: string;
    scriptPath: string;
  };

  /**
   * Gets the singleton ScriptCacheEntity instance from the AppObjectRepo.
   * @param appObjects - Repository of application objects
   * @returns ScriptCacheEntity instance if registered, undefined otherwise
   */
  static get(appObjects: AppObjectRepo): ScriptCacheEntity | undefined {
    return getSingletonComponent<ScriptCacheEntity>(
      ScriptCacheEntity.type,
      appObjects
    );
  }
}

/**
 * Factory function to create a new ScriptCacheEntity instance.
 * @param appObject - The parent AppObject
 * @returns A new ScriptCacheEntity instance
 */
export function makeScriptCacheEntity(appObject: AppObject): ScriptCacheEntity {
  return new ScriptCacheEntityImp(appObject);
}

type CacheMetadata = {
  appId: string;
  version: string;
  scriptPath: string;
  timestamp: number;
};

class ScriptCacheEntityImp extends ScriptCacheEntity {
  private get cacheEntity(): CacheEntity | undefined {
    return this.getCachedSingleton<CacheEntity>(CacheEntity.type);
  }

  constructor(appObject: AppObject) {
    super(appObject, ScriptCacheEntity.type);
    this.appObjects.registerSingleton(this);
  }

  async getScript(
    appId: string,
    version: string,
    scriptPath: string
  ): Promise<string | undefined> {
    const cacheKey = this.generateCacheKey(appId, version, scriptPath);

    const cacheEntity = this.cacheEntity;
    if (!cacheEntity) {
      this.warn("CacheEntity not found");
      return undefined;
    }

    try {
      const { value } = await cacheEntity.get(cacheKey);
      return value as string;
    } catch (e) {
      return undefined;
    }
  }

  async storeScript(
    appId: string,
    version: string,
    scriptPath: string,
    content: string
  ): Promise<void> {
    const cacheKey = this.generateCacheKey(appId, version, scriptPath);

    const cacheEntity = this.cacheEntity;
    if (!cacheEntity) {
      this.warn("CacheEntity not found");
      return;
    }

    const metadata: CacheMetadata = {
      appId,
      version,
      scriptPath,
      timestamp: Date.now()
    };

    await cacheEntity.store(cacheKey, content, metadata);
  }

  async hasScript(
    appId: string,
    version: string,
    scriptPath: string
  ): Promise<boolean> {
    const cacheKey = this.generateCacheKey(appId, version, scriptPath);

    const cacheEntity = this.cacheEntity;
    if (!cacheEntity) {
      this.warn("CacheEntity not found");
      return false;
    }

    return await cacheEntity.has(cacheKey);
  }

  async invalidateScript(
    appId: string,
    version?: string,
    scriptPath?: string
  ): Promise<void> {
    const cacheEntity = this.cacheEntity;
    if (!cacheEntity) {
      this.warn("CacheEntity not found");
      return;
    }

    // If all parameters are provided, invalidate a specific script
    if (appId && version && scriptPath) {
      const cacheKey = this.generateCacheKey(appId, version, scriptPath);
      await cacheEntity.invalidate(cacheKey);
      return;
    }

    // For now, in our implementation we're just using a simple approach
    // where we only invalidate the specific script or app+version combination
    // A more sophisticated approach would be to iterate through all cache entries
    // and check metadata, but that would require extra cache entity functionality

    // For this simplified implementation, we only support full invalidation
    // and specific script invalidation (all 3 parameters)
    if (!version && !scriptPath) {
      this.warn("Partial invalidation not fully implemented");
      return;
    }
  }

  extractScriptInfo(url: string): {
    appId: string;
    version: string;
    scriptPath: string;
  } {
    try {
      // Parse URL to extract components
      const urlObj = new URL(url);
      const pathSegments = urlObj.pathname.split("/");

      // Find 'apps' segment index
      const appsIndex = pathSegments.findIndex((segment) => segment === "apps");

      if (appsIndex === -1 || appsIndex + 2 >= pathSegments.length) {
        throw new Error(`Invalid app URL format: ${url}`);
      }

      // Extract app ID, version, and path
      const appId = pathSegments[appsIndex + 1];
      const version = pathSegments[appsIndex + 2];

      // Extract script path (everything after the version segment)
      const scriptPathSegments = pathSegments.slice(appsIndex + 3);
      const scriptPath = scriptPathSegments.join("/");

      return {
        appId,
        version,
        scriptPath
      };
    } catch (e) {
      this.error(`Failed to extract script info from URL: ${url}`);
      return {
        appId: "unknown",
        version: "unknown",
        scriptPath: "unknown"
      };
    }
  }

  private generateCacheKey(
    appId: string,
    version: string,
    scriptPath: string
  ): string {
    return `script:${appId}:${version}:${scriptPath}`;
  }
}
