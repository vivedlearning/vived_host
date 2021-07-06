import { DevicePreviewListUC, OnSelectedDeviceChange } from "../../Core/DevicePreviewList";

export interface DevicePreviewListVM {
  useDevicePreview: boolean,
  selectedDeviceName: string,
  selectedDeviceX: number,
  selectedDeviceY: number,
  devices: Map<string, DeviceInfoVM[]>
  selectedDeviceID: string;
}
export interface DeviceInfoVM { id: string, name: string; x: number; y: number};

export class DevicePreviewListPM implements OnSelectedDeviceChange {

  deviceUC: DevicePreviewListUC;
  updateView: (viewModel: DevicePreviewListVM) => void;

  devices = new Map<string, DeviceInfoVM[]>();

  constructor(deviceUC: DevicePreviewListUC, updateView: (viewModel: DevicePreviewListVM) => void) {
    const categories = deviceUC.getCategoryList();
    categories.forEach(category => {
      const devicesInCategory = deviceUC.getDevicesInCategory(category);
      const deviceList: DeviceInfoVM[] = devicesInCategory.map((device) => {
        const { id, name, x, y } = device;
        return { id, name, x, y };
      });

      if(deviceList.length > 0)
      {
        this.devices.set(category, deviceList);
      }
    })

    this.deviceUC = deviceUC;
    this.updateView = updateView;
    this.doUpdateView();

    deviceUC.addObserver(this);
  }

  onSelectedDeviceChange = () => {
    this.doUpdateView();
  };

  doUpdateView() {
    const selectedDevice = this.deviceUC.getSelectedDevice();
    if (selectedDevice) {
      this.updateView({
        devices: this.devices,
        selectedDeviceID: selectedDevice.id,
        selectedDeviceName: selectedDevice.name,
        selectedDeviceX: selectedDevice.x,
        selectedDeviceY: selectedDevice.y,
        useDevicePreview: true
      })
    } else {
      this.updateView({
        devices: this.devices,
        selectedDeviceID: "",
        selectedDeviceName: "",
        selectedDeviceX: 0,
        selectedDeviceY: 0,
        useDevicePreview: false
      })
    }
  }

  dispose() {
    this.deviceUC.removeObserver(this);
  }
}
