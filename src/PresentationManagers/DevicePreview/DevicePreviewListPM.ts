import { DevicePreview } from "../..";


export interface DevicePreviewListVM {
  useDevicePreview: boolean;
  selectedDeviceName: string;
  selectedDeviceX: number;
  selectedDeviceY: number;
  selectedDeviceID: string;
  catagorizedDevices: Map<string, DeviceInfoVM[]>;
}
export interface DeviceInfoVM {
  id: string;
  name: string;
  x: number;
  y: number;
}

export class DevicePreviewListPM {
  devicePreview: DevicePreview;
  updateView: (viewModel: DevicePreviewListVM) => void;

  devices = new Map<string, DeviceInfoVM[]>();

  doUpdateView = () => {
    const selectedDevice = this.devicePreview.selectedDevice
    if (selectedDevice) {
      this.updateView({
        catagorizedDevices: this.devices,
        selectedDeviceID: selectedDevice.id,
        selectedDeviceName: selectedDevice.name,
        selectedDeviceX: selectedDevice.x,
        selectedDeviceY: selectedDevice.y,
        useDevicePreview: true,
      });
    } else {
      this.updateView({
        catagorizedDevices: this.devices,
        selectedDeviceID: '',
        selectedDeviceName: '',
        selectedDeviceX: 0,
        selectedDeviceY: 0,
        useDevicePreview: false,
      });
    }
  };

  dispose() {
    this.devicePreview.removeObserver(this.doUpdateView);
  }

  constructor(devicePreview: DevicePreview, updateView: (viewModel: DevicePreviewListVM) => void) {
    const categories = devicePreview.getCategoryList();
    categories.forEach((category) => {
      const devicesInCategory = devicePreview.getDevicesInCategory(category);
      const deviceList: DeviceInfoVM[] = devicesInCategory.map((device) => {
        const { id, name, x, y } = device;
        return { id, name, x, y };
      });

      if (deviceList.length > 0) {
        this.devices.set(category, deviceList);
      }
    });

    this.devicePreview = devicePreview;
    this.updateView = updateView;
    this.doUpdateView();

    devicePreview.addObserver(this.doUpdateView);
  }
}
