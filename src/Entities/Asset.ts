import { MemoizedBoolean } from "./MemoizedBoolean";
import { MemoizedString } from "./MemoizedString";
import { ObservableEntity } from "./ObservableEntity";

export abstract class Asset extends ObservableEntity {
    abstract readonly id: string;

    abstract get name(): string;
    abstract set name(name: string);

    abstract get description(): string;
    abstract set description(description: string);

    abstract get archived(): boolean;
    abstract set archived(archived: boolean);

    abstract get filename(): string;
    abstract set filename(filename: string);

    abstract get fileURL(): string;
    abstract set fileURL(fileURL: string);

    abstract setFile(file: File): void;
    abstract get file(): File | undefined;
    abstract get blobURL(): string | undefined;

    abstract get linkedAssets(): { type: string, id: string }[];
    abstract addLinkedAsset(type: string, id: string): void;
    abstract removeLinkedAsset(type: string, id: string): void;
    abstract getLinkedAssetByType(type: string): string[];

    abstract get isFetchingFile(): boolean;
    abstract set isFetchingFile(isFetchingFile: boolean);

    abstract get fetchError(): Error | undefined;
    abstract set fetchError(fetchError: Error | undefined);

    abstract dispose(): void;
}

export function makeAsset(id: string): Asset {
    return new AssetImp(id);
}

class AssetImp extends Asset {
    id: string;
    private _memoizedName: MemoizedString = new MemoizedString("", this.notify);
    private _memoizedDescription: MemoizedString = new MemoizedString("", this.notify);
    private _memoizedArchived: MemoizedBoolean = new MemoizedBoolean(false, this.notify);
    private _memoizedFilename: MemoizedString = new MemoizedString("", this.notify);
    private _memoizedFileURL: MemoizedString = new MemoizedString("", this.notify);
    private _file: File | undefined = undefined;
    private _blobURL: string | undefined = undefined;
    private _linkedAssets: { type: string, id: string }[] = [];
    private _memoizedIsFetchingFile: MemoizedBoolean = new MemoizedBoolean(false, this.notify);
    private _fetchError: Error | undefined = undefined;

    get name(): string {
        return this._memoizedName.val;
    }

    set name(name: string) {
        this._memoizedName.val = name;
    }

    get description(): string {
        return this._memoizedDescription.val;
    }

    set description(description: string) {
        this._memoizedDescription.val = description;
    }

    get archived(): boolean {
        return this._memoizedArchived.val;
    }

    set archived(archived: boolean) {
        this._memoizedArchived.val = archived;
    }

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

    setFile(file: File) {
        this._file = file;
        this._blobURL = URL.createObjectURL(file);
        this.notify();
    }

    get file(): File | undefined {
        return this._file
    }

    get blobURL(): string | undefined {
        return this._blobURL;
    }

    get linkedAssets(): { type: string, id: string }[] {
        return [...this._linkedAssets];
    }

    addLinkedAsset(type: string, id: string) {
        const existingAsset = this._linkedAssets.find(asset => {
            return asset.id === id
        });

        if (existingAsset === undefined) {
            this._linkedAssets.push({
                id,
                type
            });
            this.notify();
        }
    }

    removeLinkedAsset(type: string, id: string) {
        let foundAsset: boolean = false;
        this._linkedAssets.forEach(asset => {
            if (asset.type === type && asset.id === id) {
                foundAsset = true;
            }
        });

        if (foundAsset) {
            this._linkedAssets = this._linkedAssets.filter(asset => asset.id !== id);
            this.notify();
        }
    }

    getLinkedAssetByType(type: string): string[] {
        let rVal: string[] = [];

        this._linkedAssets.forEach(asset => {
            if (asset.type === type) {
                rVal.push(asset.id);
            }
        })

        return rVal;
    }

    get isFetchingFile(): boolean {
        return this._memoizedIsFetchingFile.val;
    }

    set isFetchingFile(archived: boolean) {
        this._memoizedIsFetchingFile.val = archived;
    }

    get fetchError(): Error | undefined {
        return this._fetchError
    }

    set fetchError(fetchError: Error | undefined) {
        if (fetchError === undefined && this.fetchError === undefined) return;

        if (fetchError !== undefined && this.fetchError !== undefined &&
            fetchError.message === this.fetchError.message) return;

        this._fetchError = fetchError;
        this.notify();
    }

    dispose() {
        if (this._blobURL !== undefined) {
            URL.revokeObjectURL(this._blobURL);
            this._blobURL = undefined;
            this.notify();
        }
    }

    constructor(id: string) {
        super();
        this.id = id;
    }
}