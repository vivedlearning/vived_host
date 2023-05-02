import { makeAsset } from "./Asset";

function makeTestRig() {
    const asset = makeAsset("id1");
    const observer = jest.fn();

    asset.addObserver(observer);

    return { asset, observer };
}

describe("Asset Entity", () => {
    it("Sets the readonly id", () => {
        const { asset } = makeTestRig();
        expect(asset.id).toEqual("id1");
    });

    it("Sets the name and notifies if there's a change", () => {
        const { asset, observer } = makeTestRig();
        const valueToSet = "some name";
        observer.mockClear();

        asset.name = valueToSet;
        expect(asset.name).toEqual(valueToSet);
        expect(observer).toBeCalled();

        observer.mockClear();
        asset.name = valueToSet;
        asset.name = valueToSet;
        expect(observer).not.toBeCalled();
    });

    it("Sets the description and notifies if there's a change", () => {
        const { asset, observer } = makeTestRig();
        const valueToSet = "some description";
        observer.mockClear();

        asset.description = valueToSet;
        expect(asset.description).toEqual(valueToSet);
        expect(observer).toBeCalled();

        observer.mockClear();
        asset.description = valueToSet;
        asset.description = valueToSet;
        expect(observer).not.toBeCalled();
    });

    it("Sets archived and notifies if there's a change", () => {
        const { asset, observer } = makeTestRig();
        const valueToSet = true;
        observer.mockClear();

        asset.archived = valueToSet;
        expect(asset.archived).toEqual(valueToSet);
        expect(observer).toBeCalled();

        observer.mockClear();
        asset.archived = valueToSet;
        asset.archived = valueToSet;
        expect(observer).not.toBeCalled();
    });

    it("Sets the filename and notifies if there's a change", () => {
        const { asset, observer } = makeTestRig();
        const valueToSet = "some filename";
        observer.mockClear();

        asset.filename = valueToSet;
        expect(asset.filename).toEqual(valueToSet);
        expect(observer).toBeCalled();

        observer.mockClear();
        asset.filename = valueToSet;
        asset.filename = valueToSet;
        expect(observer).not.toBeCalled();
    });

    it("Sets the fileURL and notifies if there's a change", () => {
        const { asset, observer } = makeTestRig();
        const valueToSet = "some file url";
        observer.mockClear();

        asset.fileURL = valueToSet;
        expect(asset.fileURL).toEqual(valueToSet);
        expect(observer).toBeCalled();

        observer.mockClear();
        asset.fileURL = valueToSet;
        asset.fileURL = valueToSet;
        expect(observer).not.toBeCalled();
    });

    it("Sets the file and blob url when a file is set and notifies", () => {
        const { asset, observer } = makeTestRig();
        const testUrl = "www.someURL.com";
        URL.createObjectURL = jest.fn().mockReturnValue(testUrl);

        expect(asset.file).toBeUndefined();
        expect(asset.blobURL).toBeUndefined();
        observer.mockClear();

        const file: File = new File(["file data"], "filename");
        asset.setFile(file);

        expect(URL.createObjectURL).toBeCalled();
        expect(observer).toBeCalled();
        expect(asset.file).toEqual(file);
        expect(asset.blobURL).toEqual(testUrl);
    });

    it("Can add a linked asset and notifies if it's a new id", () => {
        const { asset, observer } = makeTestRig();

        expect(asset.linkedAssets).toEqual([]);
        observer.mockClear();

        asset.addLinkedAsset("model", "id1");
        expect(asset.linkedAssets.length).toEqual(1);
        expect(asset.linkedAssets[0]).toEqual({ type: "model", id: "id1" });
        expect(observer).toBeCalled();
        observer.mockClear();

        asset.addLinkedAsset("model", "id2");
        expect(asset.linkedAssets.length).toEqual(2);
        expect(asset.linkedAssets[1]).toEqual({ type: "model", id: "id2" });
        expect(observer).toBeCalled();
        observer.mockClear();

        asset.addLinkedAsset("picture", "id1");
        expect(asset.linkedAssets.length).toEqual(2);
        expect(observer).not.toBeCalled();
    });

    it("Can remove a linked asset and notifies of a change", () => {
        const { asset, observer } = makeTestRig();
        asset.addLinkedAsset("model", "id1");
        asset.addLinkedAsset("model", "id2");
        asset.addLinkedAsset("picture", "id3");

        expect(asset.linkedAssets.length).toEqual(3);
        observer.mockClear();

        asset.removeLinkedAsset("model", "id2");
        expect(asset.linkedAssets.length).toEqual(2);
        expect(observer).toBeCalled();
        observer.mockClear();

        asset.removeLinkedAsset("model", "id2");
        asset.removeLinkedAsset("model", "wrong id");
        asset.removeLinkedAsset("wrong type", "id1");
        asset.removeLinkedAsset("picture", "id1");
        expect(asset.linkedAssets.length).toEqual(2);
        expect(observer).not.toBeCalled();
    });

    it("Can get linked assets by type", () => {
        const { asset } = makeTestRig();
        asset.addLinkedAsset("model", "id1");
        asset.addLinkedAsset("model", "id2");
        asset.addLinkedAsset("picture", "id3");

        const models: string[] = asset.getLinkedAssetByType("model");
        expect(models.length).toEqual(2);
        expect(models[0]).toEqual("id1");
        expect(models[1]).toEqual("id2");

        const pictures: string[] = asset.getLinkedAssetByType("picture");
        expect(pictures.length).toEqual(1);
        expect(pictures[0]).toEqual("id3");

        const somethings: string[] = asset.getLinkedAssetByType("something");
        expect(somethings.length).toEqual(0);
    });

    it("Sets is fetching file and notifies if there's a change", () => {
        const { asset, observer } = makeTestRig();
        const valueToSet = true;
        observer.mockClear();

        asset.isFetchingFile = valueToSet;
        expect(asset.isFetchingFile).toEqual(valueToSet);
        expect(observer).toBeCalled();

        observer.mockClear();
        asset.isFetchingFile = valueToSet;
        asset.isFetchingFile = valueToSet;
        expect(observer).not.toBeCalled();
    });

    it("Sets fetch error and notifies if there's a change", () => {
        const { asset, observer } = makeTestRig();
        expect(asset.fetchError).toEqual(undefined);
        observer.mockClear();

        asset.fetchError = undefined;
        expect(observer).not.toBeCalled();

        const errorToSet: Error = new Error("something wrong");

        asset.fetchError = errorToSet;
        expect(asset.fetchError).toEqual(errorToSet);
        expect(observer).toBeCalled();
        observer.mockClear();

        asset.fetchError = errorToSet;
        asset.fetchError = errorToSet;
        expect(observer).not.toBeCalled();
    });

    it("Can dispose the blob url", () => {
        const { asset, observer } = makeTestRig();
        URL.createObjectURL = jest.fn().mockReturnValue("www.someURL.com");
        URL.revokeObjectURL = jest.fn();
        observer.mockClear();

        asset.dispose();
        expect(URL.revokeObjectURL).not.toBeCalled();
        expect(observer).not.toBeCalled();

        const file: File = new File(["file data"], "filename");
        asset.setFile(file);
        expect(observer).toBeCalled();
        expect(asset.file).toBeDefined();
        expect(asset.blobURL).toBeDefined();
        observer.mockClear();

        asset.dispose();
        expect(URL.revokeObjectURL).toBeCalled();
        expect(observer).toBeCalled();
        expect(asset.blobURL).toEqual(undefined);
    });
});
