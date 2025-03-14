import { AppObject, AppObjectRepo } from "@vived/core";
import { SignedAuthTokenUC } from "../UCs/SignedAuthTokenUC";

export class MockSignedAuthTokenUC extends SignedAuthTokenUC {
  getAuthToken = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, SignedAuthTokenUC.type);
  }
}

export function makeMockSignedAuthTokenUC(appObjects: AppObjectRepo) {
  return new MockSignedAuthTokenUC(
    appObjects.getOrCreate("MockSignedAuthTokenUC")
  );
}
