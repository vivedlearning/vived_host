import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { SandboxStatePM } from "../PMs/SandboxStatePM";

export class RenderAppPMMock extends SandboxStatePM {
  vmsAreEqual = jest.fn();
  constructor(appObject: HostAppObject) {
    super(appObject, SandboxStatePM.type);
  }
}

export function makeRenderAppPMMock(appObjects: HostAppObjectRepo) {
  return new RenderAppPMMock(appObjects.getOrCreate("RenderAppPMMock"));
}
