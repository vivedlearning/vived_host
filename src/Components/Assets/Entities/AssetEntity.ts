import { MemoizedBoolean, MemoizedString, ObservableEntity } from '../../../Entities';
import { HostAppObject, HostAppObjectEntity } from '../../../HostAppObject';

export abstract class AssetEntity extends HostAppObjectEntity {
  static type = 'AssetEntity';

  abstract readonly id: string;
  abstract get archived(): boolean;
  abstract set archived(archived: boolean);
  abstract get name(): string;
  abstract set name(name: string);
  abstract get description(): string;
  abstract set description(description: string);
  abstract get filename(): string;
  abstract set filename(filename: string);
  abstract setFile(file: File): void;
  abstract get blobURL(): string | undefined;
  abstract get file(): File | undefined;

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

export function makeAsset(appObject: HostAppObject): AssetEntity {
  return new AssetImp(appObject);
}

class AssetImp extends AssetEntity {
  readonly id: string;

  private memoizedArchived = new MemoizedBoolean(false, this.notifyOnChange);
  get archived(): boolean {
    return this.memoizedArchived.val;
  }
  set archived(archived: boolean) {
    this.memoizedArchived.val = archived;
  }

  private memoizedName = new MemoizedString('', this.notifyOnChange);
  get name(): string {
    return this.memoizedName.val;
  }
  set name(name: string) {
    this.memoizedName.val = name;
  }

  private memoizedDesc = new MemoizedString('', this.notifyOnChange);
  get description(): string {
    return this.memoizedDesc.val;
  }
  set description(description: string) {
    this.memoizedDesc.val = description;
  }

  private memoizedFilename = new MemoizedString('', this.notifyOnChange);
  get filename(): string {
    return this.memoizedFilename.val;
  }
  set filename(filename: string) {
    this.memoizedFilename.val = filename;
  }

  setFile(file: File): void {
    this._file = file;
    const blobURL = URL.createObjectURL(file);
    this.memoizedURL.val = blobURL;
  }
  private _file: File | undefined;
  get file(): File | undefined {
    return this._file;
  }

  private memoizedURL = new MemoizedString('', this.notifyOnChange);
  get blobURL(): string | undefined {
    if (this.memoizedURL.val === '') {
      return undefined;
    } else {
      return this.memoizedURL.val;
    }
  }

  constructor(appObject: HostAppObject) {
    super(appObject, AssetEntity.type);
    this.id = appObject.id;
  }
}
