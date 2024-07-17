import { HostAppObjectRepo } from "../HostAppObject";

export interface ReactHookPmAdapter<VM> {
  defaultVM: VM;
  subscribe(appObjects: HostAppObjectRepo, setVM: (vm: VM) => void): void;
  unsubscribe(appObjects: HostAppObjectRepo, setVM: (vm: VM) => void): void;
}
