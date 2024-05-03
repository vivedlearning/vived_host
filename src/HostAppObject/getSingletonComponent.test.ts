import { makeHostAppObjectRepo } from './HostAppObjectRepo';
import { getSingletonComponent } from './getSingletonComponent';

describe('Get Singleton Component', () => {
  it('Calls the get singleton on the app object repo', () => {
    const appObjects = makeHostAppObjectRepo();

    appObjects.getSingleton = jest.fn();

    getSingletonComponent('Mock Component', appObjects);

    expect(appObjects.getSingleton).toBeCalledWith('Mock Component');
  });
});
