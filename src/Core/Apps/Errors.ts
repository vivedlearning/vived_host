export class UnableToFindAppByID extends Error {
  constructor(appID: string) {
    const msg =`Unable to find Dispatch Handler for App ${appID}`;
    super(msg);
  }
}

export class NoPayloadVersionSpecified extends Error {
  constructor(appID: string, type: string) {
    const msg =`App ${appID} has not specified a payload version for ${type}`;
    super(msg);
  }
}

export class UnsupportedPayloadVersion extends Error {
  constructor(appID: string, type: string, version: number) {
    const msg =`App ${appID} has specified an unsupported a payload version of ${version} for ${type}`;
    super(msg);
  }
}