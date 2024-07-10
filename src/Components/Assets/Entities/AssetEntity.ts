import { MemoizedBoolean, MemoizedString, ObservableEntity } from '../../../Entities';
import { HostAppObject, HostAppObjectEntity } from '../../../HostAppObject';

export abstract class AssetEntity extends HostAppObjectEntity {
  static type = 'AssetEntity';

  abstract readonly id: string;

  abstract get name(): string;
  abstract set name(name: string);

  abstract get description(): string;
  abstract set description(description: string);

  abstract get owner(): string;
  abstract set owner(val: string);

  abstract get archived(): boolean;
  abstract set archived(archived: boolean);

  abstract get filename(): string;
  abstract set filename(filename: string);

  abstract get fileURL(): string;
  abstract set fileURL(fileURL: string);

  abstract setFile(file: File): void;
  abstract get file(): File | undefined;
  abstract get blobURL(): string | undefined;
  abstract get fileHasBeenFetched(): boolean;

  abstract get linkedAssets(): { type: string; id: string }[];
  abstract addLinkedAsset(type: string, id: string): void;
  abstract removeLinkedAsset(type: string, id: string): void;
  abstract getLinkedAssetByType(type: string): string[];

  abstract get isFetchingFile(): boolean;
  abstract set isFetchingFile(isFetchingFile: boolean);

  abstract get fetchError(): Error | undefined;
  abstract set fetchError(fetchError: Error | undefined);

  static get(appObject: HostAppObject): AssetEntity | undefined {
    const asset = appObject.getComponent<AssetEntity>(AssetEntity.type);
    if (!asset) {
      appObject.appObjectRepo.submitWarning(
        'AssetEntity.get',
        'Unable to find AssetEntity on app object ' + appObject.id,
      );
    }
    return asset;
  }
}

export function makeAssetEntity(appObject: HostAppObject): AssetEntity {
  return new AssetImp(appObject);
}

class AssetImp extends AssetEntity {
  get id(): string {
    return this.appObject.id;
  }

  private _memoizedName: MemoizedString = new MemoizedString('', this.notifyOnChange);
  get name(): string {
    return this._memoizedName.val;
  }

  set name(name: string) {
    this._memoizedName.val = name;
  }

  private _memoizedOwner: MemoizedString = new MemoizedString('', this.notifyOnChange);
  get owner(): string {
    return this._memoizedOwner.val;
  }

  set owner(val: string) {
    this._memoizedOwner.val = val;
  }

  private _memoizedDescription: MemoizedString = new MemoizedString('', this.notifyOnChange);
  get description(): string {
    return this._memoizedDescription.val;
  }

  set description(description: string) {
    this._memoizedDescription.val = description;
  }

  private _memoizedArchived: MemoizedBoolean = new MemoizedBoolean(false, this.notifyOnChange);
  get archived(): boolean {
    return this._memoizedArchived.val;
  }

  set archived(archived: boolean) {
    this._memoizedArchived.val = archived;
  }

  private _memoizedFileURL: MemoizedString = new MemoizedString('', this.notifyOnChange);
  private _memoizedFilename: MemoizedString = new MemoizedString('', this.notifyOnChange);
  
  get filename(): string {
    return this._memoizedFilename.val;
  }
  set filename(name: string) {
    this._memoizedFilename.val = name;
  }
  get fileURL(): string {
    return this._memoizedFileURL.val;
  }

  set fileURL(name: string) {
    this._memoizedFileURL.val = name;
  }

  private _file: File | undefined = undefined;
  private _blobURL: string | undefined = undefined;

  setFile = (file: File) => {
    this._file = file;
    this._blobURL = URL.createObjectURL(file);
    this.notifyOnChange();
  };

  get file(): File | undefined {
    return this._file;
  }

  get blobURL(): string | undefined {
    return this._blobURL;
  }

  get fileHasBeenFetched(): boolean {
    return this._file !== undefined;
  }

  private _linkedAssets: { type: string; id: string }[] = [];
  get linkedAssets(): { type: string; id: string }[] {
    return [...this._linkedAssets];
  }

  addLinkedAsset = (type: string, id: string) => {
    const existingAsset = this._linkedAssets.find((asset) => {
      return asset.id === id;
    });

    if (existingAsset === undefined) {
      this._linkedAssets.push({
        id,
        type,
      });
      this.notifyOnChange();
    }
  };

  removeLinkedAsset = (type: string, id: string) => {
    let foundAsset: boolean = false;
    this._linkedAssets.forEach((asset) => {
      if (asset.type === type && asset.id === id) {
        foundAsset = true;
      }
    });

    if (foundAsset) {
      this._linkedAssets = this._linkedAssets.filter((asset) => asset.id !== id);
      this.notifyOnChange();
    }
  };

  getLinkedAssetByType = (type: string): string[] => {
    const rVal: string[] = [];

    this._linkedAssets.forEach((asset) => {
      if (asset.type === type) {
        rVal.push(asset.id);
      }
    });

    return rVal;
  };

  private _memoizedIsFetchingFile: MemoizedBoolean = new MemoizedBoolean(false, this.notifyOnChange);
  get isFetchingFile(): boolean {
    return this._memoizedIsFetchingFile.val;
  }
  set isFetchingFile(archived: boolean) {
    this._memoizedIsFetchingFile.val = archived;
  }

  private _fetchError: Error | undefined = undefined;
  get fetchError(): Error | undefined {
    return this._fetchError;
  }
  set fetchError(fetchError: Error | undefined) {
    if (fetchError === undefined && this.fetchError === undefined) return;

    if (fetchError !== undefined && this.fetchError !== undefined && fetchError.message === this.fetchError.message)
      return;

    this._fetchError = fetchError;
    this.notifyOnChange();
  }

  dispose = () => {
    if (this._blobURL !== undefined) {
      URL.revokeObjectURL(this._blobURL);
      this._blobURL = undefined;
      this.notifyOnChange();
    }
    super.dispose();
  };

  constructor(appObject: HostAppObject) {
    super(appObject, AssetEntity.type);
  }
}
