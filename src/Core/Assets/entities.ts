export interface Asset {
  id: string,
  name: string,
  description: string,
  type: AssetType,
  tags: string[],
  imageBlob?: Blob,
  files: AssetFile[];
}

export interface AssetFile {
  version: number,
  filename: string,
  url: string,
  status: AssetFileStatus,
  blobUrl?: string
  appData: AssetAppData[]
}

export interface AssetAppData {
  appID: string,
  url: string,
  data?: object,
}

export type AssetType = "GLB" | "IMAGE";
export type AssetFileStatus = "DRAFT" | "PUBLISHED"