import * as BOUNDARY from "./Boundary";
import * as ENTITIES from "./Entities";

export function convertAsset_EntityToBoundary(
  asset: ENTITIES.Asset
): BOUNDARY.Asset {
  const { id, name, description, type, tags, imageBlob, files } = asset;

  return {
    id,
    name,
    description,
    type,
    tags: [...tags],
    imageBlob,
    files: files?.map((file) => convertAssetFile_EntityToBoundary(file)),
  };
}

export function convertAsset_BoundaryToEntity(
  assetData: BOUNDARY.Asset
): ENTITIES.Asset {
  const { id, name, description, type, tags, imageBlob, files } = assetData;

  return {
    id,
    name,
    description,
    type,
    tags: [...tags],
    imageBlob,
    files: files?.map((file) => convertAssetFile_BoundarytoEntity(file)),
  };
}

export function convertAssetAppData_EntityToBoundary(
  entityAppData: ENTITIES.AssetAppData
): BOUNDARY.AssetAppData {
  const { appID, url, data } = entityAppData;
  return {
    appID,
    url,
    data: data ?? undefined,
  };
}

export function convertAssetAppData_BoundarytoEntity(
  boundaryAppData: BOUNDARY.AssetAppData
): ENTITIES.AssetAppData {
  const { appID, url, data } = boundaryAppData;
  return {
    appID,
    url,
    data: data ?? undefined,
  };
}

export function convertAssetFile_BoundarytoEntity(
  boundaryAssetFile: BOUNDARY.AssetFile
): ENTITIES.AssetFile {
  const {
    version,
    filename,
    url,
    status,
    blobUrl,
    appData,
  } = boundaryAssetFile;

  return {
    version,
    filename,
    url,
    status,
    blobUrl,
    appData: appData?.map((data) => convertAssetAppData_BoundarytoEntity(data)),
  };
}

export function convertAssetFile_EntityToBoundary(
  entityAssetFile: ENTITIES.AssetFile
): BOUNDARY.AssetFile {
  const { version, filename, url, status, blobUrl, appData } = entityAssetFile;

  return {
    version,
    filename,
    url,
    status,
    blobUrl,
    appData: appData?.map((data) => convertAssetAppData_EntityToBoundary(data)),
  };
}
