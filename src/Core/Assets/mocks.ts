import * as BOUNDARY from "./Boundary";
import { AssetUCImp } from "./UseCase_Imp";
import * as ENTITIES from "./Entities";



function mockAssetLoader(assetURL:string):Promise<string> {
  return new Promise<string>((resolve, reject) =>{
    try {
      const fakeURL = `www.blobURL.com`;
      resolve(fakeURL);
    } catch(e) {
      reject(e);
    }
  })
}

export function makeUseCase(): BOUNDARY.AssetUC {
  return new AssetUCImp(mockAssetLoader);
}

export function mockEntityAssetApp(id: string): ENTITIES.AssetAppData {
  return {
    appID: id,
    url: `url_to_${id}_data`,
    data: { some: `Data for ${id}` },
  };
}

export function mockEntityAssetFile(
  version: number = 1,
  status: "DRAFT" | "PUBLISHED" = "PUBLISHED",
  apps: ENTITIES.AssetAppData[] = []
): ENTITIES.AssetFile {
  return {
    version,
    filename: `filename_for_${version}`,
    url: `url_for_${version}`,
    status,
    appData: apps,
  };
}

export function mockEntityAsset(
  id: string,
  type: ENTITIES.AssetType = "GLB",
  tags: string[] = [],
  files: ENTITIES.AssetFile[] = []
): ENTITIES.Asset {
  return {
    id,
    name: `Name for ${id}`,
    description: `Description for ${id}`,
    type,
    tags,
    files,
  };
}

export function mockBoundaryAssetApp(id: string): BOUNDARY.AssetAppData {
  return {
    appID: id,
    url: `url_to_${id}_data`,
    data: { some: `Data for ${id}` },
  };
}

export function mockBoundaryAssetFile(
  version: number,
  status: "DRAFT" | "PUBLISHED" = "PUBLISHED",
  apps: BOUNDARY.AssetAppData[] = [],
): BOUNDARY.AssetFile {
  return {
    version,
    filename: `filename_for_${version}`,
    url: `url_for_${version}`,
    status,
    appData: apps,
  };
}

export function mockBoundaryAsset(
  id: string,
  type: BOUNDARY.AssetType = "GLB",
  tags: string[] = [],
  files: BOUNDARY.AssetFile[] = []
): BOUNDARY.Asset {
  return {
    id,
    name: `Name for ${id}`,
    description: `Description for ${id}`,
    type,
    tags,
    files,
  };
}
