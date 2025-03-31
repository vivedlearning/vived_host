import { AppObject, AppObjectRepo } from "@vived/core";
import { HostStatePM, HostStateVM } from "../PMs/HostStatePM";

export class MockHostStatePM extends HostStatePM {
  // Simple implementation that always returns true for equality checks
  vmsAreEqual(a: HostStateVM, b: HostStateVM): boolean {
    return true;
  }

  // Exposed method to manually trigger a view model update
  updateVM(vm: HostStateVM): void {
    this.doUpdateView(vm);
  }

  constructor(appObject: AppObject) {
    super(appObject, HostStatePM.type);
  }
}

export function makeMockHostStatePM(appObject: AppObject): MockHostStatePM {
  return new MockHostStatePM(appObject);
}
