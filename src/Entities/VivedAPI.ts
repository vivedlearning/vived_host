import { ObservableEntity } from './ObservableEntity';

export interface AssetDTO {
  id: string;
  name: string;
  description: string;
  archived: boolean;
  filename: string;
  fileURL: string;
  linkedAssets: { type: string; asset: AssetDTO }[];
}

export interface NewAssetDTO {
  name: string;
  description: string;
  ownerID: string;
  file: File;
}

export interface AppDTO {
  interfaceVersion: string;
  assetFolderURL: string;
  entrypoints: string[];
}

export abstract class VivedAPI extends ObservableEntity {
  abstract baseUrl: string;

  abstract get userAuthToken(): string | undefined;
  abstract set userAuthToken(token: string | undefined);
  abstract clearAuthToken(): void;

  abstract getEndpointURL(endpoint: string): URL;

  abstract fetchAssetFile: (assetID: string) => Promise<File>;
  abstract fetchAssetMeta: (assetID: string) => Promise<AssetDTO>;
  abstract fetchAssetsForOwner: (ownerID: string) => Promise<AssetDTO[]>;
  abstract setAssetArchived: (assetID: string, archived: boolean) => Promise<void>;
  abstract postAssetMeta: (data: AssetDTO) => Promise<void>;
  abstract createNewAsset: (data: NewAssetDTO) => Promise<AssetDTO>;
  abstract postAssetFile: (assetID: string, file: File) => Promise<void>;
  abstract deleteAsset: (assetID: string) => Promise<void>;
  abstract fetchApp(appID: string, version: string): Promise<AppDTO>;  
}

export function makeVivedAPI(): VivedAPI {
  return new VivedAPIImp();
}

class VivedAPIImp extends VivedAPI {
  baseUrl: string = 'https://api.vivedlearning.com';
  getEndpointURL = (endpoint: string): URL => {
    return new URL(endpoint, this.baseUrl);
  };

  private _userAuthToken: string | undefined = undefined;
  get userAuthToken(): string | undefined {
    return this._userAuthToken;
  }

  set userAuthToken(token: string | undefined) {
    if (token === this._userAuthToken) return;

    this._userAuthToken = token;
    this.notify();
  }

  clearAuthToken = () => {
    if (this._userAuthToken === undefined) return;

    this._userAuthToken = undefined;
    this.notify();
  };

  fetchAssetFile = (/*assetId: string*/): Promise<File> => {
    return Promise.reject(this.functionNotInjectedError('fetchAssetFile'));
  };

  fetchAssetMeta = (/*assetID: string*/): Promise<AssetDTO> => {
    return Promise.reject(this.functionNotInjectedError('fetchAssetMeta'));
  };

  fetchAssetsForOwner = (ownerID: string): Promise<AssetDTO[]> => {
    return Promise.reject(this.functionNotInjectedError('fetchAssetsForOwner'));
  };

  setAssetArchived = (assetID: string, archived: boolean): Promise<void> => {
    return Promise.reject(this.functionNotInjectedError('setAssetArchived'));
  };

  postAssetMeta = (data: AssetDTO): Promise<void> => {
    return Promise.reject(this.functionNotInjectedError('postAssetMeta'));
  };

  createNewAsset = (data: NewAssetDTO): Promise<AssetDTO> => {
    return Promise.reject(this.functionNotInjectedError('createNewAsset'));
  };

  postAssetFile = (assetID: string, file: File): Promise<void> => {
    return Promise.reject(this.functionNotInjectedError('postAssetFile'));
  };
  
  deleteAsset = (assetID: string): Promise<void> => {
    return Promise.reject(this.functionNotInjectedError('deleteAsset'));
  };

  fetchApp(appID: string, version: string): Promise<AppDTO> {
    return Promise.reject(this.functionNotInjectedError("fetchApp"));
  } 

  private functionNotInjectedError(functionName: string): Error {
    return new Error(`API function ${functionName} has not been injected`);
  }
}
