import { DevicePreview } from '../..';

export function setDeviceListFromJSON(deviceList: DeviceList, devicePreview: DevicePreview) {
  devicePreview.deviceList = deviceList.devices;
}

export interface DeviceList {
  devices: { id: string; name: string; x: number; y: number; pixelDensity: number; category: string }[];
}
