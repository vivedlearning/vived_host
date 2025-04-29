import {
  getSingletonComponent,
  AppObject,
  AppObjectRepo,
  AppObjectUC
} from "@vived/core";
import { FetchAssetFileFromAPIUC } from "../../VivedAPI";
import { GetAssetFromCacheUC, StoreAssetInCacheUC } from "../../Cache";
import { AssetRepo } from "../Entities/AssetRepo";
import { GetAssetUC } from "./GetAssetUC";

export abstract class GetAssetFileUC extends AppObjectUC {
  static type = "GetAssetFileUC";

  abstract getAssetFile(assetID: string): Promise<File>;

  static get(appObjects: AppObjectRepo): GetAssetFileUC | undefined {
    return getSingletonComponent<GetAssetFileUC>(
      GetAssetFileUC.type,
      appObjects
    );
  }
}

export function makeGetAssetFileUC(appObject: AppObject): GetAssetFileUC {
  return new GetAssetFileUCImp(appObject);
}

class GetAssetFileUCImp extends GetAssetFileUC {
  private get assetRepo() {
    return this.getCachedSingleton<AssetRepo>(AssetRepo.type);
  }

  private get fetchAssetFile() {
    return this.getCachedSingleton<FetchAssetFileFromAPIUC>(
      FetchAssetFileFromAPIUC.type
    )?.doFetch;
  }

  private get getAsset() {
    return this.getCachedSingleton<GetAssetUC>(GetAssetUC.type)?.getAsset;
  }

  private get getAssetFromCache() {
    return this.getCachedSingleton<GetAssetFromCacheUC>(
      GetAssetFromCacheUC.type
    )?.getAsset;
  }

  private get storeAssetInCache() {
    return this.getCachedSingleton<StoreAssetInCacheUC>(
      StoreAssetInCacheUC.type
    )?.storeAsset;
  }

  getAssetFile = async (assetID: string): Promise<File> => {
    const assetRepo = this.assetRepo;
    const getAsset = this.getAsset;
    const fetchAssetFile = this.fetchAssetFile;

    // Check for required dependencies
    if (!assetRepo || !getAsset || !fetchAssetFile) {
      return Promise.reject(new Error("Missing required dependencies"));
    }

    // Check if asset already exists in memory with a file
    const existingAsset = assetRepo.get(assetID);
    if (existingAsset?.file) {
      return existingAsset.file;
    }

    // Try to get from cache first, then fall back to normal fetching if needed
    try {
      return await this.tryGetFromCacheOrFetch(assetID);
    } catch (error) {
      // If cache access failed, try the normal flow
      this.warn(`Cache error: ${(error as Error).message}`);
      return this.fetchAssetDirectly(assetID);
    }
  };

  private async tryGetFromCacheOrFetch(assetID: string): Promise<File> {
    const getAssetFromCache = this.getAssetFromCache;

    // If no cache is available, go straight to normal fetching
    if (!getAssetFromCache) {
      return this.fetchAssetDirectly(assetID);
    }

    // Try to get the asset from cache
    const cachedBlob = await getAssetFromCache(assetID);

    if (cachedBlob) {
      // Asset found in cache, get metadata and create file
      return this.createFileFromCachedBlob(assetID, cachedBlob);
    } else {
      // Not in cache, fetch directly
      return this.fetchAssetDirectly(assetID);
    }
  }

  private async createFileFromCachedBlob(
    assetID: string,
    cachedBlob: Blob
  ): Promise<File> {
    const getAsset = this.getAsset;

    if (!getAsset) {
      throw new Error("Required dependencies not found");
    }

    // Get asset metadata
    const asset = await getAsset(assetID);

    // Convert blob to file
    const filename = asset.filename || "cached-asset";
    const file = new File([cachedBlob], filename, {
      type: cachedBlob.type
    });

    // Update asset state
    asset.setFile(file);
    asset.isFetchingFile = false;

    return file;
  }

  private async fetchAssetDirectly(assetID: string): Promise<File> {
    const getAsset = this.getAsset;
    const fetchAssetFile = this.fetchAssetFile;

    if (!getAsset || !fetchAssetFile) {
      throw new Error("Required dependencies not found");
    }

    try {
      // Get asset and prepare for fetching
      const asset = await getAsset(assetID);
      asset.isFetchingFile = true;
      asset.fetchError = undefined;

      // Fetch the file
      const file = await fetchAssetFile(asset);

      // Update asset state
      asset.setFile(file);
      asset.isFetchingFile = false;

      // Try to store in cache
      await this.tryCacheAssetFile(assetID, file);

      return file;
    } catch (error) {
      await this.handleFetchError(assetID, error as Error);
      throw error;
    }
  }

  private async handleFetchError(assetID: string, error: Error): Promise<void> {
    const getAsset = this.getAsset;

    if (!getAsset) {
      return;
    }

    try {
      const asset = await getAsset(assetID);
      asset.fetchError = error;
      asset.isFetchingFile = false;
    } catch {
      // If we can't get the asset, we can't update its error state
    }
  }

  private async tryCacheAssetFile(assetID: string, file: File): Promise<void> {
    const storeAssetInCache = this.storeAssetInCache;

    if (!storeAssetInCache) {
      return;
    }

    try {
      await storeAssetInCache(
        assetID,
        new Blob([file], { type: file.type }),
        file.type
      );
    } catch (e) {
      this.warn(`Failed to cache asset: ${(e as Error).message}`);
    }
  }

  constructor(appObject: AppObject) {
    super(appObject, GetAssetFileUC.type);
    this.appObjects.registerSingleton(this);
  }
}
