import { DevicePreviewListUC } from "./Boundary";
import { DevicePreviewListUCImp } from "./UseCaseImp";

export * from "./Boundary";
export function makeDevicePreviewListUC(): DevicePreviewListUC {
  return new DevicePreviewListUCImp();
}
