import * as BOUNDARY from './boundary';
import { DuplicateDeviceIDError } from './DuplicateDeviceIDError';
import * as ENTITY from './entities';
import { InvalidDeviceIDError } from './InvalidDeviceIDError';

export class DevicePreviewUCImp implements BOUNDARY.DevicePreviewUC {
  private selectedDevice = '';
  private devices = new Map<string, ENTITY.Device>();
  private observers: BOUNDARY.OnSelectedDeviceChange[] = [];
  private catagories: string[] = [];

  getDeviceList(): BOUNDARY.DeviceInfo[] {
    const deviceArray = Array.from(this.devices.values());
    return deviceArray.map((d) => this.entityToBoundary(d));
  }

  addObserver(observer: BOUNDARY.OnSelectedDeviceChange): void {
    this.observers.push(observer);
  }

  removeObserver(observer: BOUNDARY.OnSelectedDeviceChange): void {
    const index = this.observers.indexOf(observer);
    if (index >= 0) {
      this.observers.splice(index, 1);
    }
  }

  setDeviceList(devices: BOUNDARY.DeviceInfo[]): void {
    devices.forEach((deviceInfo) => {
      const device = this.boundaryToEntity(deviceInfo);

      if (this.devices.has(device.id)) {
        throw new DuplicateDeviceIDError(device.id);
      }

      this.devices.set(device.id, device);

      if (!this.catagories.includes(device.category)) {
        this.catagories.push(device.category);
      }
    });
  }

  setSelectedDevice(id: string): void {
    if (id === this.selectedDevice) return;

    const device = this.getDeviceByID(id);

    if (!device) return;

    this.selectedDevice = id;
    this.notify();
  }

  getSelectedDevice(): BOUNDARY.DeviceInfo | undefined {
    if (!this.selectedDevice) {
      return undefined;
    }

    const device = this.getDeviceByID(this.selectedDevice);

    if (device) {
      return this.entityToBoundary(device);
    }
  }

  clearSelectedDevice(): void {
    if (this.selectedDevice) {
      this.selectedDevice = '';
      this.notify();
    }
  }

  getCategoryList(): string[] {
    return [...this.catagories];
  }

  getDevicesInCategory(categoryName: string): BOUNDARY.DeviceInfo[] {
    const deviceArray = Array.from(this.devices.values());

    const list: BOUNDARY.DeviceInfo[] = []

    deviceArray.forEach(device=>{
      if(device.category === categoryName)
      {
        list.push(this.entityToBoundary(device));
      }
    })

    return list;
  }

  private getDeviceByID(id: string) {
    if (!this.devices.has(id)) {
      throw new InvalidDeviceIDError(id);
    }

    return this.devices.get(id);
  }

  private entityToBoundary(deviceEntity: ENTITY.Device): BOUNDARY.DeviceInfo {
    const { id, name, x, y, pixelDensity, category } = deviceEntity;
    return { id, name, x, y, pixelDensity, category };
  }

  private boundaryToEntity(device: BOUNDARY.DeviceInfo): ENTITY.Device {
    const { id, name, x, y, pixelDensity, category } = device;
    return { id, name, x, y, pixelDensity, category };
  }

  private notify() {
    this.observers.forEach((obs) => obs.onSelectedDeviceChange());
  }
}
