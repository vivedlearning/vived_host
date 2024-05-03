import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeAppAssets } from "../Entities/AppAssetsEntity";
import {toggleShowArchivedAssets} from "../Controllers/toggleShowArchivedAssets"

function makeTestRig() {
	const appObjects = makeHostAppObjectRepo();
	const appAssets = makeAppAssets(appObjects.getOrCreate("AppAssets"));

	return {appObjects, appAssets}
}

describe("Toggle Show Archived Assets Controller", ()=>{
	it("Toggles the value on the entity", ()=>{
		const {appAssets, appObjects} = makeTestRig();

		appAssets.showArchived = true;

		toggleShowArchivedAssets(appObjects);

		expect(appAssets.showArchived).toEqual(false);

		toggleShowArchivedAssets(appObjects);

		expect(appAssets.showArchived).toEqual(true);
	})

	it("Warns if it cannot find the entity", ()=>{
		const appObjects = makeHostAppObjectRepo();

		appObjects.submitWarning = jest.fn();

		toggleShowArchivedAssets(appObjects);

		expect(appObjects.submitWarning).toBeCalled();
	})
})