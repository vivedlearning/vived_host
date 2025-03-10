import { AppObject, AppObjectRepo } from "@vived/core";
import { ShowInspectorPM } from "../PMs/ShowInspectorPM";

export class ShowInspectorPMMock extends ShowInspectorPM {
  vmsAreEqual = jest.fn();
  constructor(appObject: AppObject) {
    super(appObject, ShowInspectorPM.type);
  }
}

export function makeShowInspectorPMMock(appObjects: AppObjectRepo) {
  return new ShowInspectorPMMock(appObjects.getOrCreate("ShowInspectorPMMock"));
}
