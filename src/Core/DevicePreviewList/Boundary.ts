export interface OnSelectedDeviceChange {
  onSelectedDeviceChange: () => void;
}

export interface DevicePreviewListUC {
  setDeviceList(devices: DeviceInfo[]): void;
  setSelectedDevice(id: string): void;
  getDeviceList(): DeviceInfo[];
  getSelectedDevice(): DeviceInfo | undefined;
  clearSelectedDevice(): void;
  getCategoryList(): string[];
  getDevicesInCategory(categoryName: string): DeviceInfo[];
  addObserver(observer: OnSelectedDeviceChange): void;
  removeObserver(observer: OnSelectedDeviceChange): void;
}

export interface DeviceInfo {
  id: string;
  name: string;
  x: number;
  y: number;
  pixelDensity: number;
  category: string;
}
