import {
  mockEntityAssetApp,
  mockBoundaryAssetApp,
  mockEntityAsset,
  mockEntityAssetFile,
  mockBoundaryAssetFile,
  mockBoundaryAsset,
} from "./mocks";
import {
  convertAssetAppData_BoundarytoEntity,
  convertAssetAppData_EntityToBoundary,
  convertAssetFile_BoundarytoEntity,
  convertAssetFile_EntityToBoundary,
  convertAsset_BoundaryToEntity,
  convertAsset_EntityToBoundary,
} from "./utilities";

test("Converting from an Entry to Data: check base data", () => {
  const entity = mockEntityAsset(
    "appID",
    "GLB",
    ["tag1", "tag2"],
    [mockEntityAssetFile(1)]
  );
  const convertedToData = convertAsset_EntityToBoundary(entity);

  expect(convertedToData.id).toEqual(entity.id);
  expect(convertedToData.name).toEqual(entity.name);
  expect(convertedToData.description).toEqual(entity.description);
  expect(convertedToData.type).toEqual(entity.type);

  expect(convertedToData.tags.length).toEqual(entity.tags.length);
  convertedToData.tags.forEach((tag, i) => {
    expect(tag).toEqual(entity.tags[i]);
  });

  expect(convertedToData.imageBlob).toEqual(entity.imageBlob);
  expect(convertedToData.files.length).toEqual(entity.files.length);
});

test("Converting from Entry to Data: check files", () => {
  const file1 = mockEntityAssetFile(1, "PUBLISHED", [
    mockEntityAssetApp("app1"),
    mockEntityAssetApp("app2"),
  ]);
  const file2 = mockEntityAssetFile(2, "DRAFT", [
    mockEntityAssetApp("app1"),
  ]);
  const entity = mockEntityAsset(
    "appID",
    "GLB",
    ["tag1", "tag2"],
    [file1, file2]
  );
  const convertedToData = convertAsset_EntityToBoundary(entity);

  convertedToData.files.forEach((file, i) => {
    const entryFile = entity.files[i];
    expect(file.version).toEqual(entryFile.version);
    expect(file.filename).toEqual(entryFile.filename);
    expect(file.url).toEqual(entryFile.url);
    expect(file.blobUrl).toEqual(entryFile.blobUrl);
    expect(file.appData.length).toEqual(entryFile.appData.length);
  });
});

test("Converting from Entry to Data: check app data", () => {
  const file1 = mockEntityAssetFile(1, "PUBLISHED", [
    mockEntityAssetApp("app1"),
    mockEntityAssetApp("app2"),
  ]);
  const file2 = mockEntityAssetFile(2, "DRAFT", [
    mockEntityAssetApp("app1"),
  ]);
  const entity = mockEntityAsset(
    "appID",
    "GLB",
    ["tag1", "tag2"],
    [file1, file2]
  );
  const convertedToData = convertAsset_EntityToBoundary(entity);

  convertedToData.files.forEach((file, i) => {
    file.appData.forEach((convertedAppData, j) => {
      const entryAppData = entity.files[i].appData[j];
      expect(convertedAppData.appID).toEqual(entryAppData.appID);
      expect(convertedAppData.data).toEqual(entryAppData.data);
      expect(convertedAppData.url).toEqual(entryAppData.url);
    });
  });
});

test("Data to Entry conversion: check base data", () => {
  const assetData = mockBoundaryAsset(
    "appID",
    "GLB",
    ["tag1", "tag2"],
    [mockEntityAssetFile(1)]
  );
  const convertedToEntry = convertAsset_BoundaryToEntity(assetData);

  expect(convertedToEntry.id).toEqual(assetData.id);
  expect(convertedToEntry.name).toEqual(assetData.name);
  expect(convertedToEntry.description).toEqual(assetData.description);
  expect(convertedToEntry.type).toEqual(assetData.type);

  expect(convertedToEntry.tags.length).toEqual(assetData.tags.length);
  convertedToEntry.tags.forEach((tag, i) => {
    expect(tag).toEqual(assetData.tags[i]);
  });

  expect(convertedToEntry.imageBlob).toEqual(assetData.imageBlob);
  expect(convertedToEntry.files.length).toEqual(assetData.files.length);
});

