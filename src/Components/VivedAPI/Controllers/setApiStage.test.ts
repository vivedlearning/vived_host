import { makeAppObjectRepo } from "@vived/core";
import { APIStage, VivedAPIEntity } from "../Entities";
import { setApiStage } from "./setApiStage";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
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
    const appObjects = makeAppObjectRepo();

    appObjects.submitWarning = jest.fn();

    setApiStage(APIStage.DEVELOPMENT, appObjects);

    expect(appObjects.submitWarning).toBeCalled();
  });
});
