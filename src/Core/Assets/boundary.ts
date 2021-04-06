export interface AssetUC {
  getAllAssets(): Asset[];
  getAsset(assetID: string): Asset | undefined;
  addAsset(assetData: Asset): void;
  addManyAssets(assetDatas: Asset[]): void;
  getAssetsByType(type: AssetType, withTags?:string[]): Asset[];
  getLatestVersionNumber(assetID: string, includeDrafts?:boolean): number | undefined;
  isFileLoaded(assetID: string, version?:number): boolean;
  loadFile(assetID: string, version?:number): Promise<void>;
  getFileBlobURL(assetID: string, version?:number): string;
  releaseAllBlobs(): void;
}

export interface Asset {
  id: string;
  name: string;
  description: string;
  type: AssetType;
  tags: string[];
  imageBlob?: Blob;
  files: AssetFile[];
}

export interface AssetFile {
  version: number;
  filename: string;
  url: string;
  status: Status;
  blobUrl?: string;
  appData: AssetAppData[];
}

export interface AssetAppData {
  appID: string;
  url: string;
  data?: object;
}

export type Status = "DRAFT" | "PUBLISHED";
export type AssetType = "GLB" | "IMAGE";