test("Data to Entry conversion: check files", () => {
  const file1 = mockBoundaryAssetFile(1, "PUBLISHED", [
    mockBoundaryAssetApp("app1"),
    mockBoundaryAssetApp("app2"),
  ]);
  const file2 = mockBoundaryAssetFile(2, "DRAFT", [
    mockBoundaryAssetApp("app1"),
  ]);
  const assetData = mockBoundaryAsset(
    "appID",
    "GLB",
    ["tag1", "tag2"],
    [file1, file2]
  );

  const convertedToEntry = convertAsset_BoundaryToEntity(assetData);
  convertedToEntry.files.forEach((file, i) => {
    const assetDataFile = assetData.files[i];
    expect(file.version).toEqual(assetDataFile.version);
    expect(file.filename).toEqual(assetDataFile.filename);
    expect(file.url).toEqual(assetDataFile.url);
    expect(file.blobUrl).toEqual(assetDataFile.blobUrl);
    expect(file.appData.length).toEqual(assetDataFile.appData.length);
  });
});

test("Data to Entry conversion: check app data", () => {
  const file1 = mockBoundaryAssetFile(1, "PUBLISHED", [
    mockBoundaryAssetApp("app1"),
    mockBoundaryAssetApp("app2"),
  ]);
  const file2 = mockBoundaryAssetFile(2, "DRAFT", [
    mockBoundaryAssetApp("app1"),
  ]);
  const assetData = mockBoundaryAsset(
    "appID",
    "GLB",
    ["tag1", "tag2"],
    [file1, file2]
  );

  const convertedToEntry = convertAsset_BoundaryToEntity(assetData);
  convertedToEntry.files.forEach((file, i) => {
    file.appData.forEach((convertedAppData, j) => {
      const assetDataAppData = assetData.files[i].appData[j];
      expect(convertedAppData.appID).toEqual(assetDataAppData.appID);
      expect(convertedAppData.data).toEqual(assetDataAppData.data);
      expect(convertedAppData.url).toEqual(assetDataAppData.url);
    });
  });
});

test("Converting App Data from Boundary to Entity", () => {
  const boundaryAppData = mockBoundaryAssetApp("app id");
  const entity = convertAssetAppData_BoundarytoEntity(boundaryAppData);

  expect(entity.appID).toEqual(boundaryAppData.appID);
  expect(entity.url).toEqual(boundaryAppData.url);
  expect(entity.data).toEqual(boundaryAppData.data);
});

test("Converting App Data from Entity to Boundary", () => {
  const entityAppData = mockEntityAssetApp("app id");
  const boundary = convertAssetAppData_EntityToBoundary(entityAppData);

  expect(boundary.appID).toEqual(entityAppData.appID);
  expect(boundary.url).toEqual(entityAppData.url);
  expect(boundary.data).toEqual(entityAppData.data);
});

test("Converting Asset File from Boundary to entity", ()=>{
  const boundary = mockBoundaryAssetFile(1, "PUBLISHED", [
    mockBoundaryAssetApp("app1"),
    mockBoundaryAssetApp("app2"),
  ]);

  const entity = convertAssetFile_BoundarytoEntity(boundary);
  
  expect(entity.version).toEqual(boundary.version);
  expect(entity.filename).toEqual(boundary.filename);
  expect(entity.url).toEqual(boundary.url);
  expect(entity.status).toEqual(boundary.status);
  expect(entity.blobUrl).toEqual(boundary.blobUrl);

  expect(entity.appData.length).toEqual(boundary.appData.length);

  entity.appData.forEach((appData,i)=>{
    expect(appData.appID).toEqual(boundary.appData[i].appID)
    expect(appData.data).toEqual(boundary.appData[i].data)
    expect(appData.url).toEqual(boundary.appData[i].url)
  })
})

test("Converting Asset File from Entity to Boundary", ()=>{
  const entity = mockEntityAssetFile(1, "PUBLISHED", [
    mockBoundaryAssetApp("app1"),
    mockBoundaryAssetApp("app2"),
  ]);

  const boundary = convertAssetFile_EntityToBoundary(entity);
  
  expect(boundary.version).toEqual(entity.version);
  expect(boundary.filename).toEqual(entity.filename);
  expect(boundary.url).toEqual(entity.url);
  expect(boundary.status).toEqual(entity.status);
  expect(boundary.blobUrl).toEqual(entity.blobUrl);

  expect(boundary.appData.length).toEqual(entity.appData.length);

  boundary.appData.forEach((appData,i)=>{
    expect(appData.appID).toEqual(entity.appData[i].appID)
    expect(appData.data).toEqual(entity.appData[i].data)
    expect(appData.url).toEqual(entity.appData[i].url)
  })
})