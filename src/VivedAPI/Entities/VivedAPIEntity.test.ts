import { makeAppObjectRepo } from "@vived/core";
import { APIStage, VivedAPIEntity } from "./VivedAPIEntity";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const singletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const vivedApi = new VivedAPIEntity(appObjects.getOrCreate("ao"));
  const observer = jest.fn();
  vivedApi.addChangeObserver(observer);

  return { vivedApi, appObjects, singletonSpy, observer };
}

describe("JSON Requester", () => {
  it("Registers itself as the Singleton", () => {
    const { vivedApi, singletonSpy } = makeTestRig();

    expect(singletonSpy).toBeCalledWith(vivedApi);
  });

  it("Gets the singleton", () => {
    const { vivedApi, appObjects } = makeTestRig();

    expect(VivedAPIEntity.get(appObjects)).toEqual(vivedApi);
  });

  it("Forms the endpoint url", () => {
    const { vivedApi } = makeTestRig();

    const endpoint = vivedApi.getEndpointURL("someEndpoint");

    const expectedURL = `${vivedApi.baseUrl}/someEndpoint`;

    expect(endpoint.toString()).toEqual(expectedURL);
  });

  it("Notifies when the user token changes", () => {
    const { vivedApi, observer } = makeTestRig();

    observer.mockClear();

    vivedApi.userToken = "userToken";
    vivedApi.userToken = "userToken";
    vivedApi.userToken = "userToken";

    expect(observer).toBeCalledTimes(1);
    expect(vivedApi.userToken).toEqual("userToken");
  });

  it("Notifies when the stage changes", () => {
    const { vivedApi, observer } = makeTestRig();
    vivedApi.apiStage = APIStage.DEVELOPMENT;

    expect(observer).toBeCalled();
    expect(vivedApi.apiStage).toEqual(APIStage.DEVELOPMENT);

    observer.mockClear();

    vivedApi.apiStage = APIStage.DEVELOPMENT;
    vivedApi.apiStage = APIStage.DEVELOPMENT;
    vivedApi.apiStage = APIStage.DEVELOPMENT;

    expect(observer).not.toBeCalled();
  });

  it("Returns the expected base URL for the current stage", () => {
    const { vivedApi } = makeTestRig();

    vivedApi.apiStage = APIStage.DEVELOPMENT;
    expect(vivedApi.baseUrl).toEqual(vivedApi.developmentURL);

    vivedApi.apiStage = APIStage.LOCAL;
    expect(vivedApi.baseUrl).toEqual(vivedApi.localURL);

    vivedApi.apiStage = APIStage.PRODUCTION;
    expect(vivedApi.baseUrl).toEqual(vivedApi.productionURL);

    vivedApi.apiStage = APIStage.STAGING;
    expect(vivedApi.baseUrl).toEqual(vivedApi.stagingURL);
  });
});
