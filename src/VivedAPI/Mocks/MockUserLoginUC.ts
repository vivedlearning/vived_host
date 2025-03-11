import { AppObject, AppObjectRepo } from "@vived/core";
import { UserAuthUC } from "../UCs/UserAuthUC";

export class MockUserAuthUC extends UserAuthUC {
  login = jest.fn().mockResolvedValue(undefined);
  logout = jest.fn().mockResolvedValue(undefined);
  refreshAuthenticatedUser = jest.fn().mockResolvedValue(undefined);

  constructor(appObject: AppObject) {
    super(appObject, UserAuthUC.type);
  }
}

export function makeMockUserLoginUC(appObjects: AppObjectRepo) {
  return new MockUserAuthUC(appObjects.getOrCreate("MockUserAuthUC"));
}
