import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { UserTokenPM } from "../PMs/UserTokenPM";

export class UserTokenPMMock extends UserTokenPM {
  vmsAreEqual = jest.fn();
  constructor(appObject: HostAppObject) {
    super(appObject, UserTokenPM.type);
  }
}

export function makeUserTokenPMMock(appObjects: HostAppObjectRepo) {
  return new UserTokenPMMock(appObjects.getOrCreate("UserTokenPMMock"));
}
