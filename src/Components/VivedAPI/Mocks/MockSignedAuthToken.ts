import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { SignedAuthTokenUC } from "../UCs/SignedAuthTokenUC";

export class MockSignedAuthTokenUC extends SignedAuthTokenUC {
  getPlayerAuthToken = jest.fn();
  getUserAuthToken = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, SignedAuthTokenUC.type);
  }
}

export function makeMockSignedAuthTokenUC(appObjects: HostAppObjectRepo) {
  return new MockSignedAuthTokenUC(
    appObjects.getOrCreate("MockSignedAuthTokenUC")
  );
}
