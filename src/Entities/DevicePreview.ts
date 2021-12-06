import { ObserverList } from './ObserverList';

export type OnDevicePreviewChange = () => void;

export interface DeviceInfo {
  id: string;
  name: string;
  x: number;
  y: number;
  pixelDensity: number;
  category: string;
}

export interface DevicePreview {
  deviceList: DeviceInfo[];
  selectedDevice?: DeviceInfo;

  setSelectedDevice(id: string): void;
  clearSelectedDevice(): void;

  getCategoryList(): string[];
  getDevicesInCategory(categoryName: string): DeviceInfo[];

  addObserver(observer: OnDevicePreviewChange): void;
  removeObserver(observer: OnDevicePreviewChange): void;
}

export function makeDevicePreview(): DevicePreview {
  return new DevicePreviewImp();
}

class DevicePreviewImp implements DevicePreview {
  private _deviceLookup = new Map<string, DeviceInfo>();

  get deviceList(): DeviceInfo[] {
    return Array.from(this._deviceLookup.values());
  }
  set deviceList(list: DeviceInfo[]) {
    this._deviceLookup.clear();
    list.forEach((device) => this._deviceLookup.set(device.id, device));
    this.observers.notify();
  }

  private _selectedDevice?: DeviceInfo | undefined;
  get selectedDevice() {
    return this._selectedDevice;
  }

  private observers = new ObserverList<void>();

  setSelectedDevice = (id: string): void => {
    const device = this._deviceLookup.get(id);

    if (!device) {
      console.warn(`[DevicePreview] Unable to find device by id ${id}`);
      return;
    }

    if (this._selectedDevice?.id === device.id) return;

    this._selectedDevice = device;
    this.observers.notify();
  };
  clearSelectedDevice = (): void => {
    if (this._selectedDevice === undefined) return;

    this._selectedDevice = undefined;
    this.observers.notify();
  };

  getCategoryList = (): string[] => {
    const categories: string[] = [];
    this._deviceLookup.forEach((device) => {
      if (!categories.includes(device.category)) {
        categories.push(device.category);
      }
    });

    return categories;
  };

  getDevicesInCategory = (categoryName: string): DeviceInfo[] => {
    const devices: DeviceInfo[] = [];

    this._deviceLookup.forEach((device) => {
      if (device.category === categoryName) {
        devices.push(device);
      }
    });

    return devices;
  };

  addObserver = (observer: OnDevicePreviewChange): void => {
    this.observers.add(observer);
  };
  removeObserver = (observer: OnDevicePreviewChange): void => {
    this.observers.remove(observer);
  };
}
