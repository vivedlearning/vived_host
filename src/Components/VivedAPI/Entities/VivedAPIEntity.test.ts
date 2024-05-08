import { makeHostAppObjectRepo } from '../../../HostAppObject';
import { VivedAPIEntity } from './VivedAPIEntity';

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const singletonSpy = jest.spyOn(appObjects, 'registerSingleton');

  const vivedApi = new VivedAPIEntity(appObjects.getOrCreate('ao'));

  return { vivedApi, appObjects, singletonSpy };
}

describe('JSON Requester', () => {
  it('Registers itself as the Singleton', () => {
    const { vivedApi, singletonSpy } = makeTestRig();

    expect(singletonSpy).toBeCalledWith(vivedApi);
  });

  it('Gets the singleton', () => {
    const { vivedApi, appObjects } = makeTestRig();

    expect(VivedAPIEntity.get(appObjects)).toEqual(vivedApi);
  });

  it('Forms the endpoint url', () => {
    const { vivedApi } = makeTestRig();

    const endpoint = vivedApi.getEndpointURL('someEndpoint');

    const expectedURL = `${vivedApi.baseUrl}/someEndpoint`;

    expect(endpoint.toString()).toEqual(expectedURL);
  });
});
