import { AppObject, AppObjectRepo } from "@vived/core";
import { UserTokenPM } from "../PMs/UserTokenPM";

export class UserTokenPMMock extends UserTokenPM {
  vmsAreEqual = jest.fn();
  constructor(appObject: AppObject) {
    super(appObject, UserTokenPM.type);
  }
}

export function makeUserTokenPMMock(appObjects: AppObjectRepo) {
  return new UserTokenPMMock(appObjects.getOrCreate("UserTokenPMMock"));
}
