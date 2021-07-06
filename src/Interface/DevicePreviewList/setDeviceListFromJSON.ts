import { DevicePreviewListUC } from '../../Core/DevicePreviewList';

export function setDeviceListFromJSON(deviceList: DeviceList, useCase: DevicePreviewListUC) {
  useCase.setDeviceList(deviceList.devices);
}

export interface DeviceList {
  devices: { id: string; name: string; x: number; y: number; pixelDensity: number; category: string }[];
}
