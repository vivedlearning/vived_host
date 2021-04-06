import { DevicePreviewUC, OnSelectedDeviceChange } from "../Core/DevicePreview";

export class DevicePreviewPM implements OnSelectedDeviceChange {
  public get useDevicePreview() {
    return this._useDevicePreview;
  }
  private _useDevicePreview = false;

  public get selectedDeviceName() {
    return this._selectedDeviceName;
  }
  private _selectedDeviceName = "";

  public get selectedDeviceX() {
    return this._selectedDeviceX;
  }
  private _selectedDeviceX = 0;

  public get selectedDeviceY() {
    return this._selectedDeviceY;
  }
  private _selectedDeviceY = 0;

  public get devices() {
    return [...this._devices];
  }
  private _devices: { id: string, name: string; x: number; y: number }[] = [];

  public get selectedID() {
    return this._selectedID;
  }
  private _selectedID = "";

  deviceUC: DevicePreviewUC;
  updateView: () => void;

  constructor(deviceUC: DevicePreviewUC, updateView: () => void) {
    const selectedDevice = deviceUC.getSelectedDevice();

    if (selectedDevice) {
      this._useDevicePreview = true;
      this._selectedDeviceName = selectedDevice.name;
      this._selectedDeviceX = selectedDevice.x;
      this._selectedDeviceY = selectedDevice.y;
      this._selectedID = selectedDevice.id;
    }

    const deviceList = deviceUC.getDeviceList();
    this._devices = deviceList.map((device) => {
      const { id, name, x, y } = device;
      return { id, name, x, y };
    });

    this.deviceUC = deviceUC;
    this.updateView = updateView;

    deviceUC.addObserver(this);
  }

  onSelectedDeviceChange = () => {
    const selectedDevice = this.deviceUC.getSelectedDevice();

    if (selectedDevice) {
      this._useDevicePreview = true;
      this._selectedDeviceName = selectedDevice.name;
      this._selectedDeviceX = selectedDevice.x;
      this._selectedDeviceY = selectedDevice.y;
      this._selectedID = selectedDevice.id;
    } else {
      this._useDevicePreview = false;
      this._selectedDeviceName = "";
      this._selectedDeviceX = 0;
      this._selectedDeviceY = 0;
      this._selectedID = "";
    }

    this.updateView();
  };

  dispose() {
    this.deviceUC.removeObserver(this);
  }
}
