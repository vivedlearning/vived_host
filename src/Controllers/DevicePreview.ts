import { DevicePreviewUC } from "../Core/DevicePreview";

export function selectDevicePreviewByID(
  id: string,
  useCase: DevicePreviewUC
) {
  useCase.setSelectedDevice(id);
}

export function clearSelectedDevicePreview(useCase: DevicePreviewUC) {
  useCase.clearSelectedDevice();
}

export function setDeviceListFromJSON(
  deviceList: DeviceList,
  useCase: DevicePreviewUC
) {
  useCase.setDeviceList(deviceList.devices);
}

interface DeviceList {
  devices: { id: string, name: string; x: number; y: number }[];
}
