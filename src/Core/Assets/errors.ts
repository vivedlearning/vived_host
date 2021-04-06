export class InvalidAssetID extends Error {
  constructor(id: string) {
    const msg = `Asset ${id} was not found`;
    super(msg);
  }
}

// tslint:disable-next-line: max-classes-per-file
export class DuplicateAssetID extends Error {
  constructor(id: string) {
    const msg = `Asset ID ${id} has already been added`;
    super(msg);
  }
}

// tslint:disable-next-line: max-classes-per-file
export class EmptyAssetIDError extends Error {
  constructor() {
    const msg = `Asset ID cannot be empty`;
    super(msg);
  }
}

// tslint:disable-next-line: max-classes-per-file
export class AppFileVersionError extends Error {
  constructor(appID: string, version: number) {
    const msg = `Could not find file version ${version} for Asset ${appID}`;
    super(msg);
  }
}

// tslint:disable-next-line: max-classes-per-file
export class AssetHasNotBeenLoadedError extends Error {
  constructor(appID: string, version: number) {
    const msg = `Asset file version ${version} for Asset ${appID} has not been loaded`;
    super(msg);
  }
}