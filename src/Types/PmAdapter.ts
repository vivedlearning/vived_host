import { HostAppObjectRepo } from "../HostAppObject";

export interface PmAdapter<VM> {
  defaultVM: VM;
  subscribe(
    id: string,
    appObjects: HostAppObjectRepo,
    setVM: (vm: VM) => void
  ): void;
  unsubscribe(
    id: string,
    appObjects: HostAppObjectRepo,
    setVM: (vm: VM) => void
  ): void;
}
