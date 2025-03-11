import { AppObject, AppObjectRepo } from "@vived/core";
import { SandboxStatePM } from "../PMs/SandboxStatePM";

export class RenderAppPMMock extends SandboxStatePM {
  vmsAreEqual = jest.fn();
  constructor(appObject: AppObject) {
    super(appObject, SandboxStatePM.type);
  }
}

export function makeRenderAppPMMock(appObjects: AppObjectRepo) {
  return new RenderAppPMMock(appObjects.getOrCreate("RenderAppPMMock"));
}
