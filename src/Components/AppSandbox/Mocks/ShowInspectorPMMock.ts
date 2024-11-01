import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { ShowInspectorPM } from "../PMs/ShowInspectorPM";

export class ShowInspectorPMMock extends ShowInspectorPM {
  vmsAreEqual = jest.fn();
  constructor(appObject: HostAppObject) {
    super(appObject, ShowInspectorPM.type);
  }
}

export function makeShowInspectorPMMock(appObjects: HostAppObjectRepo) {
  return new ShowInspectorPMMock(appObjects.getOrCreate("ShowInspectorPMMock"));
}
