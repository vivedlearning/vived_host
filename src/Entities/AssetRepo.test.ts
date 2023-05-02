import { Asset, makeAsset } from "./Asset";
import { makeAssetRepo } from "./AssetRepo";

function makeTestRig() {
    const assetRepo = makeAssetRepo();
    const observer = jest.fn();
    assetRepo.addObserver(observer);

    return { assetRepo, observer };
}

function makeAndSetupAsset(id: string): Asset {
    const asset: Asset = makeAsset(id);
    asset.name = "asset name " + id.toString();
    return asset;
}

describe("Asset Repo entity", () => {
    it("Starts as an empty repository", () => {
        const { assetRepo, observer } = makeTestRig();

        expect(assetRepo.assets.length).toEqual(0);
        expect(observer).not.toBeCalled();
    });

    it("Can add assets", () => {
        const { assetRepo, observer } = makeTestRig();

        const asset1: Asset = makeAndSetupAsset("id1");

        observer.mockClear();
        assetRepo.addAsset(asset1);
        expect(observer).toBeCalled();
        expect(assetRepo.assets.length).toEqual(1);
        expect(assetRepo.assets[0].id).toEqual("id1");
        expect(assetRepo.assets[0].name).toEqual("asset name id1");
    });

    it("Replaces existing assets when adding with the same id", () => {
        const { assetRepo, observer } = makeTestRig();

        assetRepo.addAsset(makeAndSetupAsset("id1"));

        const updatedAsset1: Asset = makeAsset("id1");
        updatedAsset1.name = "updated asset 1";

        observer.mockClear();
        assetRepo.addAsset(updatedAsset1);
        expect(observer).toBeCalled();
        expect(assetRepo.assets.length).toEqual(1);
        expect(assetRepo.assets[0].id).toEqual("id1");
        expect(assetRepo.assets[0].name).toEqual("updated asset 1");
    });

    it("Can remove assets by id and notifies if there's a change", () => {
        const { assetRepo, observer } = makeTestRig();

        assetRepo.addAsset(makeAndSetupAsset("id1"));
        assetRepo.addAsset(makeAndSetupAsset("id2"));

        observer.mockClear();
        assetRepo.removeAsset("id1");

        expect(observer).toBeCalled();
        expect(assetRepo.assets.length).toEqual(1);
        expect(assetRepo.assets[0].id).toEqual("id2");
        expect(assetRepo.assets[0].name).toEqual("asset name id2");
    });

    it("Does not remove and notify if id does not exist any longer", () => {
        const { assetRepo, observer } = makeTestRig();

        assetRepo.addAsset(makeAndSetupAsset("id1"));
        assetRepo.removeAsset("id1");

        observer.mockClear();
        assetRepo.removeAsset("id1");
        assetRepo.removeAsset("incorrect id");

        expect(observer).not.toBeCalled();
        expect(assetRepo.assets.length).toEqual(0);
    });

    it("Can let the outside know if an asset exists by id", () => {
        const { assetRepo } = makeTestRig();

        assetRepo.addAsset(makeAndSetupAsset("id1"));
        assetRepo.addAsset(makeAndSetupAsset("id2"));

        expect(assetRepo.hasAsset("id1")).toEqual(true);
        expect(assetRepo.hasAsset("id2")).toEqual(true);
        expect(assetRepo.hasAsset("id3")).toEqual(false);
        expect(assetRepo.hasAsset("something else")).toEqual(false);
    });

    it("Can return an asset by id", () => {
        const { assetRepo } = makeTestRig();

        assetRepo.addAsset(makeAndSetupAsset("id1"));
        assetRepo.addAsset(makeAndSetupAsset("id2"));

        expect(assetRepo.getAssetByID("id1")).toBeDefined();
        expect(assetRepo.getAssetByID("id1")?.name).toEqual("asset name id1");
        expect(assetRepo.getAssetByID("id2")).toBeDefined();
        expect(assetRepo.getAssetByID("id2")?.name).toEqual("asset name id2");
        expect(assetRepo.getAssetByID("id3")).toBeUndefined();
        expect(assetRepo.getAssetByID("something else")).toBeUndefined();
    });
});