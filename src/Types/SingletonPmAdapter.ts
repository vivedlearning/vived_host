import { HostAppObjectRepo } from "../HostAppObject";

export interface SingletonPmAdapter<VM> {
  defaultVM: VM;
  subscribe(appObjects: HostAppObjectRepo, setVM: (vm: VM) => void): void;
  unsubscribe(appObjects: HostAppObjectRepo, setVM: (vm: VM) => void): void;
}
