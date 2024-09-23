import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { APIStage, VivedAPIEntity } from "../Entities";
import { setApiStage } from "./setApiStage";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const apiEntity = new VivedAPIEntity(appObjects.getOrCreate("Sandbox"));
  return {
    appObjects,
    apiEntity
  };
}

describe("Set API Stage", () => {
  it("Set API Stage", () => {
    const { appObjects, apiEntity } = makeTestRig();

    apiEntity.apiStage = APIStage.LOCAL;

    setApiStage(APIStage.DEVELOPMENT, appObjects);

    expect(apiEntity.apiStage).toEqual(APIStage.DEVELOPMENT);
  });

  it("Warns if it cannot find the Entity", () => {
    const appObjects = makeHostAppObjectRepo();

    appObjects.submitWarning = jest.fn();

    setApiStage(APIStage.DEVELOPMENT, appObjects);

    expect(appObjects.submitWarning).toBeCalled();
  });
});
