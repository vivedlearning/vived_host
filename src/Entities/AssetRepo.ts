import { Asset } from "./Asset";
import { ObservableEntity } from "./ObservableEntity";

export abstract class AssetRepo extends ObservableEntity {
    abstract get assets(): Asset[];
    abstract addAsset(asset: Asset): void;
    abstract removeAsset(id: string): void;
    abstract hasAsset(id: string): boolean;
    abstract getAssetByID(id: string): Asset | undefined;
}

export function makeAssetRepo(): AssetRepo {
    return new AssetRepoImp();
}

class AssetRepoImp extends AssetRepo {
    private _assets: Asset[];

    get assets(): Asset[] {
        return [...this._assets];
    }

    addAsset(asset: Asset) {
        const newAssets = this._assets.filter(existingAsset => existingAsset.id !== asset.id);
        newAssets.push(asset);
        this._assets = [...newAssets];
        this.notify();
    }

    removeAsset(id: string) {
        let foundAsset: boolean = false;
        this._assets.forEach(asset => {
            if (asset.id === id) {
                foundAsset = true;
            }
        });

        if (foundAsset) {
            this._assets = this._assets.filter(asset => asset.id !== id);
            this.notify();
        }
    }

    hasAsset(id: string): boolean {
        let hasAsset: boolean = false;
        this._assets.forEach(asset => {
            if (asset.id === id) {
                hasAsset = true;
            }
        });
        return hasAsset;
    }

    getAssetByID(id: string): Asset | undefined {
        let foundAsset: Asset | undefined = undefined;
        this._assets.forEach(asset => {
            if (asset.id === id) {
                foundAsset = asset;
            }
        });
        return foundAsset;
    }

    constructor() {
        super();
        this._assets = [];
    }
}